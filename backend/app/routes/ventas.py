from datetime import datetime, timezone
import random
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from bson import ObjectId
from app.database import (
    sales_collection,
    sales_details_collection,
    invoices_collection,
    invoices_details_collection,
    products_collection,
    users_collection
)
from app.schemas import SaleCreate, SaleResponse
from app.security import get_current_user, require_staff

router = APIRouter(prefix="/api/ventas", tags=["Ventas y Detalle de Ventas"])

def clean_doc(doc: dict) -> dict:
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    doc["id"] = doc["_id"]
    return doc

def generate_sale_number():
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    rand_suffix = random.randint(1000, 9999)
    return f"VTA-{date_str}-{rand_suffix}"

def generate_invoice_number():
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    rand_suffix = random.randint(1000, 9999)
    return f"FAC-{date_str}-{rand_suffix}"

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sale(sale_in: SaleCreate):
    """
    Registra una venta desde el sitio web o panel,
    descuenta stock, crea el detalle_ventas y genera automáticamente la factura.
    """
    if not sale_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La venta debe incluir al menos un producto o servicio."
        )

    # Calculate item values
    subtotal = 0.0
    processed_items = []
    
    for it in sale_in.items:
        item_subtotal = it.cantidad * it.precio_unitario
        item_discount = it.descuento or 0.0
        item_total = max(0.0, item_subtotal - item_discount)
        subtotal += item_total

        processed_items.append({
            "item_id": it.item_id,
            "nombre": it.nombre,
            "tipo": it.tipo,
            "cantidad": it.cantidad,
            "precio_unitario": it.precio_unitario,
            "descuento": item_discount,
            "subtotal": item_subtotal,
            "total": item_total
        })

        # Decrement stock if valid ObjectId and product
        if it.tipo == "Producto":
            try:
                if ObjectId.is_valid(it.item_id):
                    await products_collection.update_one(
                        {"_id": ObjectId(it.item_id), "stock": {"$gte": it.cantidad}},
                        {"$inc": {"stock": -it.cantidad}}
                    )
            except Exception:
                pass

    # Tax calculation (IVA 19% standard in Colombia)
    impuestos = round(subtotal * 0.19, 2)
    descuento_global = sale_in.descuento_global or 0.0
    total = max(0.0, round(subtotal + impuestos - descuento_global, 2))
    
    sale_num = generate_sale_number()
    now_iso = datetime.now(timezone.utc).isoformat()

    sale_doc = {
        "numero_venta": sale_num,
        "cliente_id": sale_in.cliente_id,
        "cliente_nombre": sale_in.cliente_nombre,
        "cliente_email": sale_in.cliente_email,
        "cliente_telefono": sale_in.cliente_telefono,
        "cliente_documento": sale_in.cliente_documento,
        "direccion_envio": sale_in.direccion_envio,
        "metodo_pago": sale_in.metodo_pago,
        "subtotal": round(subtotal, 2),
        "descuento": round(descuento_global, 2),
        "impuestos": round(impuestos, 2),
        "total": total,
        "fecha": now_iso,
        "estado": "Completada",
        "notas": sale_in.notas,
        "items": processed_items
    }

    insert_result = await sales_collection.insert_one(sale_doc)
    sale_id_str = str(insert_result.inserted_id)

    # Insert individual items into detalle_ventas collection
    for item in processed_items:
        detail_doc = {
            "venta_id": sale_id_str,
            "numero_venta": sale_num,
            "item_id": item["item_id"],
            "nombre": item["nombre"],
            "tipo": item["tipo"],
            "cantidad": item["cantidad"],
            "precio_unitario": item["precio_unitario"],
            "descuento": item["descuento"],
            "subtotal": item["subtotal"],
            "total": item["total"],
            "fecha": now_iso
        }
        await sales_details_collection.insert_one(detail_doc)

    # Generate corresponding Invoice (Factura)
    invoice_num = generate_invoice_number()
    invoice_doc = {
        "numero_factura": invoice_num,
        "venta_id": sale_id_str,
        "numero_venta": sale_num,
        "fecha_emision": now_iso,
        "cliente": {
            "id": sale_in.cliente_id,
            "nombre": sale_in.cliente_nombre,
            "email": sale_in.cliente_email,
            "telefono": sale_in.cliente_telefono,
            "documento": sale_in.cliente_documento,
            "direccion": sale_in.direccion_envio
        },
        "items": processed_items,
        "subtotal": round(subtotal, 2),
        "impuestos": round(impuestos, 2),
        "descuento": round(descuento_global, 2),
        "total": total,
        "metodo_pago": sale_in.metodo_pago,
        "estado": "Pagada"
    }
    inv_res = await invoices_collection.insert_one(invoice_doc)
    inv_id_str = str(inv_res.inserted_id)

    # Insert into detalle_facturas
    for item in processed_items:
        await invoices_details_collection.insert_one({
            "factura_id": inv_id_str,
            "numero_factura": invoice_num,
            "item_id": item["item_id"],
            "nombre": item["nombre"],
            "cantidad": item["cantidad"],
            "precio_unitario": item["precio_unitario"],
            "subtotal": item["subtotal"],
            "impuestos": round(item["subtotal"] * 0.19, 2),
            "total": item["total"]
        })

    sale_doc["_id"] = sale_id_str
    sale_doc["id"] = sale_id_str
    sale_doc["factura_id"] = inv_id_str
    sale_doc["numero_factura"] = invoice_num

    return {
        "success": True,
        "message": "Venta registrada exitosamente y factura generada",
        "sale": clean_doc(sale_doc)
    }

