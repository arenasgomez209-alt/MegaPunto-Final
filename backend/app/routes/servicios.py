from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.database import services_collection
from app.schemas import ServiceCreate, ServiceUpdate, ServiceResponse
from app.security import require_staff

router = APIRouter(prefix="/api/servicios", tags=["Servicios"])

def serialize_service(srv: dict) -> dict:
    if not srv:
        return None
    s = srv.copy()
    s["id"] = str(s["_id"])
    s["_id"] = str(s["_id"])
    return s

@router.get("", response_model=None)
async def listar_servicios():
    """Consulta la lista completa de servicios ofrecidos."""
    cursor = services_collection.find()
    services = []
    async for doc in cursor:
        services.append(serialize_service(doc))

    return {
        "success": True,
        "count": len(services),
        "services": services
    }

@router.get("/{id}", response_model=None)
async def obtener_servicio(id: str):
    """Consulta servicio individual por ID."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de servicio inválido.")

    srv = await services_collection.find_one({"_id": ObjectId(id)})
    if not srv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado.")

    return {
        "success": True,
        "service": serialize_service(srv)
    }

@router.post("", status_code=status.HTTP_201_CREATED, response_model=None)
async def crear_servicio(
    data: ServiceCreate,
    current_user: dict = Depends(require_staff)
):
    """Crea un nuevo servicio en la base de datos. Requiere rol de Administrador o Empleado."""
    doc = data.dict()
    result = await services_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    return {
        "success": True,
        "message": "Servicio registrado exitosamente.",
        "service": serialize_service(doc)
    }

@router.put("/{id}", response_model=None)
async def actualizar_servicio(
    id: str,
    data: ServiceUpdate,
    current_user: dict = Depends(require_staff)
):
    """Actualiza datos de un servicio por ID. Requiere rol de Administrador o Empleado."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de servicio inválido.")

    update_fields = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se enviaron datos para actualizar.")

    result = await services_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado.")

    updated_srv = await services_collection.find_one({"_id": ObjectId(id)})
    return {
        "success": True,
        "message": "Servicio actualizado exitosamente.",
        "service": serialize_service(updated_srv)
    }

@router.delete("/{id}", response_model=None)
async def eliminar_servicio(
    id: str,
    current_user: dict = Depends(require_staff)
):
    """Elimina un servicio por ID. Requiere rol de Administrador o Empleado."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de servicio inválido.")

    result = await services_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Servicio no encontrado.")

    return {
        "success": True,
        "message": "Servicio eliminado exitosamente."
    }
