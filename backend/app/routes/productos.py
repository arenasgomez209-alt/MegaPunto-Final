from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import products_collection
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.security import require_staff

router = APIRouter(prefix="/api/productos", tags=["Productos"])

def serialize_product(prod: dict) -> dict:
    if not prod:
        return None
    p = prod.copy()
    p["id"] = str(p["_id"])
    p["_id"] = str(p["_id"])
    return p

@router.get("", response_model=None)
async def listar_productos(
    search: Optional[str] = Query(None, description="Búsqueda por título o descripción"),
    category: Optional[str] = Query(None, description="Filtrar por categoría")
):
    """Consulta catálogo de productos con filtros."""
    query = {}
    if category and category != "Todos":
        query["category"] = category

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"title": search_regex},
            {"description": search_regex}
        ]

    cursor = products_collection.find(query)
    products = []
    async for doc in cursor:
        products.append(serialize_product(doc))

    return {
        "success": True,
        "count": len(products),
        "products": products
    }

@router.get("/{id}", response_model=None)
async def obtener_producto(id: str):
    """Consulta producto por ID."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de producto inválido.")

    prod = await products_collection.find_one({"_id": ObjectId(id)})
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado.")

    return {
        "success": True,
        "product": serialize_product(prod)
    }

@router.post("", status_code=status.HTTP_201_CREATED, response_model=None)
async def crear_producto(
    data: ProductCreate,
    current_user: dict = Depends(require_staff)
):
    """Crea un nuevo producto en el catálogo. Requiere rol de Administrador o Empleado."""
    doc = data.dict()
    if not doc.get("priceFormatted"):
        doc["priceFormatted"] = f"${int(doc['price']):,} COP".replace(",", ".")

    result = await products_collection.insert_one(doc)
    doc["_id"] = result.inserted_id

    return {
        "success": True,
        "message": "Producto agregado exitosamente al catálogo.",
        "product": serialize_product(doc)
    }

@router.put("/{id}", response_model=None)
async def actualizar_producto(
    id: str,
    data: ProductUpdate,
    current_user: dict = Depends(require_staff)
):
    """Actualiza datos de un producto por ID. Requiere rol de Administrador o Empleado."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de producto inválido.")

    update_fields = {k: v for k, v in data.dict(exclude_unset=True).items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se enviaron datos para actualizar.")

    if "price" in update_fields and not update_fields.get("priceFormatted"):
        update_fields["priceFormatted"] = f"${int(update_fields['price']):,} COP".replace(",", ".")

    result = await products_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado.")

    updated_prod = await products_collection.find_one({"_id": ObjectId(id)})
    return {
        "success": True,
        "message": "Producto actualizado exitosamente.",
        "product": serialize_product(updated_prod)
    }

@router.delete("/{id}", response_model=None)
async def eliminar_producto(
    id: str,
    current_user: dict = Depends(require_staff)
):
    """Elimina un producto por ID. Requiere rol de Administrador o Empleado."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de producto inválido.")

    result = await products_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado.")

    return {
        "success": True,
        "message": "Producto eliminado exitosamente del catálogo."
    }