@router.get("")
async def get_sales(
    fecha_inicio: Optional[str] = Query(None, description="Fecha inicial YYYY-MM-DD"),
    fecha_fin: Optional[str] = Query(None, description="Fecha final YYYY-MM-DD"),
    cliente_id: Optional[str] = Query(None),
    estado: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Consulta el historial de ventas con filtros avanzados."""
    query = {}

    if cliente_id:
        query["cliente_id"] = cliente_id

    if estado and estado != "Todos":
        query["estado"] = estado

    if fecha_inicio and fecha_fin:
        query["fecha"] = {"$gte": f"{fecha_inicio}T00:00:00", "$lte": f"{fecha_fin}T23:59:59"}
    elif fecha_inicio:
        query["fecha"] = {"$gte": f"{fecha_inicio}T00:00:00"}
    elif fecha_fin:
        query["fecha"] = {"$lte": f"{fecha_fin}T23:59:59"}

    if search:
        query["$or"] = [
            {"numero_venta": {"$regex": search, "$options": "i"}},
            {"cliente_nombre": {"$regex": search, "$options": "i"}},
            {"cliente_email": {"$regex": search, "$options": "i"}},
            {"items.nombre": {"$regex": search, "$options": "i"}}
        ]

    cursor = sales_collection.find(query).sort("fecha", -1).limit(limit)
    sales = []
    async for s in cursor:
        sales.append(clean_doc(s))

    return {
        "success": True,
        "total": len(sales),
        "sales": sales
    }

@router.get("/cliente/{cliente_id}")
async def get_client_sales(cliente_id: str):
    """Obtiene el historial de compras de un cliente específico."""
    cursor = sales_collection.find({"cliente_id": cliente_id}).sort("fecha", -1)
    sales = []
    async for s in cursor:
        sales.append(clean_doc(s))
    return {"success": True, "sales": sales}

@router.get("/{sale_id}")
async def get_sale_detail(sale_id: str):
    """Consulta una venta específica con su detalle completo."""
    query = {"_id": ObjectId(sale_id)} if ObjectId.is_valid(sale_id) else {"numero_venta": sale_id}
    sale = await sales_collection.find_one(query)
    if not sale:
        raise HTTPException(status_code=404, detail="Venta no encontrada")

    sale_id_str = str(sale["_id"])
    details_cursor = sales_details_collection.find({"venta_id": sale_id_str})
    details = []
    async for d in details_cursor:
        details.append(clean_doc(d))

    clean_s = clean_doc(sale)
    clean_s["detalle_items"] = details
    return {"success": True, "sale": clean_s}
