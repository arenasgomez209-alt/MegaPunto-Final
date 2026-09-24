import io
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from bson import ObjectId
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.database import invoices_collection, invoices_details_collection

router = APIRouter(prefix="/api/facturas", tags=["Facturación"])

def clean_doc(doc: dict) -> dict:
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    doc["id"] = doc["_id"]
    return doc

def format_cop(val: float) -> str:
    return f"${val:,.0f} COP".replace(",", ".")

@router.get("")
async def get_invoices(
    numero_factura: Optional[str] = Query(None),
    cliente_id: Optional[str] = Query(None),
    fecha_inicio: Optional[str] = Query(None),
    fecha_fin: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Consulta facturas con opciones de búsqueda y filtrado."""
    query = {}
    if numero_factura:
        query["numero_factura"] = {"$regex": numero_factura, "$options": "i"}
    if cliente_id:
        query["cliente.id"] = cliente_id
    if fecha_inicio and fecha_fin:
        query["fecha_emision"] = {"$gte": f"{fecha_inicio}T00:00:00", "$lte": f"{fecha_fin}T23:59:59"}
    elif fecha_inicio:
        query["fecha_emision"] = {"$gte": f"{fecha_inicio}T00:00:00"}
    elif fecha_fin:
        query["fecha_emision"] = {"$lte": f"{fecha_fin}T23:59:59"}

    if search:
        query["$or"] = [
            {"numero_factura": {"$regex": search, "$options": "i"}},
            {"cliente.nombre": {"$regex": search, "$options": "i"}},
            {"cliente.email": {"$regex": search, "$options": "i"}},
            {"cliente.documento": {"$regex": search, "$options": "i"}}
        ]

    cursor = invoices_collection.find(query).sort("fecha_emision", -1).limit(limit)
    invoices = []
    async for inv in cursor:
        invoices.append(clean_doc(inv))

    return {
        "success": True,
        "total": len(invoices),
        "invoices": invoices
    }

@router.get("/cliente/{cliente_id}")
async def get_client_invoices(cliente_id: str):
    """Obtiene facturas de un cliente específico."""
    cursor = invoices_collection.find({"cliente.id": cliente_id}).sort("fecha_emision", -1)
    invoices = []
    async for inv in cursor:
        invoices.append(clean_doc(inv))
    return {"success": True, "invoices": invoices}

@router.get("/{invoice_id}")
async def get_invoice(invoice_id: str):
    """Obtiene el detalle de una factura específica."""
    query = {"_id": ObjectId(invoice_id)} if ObjectId.is_valid(invoice_id) else {"numero_factura": invoice_id}
    inv = await invoices_collection.find_one(query)
    if not inv:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return {"success": True, "invoice": clean_doc(inv)}

@router.get("/{invoice_id}/pdf")
async def download_invoice_pdf(invoice_id: str):
    """Genera y descarga la factura oficial en formato PDF."""
    query = {"_id": ObjectId(invoice_id)} if ObjectId.is_valid(invoice_id) else {"numero_factura": invoice_id}
    inv = await invoices_collection.find_one(query)
    if not inv:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#ea580c')
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569')
    )

    header_cell_style = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    body_cell_style = ParagraphStyle(
        'BodyCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    bold_cell_style = ParagraphStyle(
        'BoldCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # Encabezado Comercial
    company_info = """<b>MEGAPUNTO COLOMBIA S.A.S.</b><br/>
    NIT: 901.849.204-1 · Régimen Común<br/>
    Carrera 50 # 45-20, Centro Empresarial MegaPunto, Medellín<br/>
    PBX: (604) 444-2026 · contacto@megapunto.com<br/>
    Resolución DIAN Nº 18764000123 de 2026
    """
    
    invoice_badge = f"""<b>FACTURA DE VENTA ELECTRÓNICA</b><br/>
    <font color="#ea580c" size="+2"><b>{inv.get('numero_factura', 'FAC-0000')}</b></font><br/>
    <b>Fecha:</b> {inv.get('fecha_emision', '')[:10]}<br/>
    <b>Estado:</b> <font color="#16a34a"><b>{inv.get('estado', 'PAGADA').upper()}</b></font><br/>
    <b>Método de Pago:</b> {str(inv.get('metodo_pago', 'PSE')).upper()}
    """

    header_table_data = [
        [Paragraph(company_info, subtitle_style), Paragraph(invoice_badge, subtitle_style)]
    ]
    header_table = Table(header_table_data, colWidths=[3.8 * inch, 3.4 * inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#ea580c'), spaceAfter=14))

    # Datos del Cliente
    cliente = inv.get("cliente", {})
    cliente_data = [
        [
            Paragraph(f"<b>ADQUIRIENTE / CLIENTE:</b>", bold_cell_style),
            Paragraph(f"<b>DOCUMENTO:</b> {cliente.get('documento') or 'No registrado'}", body_cell_style)
        ],
        [
            Paragraph(f"<b>Nombre:</b> {cliente.get('nombre', 'Consumidor Final')}", body_cell_style),
            Paragraph(f"<b>Teléfono:</b> {cliente.get('telefono') or 'No registrado'}", body_cell_style)
        ],
        [
            Paragraph(f"<b>Correo Electrónico:</b> {cliente.get('email', 'No registrado')}", body_cell_style),
            Paragraph(f"<b>Dirección:</b> {cliente.get('direccion') or 'Medellín, Colombia'}", body_cell_style)
        ]
    ]
    cliente_table = Table(cliente_data, colWidths=[3.8 * inch, 3.4 * inch])
    cliente_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(cliente_table)
    story.append(Spacer(1, 14))

    # Tabla de Ítems
    items_header = [
        Paragraph("Ítem / Descripción", header_cell_style),
        Paragraph("Tipo", header_cell_style),
        Paragraph("Cant.", header_cell_style),
        Paragraph("Precio Unitario", header_cell_style),
        Paragraph("Descuento", header_cell_style),
        Paragraph("Subtotal", header_cell_style),
    ]
    table_rows = [items_header]

    for it in inv.get("items", []):
        table_rows.append([
            Paragraph(str(it.get("nombre", "Producto")), body_cell_style),
            Paragraph(str(it.get("tipo", "Producto")), body_cell_style),
            Paragraph(str(it.get("cantidad", 1)), body_cell_style),
            Paragraph(format_cop(float(it.get("precio_unitario", 0))), body_cell_style),
            Paragraph(format_cop(float(it.get("descuento", 0))), body_cell_style),
            Paragraph(format_cop(float(it.get("subtotal", 0))), bold_cell_style),
        ])

    items_table = Table(table_rows, colWidths=[2.6 * inch, 0.9 * inch, 0.6 * inch, 1.2 * inch, 0.9 * inch, 1.0 * inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ea580c')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 12))

    # Resumen de Totales
    subtotal = float(inv.get("subtotal", 0))
    impuestos = float(inv.get("impuestos", 0))
    descuento = float(inv.get("descuento", 0))
    total = float(inv.get("total", 0))

    totals_data = [
        ["", Paragraph("<b>Subtotal Gravable:</b>", body_cell_style), Paragraph(format_cop(subtotal), bold_cell_style)],
        ["", Paragraph("<b>Descuentos:</b>", body_cell_style), Paragraph(format_cop(descuento), body_cell_style)],
        ["", Paragraph("<b>IVA Liquidado (19%):</b>", body_cell_style), Paragraph(format_cop(impuestos), bold_cell_style)],
        ["", Paragraph("<b>TOTAL A PAGAR:</b>", ParagraphStyle('Tot', parent=bold_cell_style, fontSize=11, textColor=colors.HexColor('#ea580c'))),
         Paragraph(f"<b>{format_cop(total)}</b>", ParagraphStyle('TotV', parent=bold_cell_style, fontSize=11, textColor=colors.HexColor('#ea580c')))]
    ]
    totals_table = Table(totals_data, colWidths=[4.2 * inch, 1.6 * inch, 1.4 * inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('LINEABOVE', (1, 3), (2, 3), 1, colors.HexColor('#ea580c')),
    ]))
    story.append(totals_table)
    story.append(Spacer(1, 20))

    # Pie de Página
    footer_text = """<font color="#64748b" size="7.5">
    Esta factura de venta es un título valor en los términos del artículo 772 del Código de Comercio de Colombia.<br/>
    Generado automáticamente por la plataforma Full Stack MEGAPUNTO - SENA Centro Tecnológico del Mobiliario - Ficha 3406204.<br/>
    Gracias por su compra en MEGAPUNTO.
    </font>"""
    story.append(Paragraph(footer_text, ParagraphStyle('Foot', parent=styles['Normal'], alignment=1)))

    doc.build(story)
    buffer.seek(0)

    filename = f"Factura_{inv.get('numero_factura', '0000')}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
