import io
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from app.database import sales_collection

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])

def format_cop(val: float) -> str:
    return f"${val:,.0f} COP".replace(",", ".")

async def get_sales_for_date(fecha: str):
    # Match date prefix YYYY-MM-DD
    regex_pattern = f"^{fecha}"
    cursor = sales_collection.find({"fecha": {"$regex": regex_pattern}}).sort("fecha", 1)
    sales = []
    async for s in cursor:
        s["_id"] = str(s["_id"])
        s["id"] = s["_id"]
        sales.append(s)
    return sales

@router.get("/ventas/diario")
async def get_daily_sales_report(fecha: Optional[str] = Query(None, description="Fecha YYYY-MM-DD")):
    """Consulta consolidada del reporte diario de ventas."""
    target_date = fecha or datetime.now().strftime("%Y-%m-%d")
    sales = await get_sales_for_date(target_date)

    total_ventas = len(sales)
    monto_total = sum(float(s.get("total", 0)) for s in sales)
    subtotal_total = sum(float(s.get("subtotal", 0)) for s in sales)
    impuestos_total = sum(float(s.get("impuestos", 0)) for s in sales)
    items_vendidos = sum(sum(int(it.get("cantidad", 1)) for it in s.get("items", [])) for s in sales)

    return {
        "success": True,
        "fecha": target_date,
        "total_operaciones": total_ventas,
        "total_items_vendidos": items_vendidos,
        "subtotal": subtotal_total,
        "impuestos": impuestos_total,
        "total_general": monto_total,
        "ventas": sales
    }

