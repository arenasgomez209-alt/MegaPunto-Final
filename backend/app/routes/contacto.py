from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import contacts_collection
from app.schemas import ContactCreate, ContactStatusUpdate
from app.security import require_staff

router = APIRouter(prefix="/api/contacto", tags=["Contacto"])

def serialize_contact(msg: dict) -> dict:
    if not msg:
        return None
    m = msg.copy()
    m["id"] = str(m["_id"])
    m["_id"] = str(m["_id"])
    return m

@router.post("", status_code=status.HTTP_201_CREATED, response_model=None)
async def enviar_mensaje(data: ContactCreate):
    """Permite a clientes y visitantes enviar un mensaje de contacto o PQRS."""
    doc = data.dict()
    doc["estado"] = "Pendiente"
    doc["fecha"] = datetime.now(timezone.utc).strftime("%d/%m/%Y %I:%M %p")
    doc["fechaISO"] = datetime.now(timezone.utc).isoformat()

    result = await contacts_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    return {
        "success": True,
        "message": "Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto contigo pronto.",
        "data": serialize_contact(doc)
    }

@router.get("", response_model=None)
async def listar_mensajes(
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    current_user: dict = Depends(require_staff)
):
    """Consulta mensajes de contacto. Requiere rol de Administrador o Empleado."""
    query = {}
    if estado and estado != "Todos":
        query["estado"] = estado

    cursor = contacts_collection.find(query).sort("fechaISO", -1)
    messages = []
    async for doc in cursor:
        messages.append(serialize_contact(doc))

    return {
        "success": True,
        "count": len(messages),
        "messages": messages
    }

@router.patch("/{id}/status", response_model=None)
async def actualizar_estado_mensaje(
    id: str,
    data: ContactStatusUpdate,
    current_user: dict = Depends(require_staff)
):
    """Actualiza el estado de atención del mensaje. Requiere rol de Administrador o Empleado."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de mensaje inválido.")

    result = await contacts_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"estado": data.estado}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mensaje no encontrado.")

    return {
        "success": True,
        "message": f"Estado de consulta actualizado a {data.estado}."
    }
