from datetime import datetime, timezone
import random
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from bson import ObjectId
from app.database import pqr_collection
from app.schemas import PQRCreate, PQRUpdateStatus

router = APIRouter(prefix="/api/pqr", tags=["PQR - Peticiones, Quejas y Reclamos"])

def clean_doc(doc: dict) -> dict:
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    doc["id"] = doc["_id"]
    return doc

def generate_radicado():
    date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    rand_suffix = random.randint(1000, 9999)
    return f"PQR-{date_str}-{rand_suffix}"

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_pqr(
    pqr_in: PQRCreate,
    cliente_id: Optional[str] = Query(None),
    cliente_nombre: Optional[str] = Query(None),
    cliente_email: Optional[str] = Query(None)
):
    """Radica una nueva solicitud de PQR para atención al cliente."""
    radicado = generate_radicado()
    now_iso = datetime.now(timezone.utc).isoformat()

    doc = {
        "radicado": radicado,
        "cliente_id": cliente_id or "Anonimo",
        "cliente_nombre": cliente_nombre or "Cliente MEGAPUNTO",
        "cliente_email": cliente_email or "cliente@megapunto.com",
        "tipo": pqr_in.tipo,
        "asunto": pqr_in.asunto,
        "descripcion": pqr_in.descripcion,
        "estado": "Pendiente",
        "respuesta": None,
        "atendido_por": None,
        "fecha_creacion": now_iso,
        "fecha_respuesta": None
    }

    res = await pqr_collection.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    doc["id"] = doc["_id"]

    return {
        "success": True,
        "message": f"PQR radicada exitosamente con el número {radicado}",
        "pqr": clean_doc(doc)
    }

@router.get("")
async def get_pqrs(
    estado: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    cliente_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500)
):
    """Consulta la lista de PQRs registradas con filtros por estado, tipo o búsqueda."""
    query = {}
    if estado and estado != "Todos":
        query["estado"] = estado
    if tipo and tipo != "Todos":
        query["tipo"] = tipo
    if cliente_id:
        query["cliente_id"] = cliente_id

    if search:
        query["$or"] = [
            {"radicado": {"$regex": search, "$options": "i"}},
            {"asunto": {"$regex": search, "$options": "i"}},
            {"cliente_nombre": {"$regex": search, "$options": "i"}},
            {"cliente_email": {"$regex": search, "$options": "i"}}
        ]

    cursor = pqr_collection.find(query).sort("fecha_creacion", -1).limit(limit)
    pqrs = []
    async for p in cursor:
        pqrs.append(clean_doc(p))

    return {
        "success": True,
        "total": len(pqrs),
        "pqrs": pqrs
    }

@router.get("/cliente/{cliente_id}")
async def get_client_pqrs(cliente_id: str):
    """Obtiene las PQRs radicadas por un cliente específico."""
    cursor = pqr_collection.find({"cliente_id": cliente_id}).sort("fecha_creacion", -1)
    pqrs = []
    async for p in cursor:
        pqrs.append(clean_doc(p))
    return {"success": True, "pqrs": pqrs}

@router.get("/{pqr_id}")
async def get_pqr(pqr_id: str):
    """Obtiene el detalle de una PQR por su ID o Radicado."""
    query = {"_id": ObjectId(pqr_id)} if ObjectId.is_valid(pqr_id) else {"radicado": pqr_id}
    p = await pqr_collection.find_one(query)
    if not p:
        raise HTTPException(status_code=404, detail="PQR no encontrada")
    return {"success": True, "pqr": clean_doc(p)}

@router.patch("/{pqr_id}/estado")
async def update_pqr_status(
    pqr_id: str,
    update_data: PQRUpdateStatus,
    atendido_por: Optional[str] = Query("Equipo de Soporte MEGAPUNTO")
):
    """Actualiza el estado y respuesta de una PQR (Empleado / Administrador)."""
    query = {"_id": ObjectId(pqr_id)} if ObjectId.is_valid(pqr_id) else {"radicado": pqr_id}
    pqr = await pqr_collection.find_one(query)
    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    valid_statuses = ["Pendiente", "En Proceso", "Respondida", "Cerrada"]
    if update_data.estado not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Estado inválido. Valores permitidos: {', '.join(valid_statuses)}"
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    fields_to_update = {
        "estado": update_data.estado,
        "atendido_por": atendido_por
    }

    if update_data.respuesta:
        fields_to_update["respuesta"] = update_data.respuesta
        fields_to_update["fecha_respuesta"] = now_iso

    await pqr_collection.update_one(query, {"$set": fields_to_update})
    updated_pqr = await pqr_collection.find_one(query)

    return {
        "success": True,
        "message": f"PQR {updated_pqr.get('radicado')} actualizada a '{update_data.estado}' exitosamente.",
        "pqr": clean_doc(updated_pqr)
    }