@router.get("/ventas/diario/pdf")
async def export_daily_sales_pdf(fecha: Optional[str] = Query(None, description="Fecha YYYY-MM-DD")):
    """Genera y descarga el reporte diario de ventas en formato PDF."""
    target_date = fecha or datetime.now().strftime("%Y-%m-%d")
    sales = await get_sales_for_date(target_date)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(letter),
        rightMargin=30,
        leftMargin=30,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'RepTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0f172a')
    )

    sub_style = ParagraphStyle(
        'RepSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#64748b')
    )

    th_style = ParagraphStyle(
        'RepTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    td_style = ParagraphStyle(
        'RepTD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    td_bold_style = ParagraphStyle(
        'RepTDBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0f172a')
    )

    story = []

    # Cabecera del Reporte
    now_print = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header_content = [
        [
            Paragraph("<b>MEGAPUNTO COLOMBIA - SISTEMA DE GESTIÓN COMERCIAL</b><br/>"
                      f"<font color='#ea580c'><b>REPORTE DIARIO CONSOLIDADO DE VENTAS</b></font>", title_style),
            Paragraph(f"<b>Fecha Reportada:</b> {target_date}<br/>"
                      f"<b>Generado el:</b> {now_print}<br/>"
                      f"<b>Entorno:</b> SENA Ficha 3406204", sub_style)
        ]
    ]
    hdr_table = Table(header_content, colWidths=[6.0 * 72, 4.0 * 72])
    hdr_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(hdr_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#ea580c'), spaceAfter=12))

    # Tabla de Ventas
    headers = [
        Paragraph("Nº Venta", th_style),
        Paragraph("Hora", th_style),
        Paragraph("Cliente", th_style),
        Paragraph("Documento", th_style),
        Paragraph("Productos / Servicios", th_style),
        Paragraph("Cant.", th_style),
        Paragraph("Subtotal", th_style),
        Paragraph("IVA", th_style),
        Paragraph("Total", th_style),
        Paragraph("Estado", th_style)
    ]
    rows = [headers]

    total_monto = 0.0
    total_cant = 0
    total_iva = 0.0
    total_sub = 0.0

    if sales:
        for s in sales:
            hora = s.get("fecha", "")[11:16] or "--:--"
            cliente = s.get("cliente_nombre", "Consumidor Final")
            doc_cli = s.get("cliente_documento", "N/A")
            
            # Formatear lista de ítems
            items_str = "<br/>".join([f"• {it.get('nombre', 'Item')} (x{it.get('cantidad', 1)})" for it in s.get("items", [])])
            cant_items = sum(int(it.get("cantidad", 1)) for it in s.get("items", []))
            
            sub = float(s.get("subtotal", 0))
            iva = float(s.get("impuestos", 0))
            tot = float(s.get("total", 0))

            total_monto += tot
            total_cant += cant_items
            total_iva += iva
            total_sub += sub

            rows.append([
                Paragraph(s.get("numero_venta", "N/A"), td_bold_style),
                Paragraph(hora, td_style),
                Paragraph(cliente, td_style),
                Paragraph(doc_cli, td_style),
                Paragraph(items_str or "Venta General", td_style),
                Paragraph(str(cant_items), td_style),
                Paragraph(format_cop(sub), td_style),
                Paragraph(format_cop(iva), td_style),
                Paragraph(format_cop(tot), td_bold_style),
                Paragraph(s.get("estado", "Completada"), td_style)
            ])
    else:
        rows.append([
            Paragraph("No se registraron ventas en esta fecha seleccionada.", td_style),
            "", "", "", "", "", "", "", "", ""
        ])

    col_widths = [1.1 * 72, 0.6 * 72, 1.4 * 72, 1.0 * 72, 2.5 * 72, 0.5 * 72, 0.9 * 72, 0.7 * 72, 1.0 * 72, 0.8 * 72]
    sales_table = Table(rows, colWidths=col_widths)
    sales_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(sales_table)
    story.append(Spacer(1, 14))

    # Totales Finales
    totals_content = [
        [
            "",
            Paragraph(f"<b>Operaciones Totales:</b> {len(sales)}", td_style),
            Paragraph(f"<b>Unidades Vendidas:</b> {total_cant}", td_style),
            Paragraph(f"<b>Subtotal:</b> {format_cop(total_sub)}", td_style),
            Paragraph(f"<b>IVA Acumulado:</b> {format_cop(total_iva)}", td_style),
            Paragraph(f"<b>TOTAL GENERAL: {format_cop(total_monto)}</b>", ParagraphStyle('TotG', parent=td_bold_style, fontSize=9, textColor=colors.HexColor('#ea580c')))
        ]
    ]
    tot_table = Table(totals_content, colWidths=[2.5 * 72, 1.5 * 72, 1.5 * 72, 1.5 * 72, 1.5 * 72, 2.0 * 72])
    tot_table.setStyle(TableStyle([
        ('BACKGROUND', (1, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('BOX', (1, 0), (-1, -1), 1, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(tot_table)

    doc.build(story)
    buffer.seek(0)

    filename = f"Reporte_Ventas_{target_date}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/ventas/diario/excel")
async def export_daily_sales_excel(fecha: Optional[str] = Query(None, description="Fecha YYYY-MM-DD")):
    """Genera y descarga el reporte diario de ventas en formato Microsoft Excel (.xlsx)."""
    target_date = fecha or datetime.now().strftime("%Y-%m-%d")
    sales = await get_sales_for_date(target_date)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = f"Ventas {target_date}"
    ws.views.sheetView[0].showGridLines = True

    # Paleta de Colores
    header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    title_font = Font(name="Calibri", size=14, bold=True, color="EA580C")
    sub_font = Font(name="Calibri", size=10, italic=True, color="475569")
    header_font = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
    cell_font = Font(name="Calibri", size=10)
    bold_cell_font = Font(name="Calibri", size=10, bold=True)
    total_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")

    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    # Títulos
    ws["A1"] = "MEGAPUNTO COLOMBIA S.A.S. - REPORTE DIARIO DE VENTAS"
    ws["A1"].font = title_font
    ws["A2"] = f"Fecha de reporte: {target_date} | Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Ficha SENA: 3406204"
    ws["A2"].font = sub_font

    # Encabezados de Columna
    headers = [
        "Nº Venta",
        "Fecha / Hora",
        "Cliente",
        "Documento",
        "Email",
        "Teléfono",
        "Ítems / Descripción",
        "Cantidad",
        "Subtotal (COP)",
        "Descuento (COP)",
        "IVA (19% COP)",
        "Total (COP)",
        "Método de Pago",
        "Estado"
    ]

    header_row = 4
    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=header_row, column=col_idx, value=header)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border
    ws.row_dimensions[header_row].height = 25

    current_row = 5
    for s in sales:
        items_summary = ", ".join([f"{it.get('nombre', '')} (x{it.get('cantidad', 1)})" for it in s.get("items", [])])
        cant = sum(int(it.get("cantidad", 1)) for it in s.get("items", []))
        
        row_values = [
            s.get("numero_venta", ""),
            s.get("fecha", "")[:19].replace("T", " "),
            s.get("cliente_nombre", ""),
            s.get("cliente_documento", "N/A"),
            s.get("cliente_email", ""),
            s.get("cliente_telefono", ""),
            items_summary,
            cant,
            float(s.get("subtotal", 0)),
            float(s.get("descuento", 0)),
            float(s.get("impuestos", 0)),
            float(s.get("total", 0)),
            str(s.get("metodo_pago", "PSE")).upper(),
            s.get("estado", "Completada")
        ]

        for col_idx, val in enumerate(row_values, start=1):
            cell = ws.cell(row=current_row, column=col_idx, value=val)
            cell.font = cell_font
            cell.border = thin_border
            if col_idx in [9, 10, 11, 12]:
                cell.number_format = '$#,##0'
                cell.alignment = Alignment(horizontal="right")
            elif col_idx in [1, 2, 8, 13, 14]:
                cell.alignment = Alignment(horizontal="center")
            else:
                cell.alignment = Alignment(horizontal="left")

        current_row += 1

    # Fila de Totales
    if len(sales) > 0:
        ws.cell(row=current_row, column=1, value="TOTALES ACUMULADOS").font = bold_cell_font
        ws.cell(row=current_row, column=1).fill = total_fill
        for c in range(1, len(headers) + 1):
            ws.cell(row=current_row, column=c).border = thin_border
            ws.cell(row=current_row, column=c).fill = total_fill

        ws.cell(row=current_row, column=8, value=f"=SUM(H5:H{current_row-1})").font = bold_cell_font
        ws.cell(row=current_row, column=9, value=f"=SUM(I5:I{current_row-1})").font = bold_cell_font
        ws.cell(row=current_row, column=9).number_format = '$#,##0'
        ws.cell(row=current_row, column=10, value=f"=SUM(J5:J{current_row-1})").font = bold_cell_font
        ws.cell(row=current_row, column=10).number_format = '$#,##0'
        ws.cell(row=current_row, column=11, value=f"=SUM(K5:K{current_row-1})").font = bold_cell_font
        ws.cell(row=current_row, column=11).number_format = '$#,##0'
        ws.cell(row=current_row, column=12, value=f"=SUM(L5:L{current_row-1})").font = bold_cell_font
        ws.cell(row=current_row, column=12).number_format = '$#,##0'

    # Autoajustar ancho de columnas
    column_widths = {
        'A': 16, 'B': 18, 'C': 22, 'D': 14, 'E': 24, 'F': 14,
        'G': 35, 'H': 10, 'I': 15, 'J': 15, 'K': 14, 'L': 16,
        'M': 16, 'N': 14
    }
    for col_letter, width in column_widths.items():
        ws.column_dimensions[col_letter].width = width

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)

    filename = f"Reporte_Ventas_{target_date}.xlsx"
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
