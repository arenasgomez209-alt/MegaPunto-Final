-from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import users_collection
from app.schemas import UserRegister, UserUpdate, UserStatusUpdate, UserResponse
from app.security import hash_password, get_current_user, require_admin, require_staff

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

def serialize_user(user: dict) -> dict:
    if not user:
        return None
    user_copy = user.copy()
    user_copy["id"] = str(user_copy["_id"])
    user_copy["_id"] = str(user_copy["_id"])
    user_copy.pop("password", None)
    return user_copy

@router.post("/registro", status_code=status.HTTP_201_CREATED)
async def registrar_usuario(data: UserRegister):
    """
    Registra un nuevo usuario en MongoDB Atlas.
    Valida que el correo o documento no estén duplicados.
    Hashea la contraseña con bcrypt antes de persistir.
    """
    email_clean = data.email.lower().strip()
    doc_clean = data.numeroDocumento.strip()

    # Verificar duplicados por correo
    existing_email = await users_collection.find_one({"email": email_clean})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con este correo electrónico."
        )

    # Verificar duplicados por documento
    existing_doc = await users_collection.find_one({"numeroDocumento": doc_clean})
    if existing_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario registrado con este número de documento."
        )

    hashed_pw = hash_password(data.password)

    user_doc = {
        "nombre": data.nombre.strip(),
        "apellido": data.apellido.strip(),
        "tipoDocumento": data.tipoDocumento,
        "numeroDocumento": doc_clean,
        "direccion": data.direccion.strip(),
        "telefono": data.telefono.strip(),
        "email": email_clean,
        "password": hashed_pw,
        "rol": data.rol or "Cliente",
        "estado": data.estado or "Activo",
        "fechaCreacion": datetime.now(timezone.utc).isoformat()
    }

    result = await users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    created_user = serialize_user(user_doc)
    return {
        "success": True,
        "message": "Usuario registrado exitosamente en la base de datos.",
        "user": created_user
    }

@router.get("", response_model=None)
async def listar_usuarios(
    search: Optional[str] = Query(None, description="Búsqueda por nombre, apellido, correo o documento"),
    rol: Optional[str] = Query(None, description="Filtrar por rol"),
    estado: Optional[str] = Query(None, description="Filtrar por estado"),
    current_user: dict = Depends(require_staff)
):
    """
    Consulta usuarios con filtros.
    Accesible para Administrador y Empleado.
    """
    query = {}

    if rol and rol != "Todos":
        query["rol"] = rol

    if estado and estado != "Todos":
        query["estado"] = estado

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"nombre": search_regex},
            {"apellido": search_regex},
            {"email": search_regex},
            {"numeroDocumento": search_regex}
        ]

    cursor = users_collection.find(query).sort("fechaCreacion", -1)
    users = []
    async for doc in cursor:
        users.append(serialize_user(doc))

    return {
        "success": True,
        "count": len(users),
        "users": users
    }

@router.get("/{id}", response_model=None)
async def obtener_usuario(
    id: str,
    current_user: dict = Depends(get_current_user)
):
    """Consulta individual de usuario por ID."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido.")

    # Permitir si es Admin, Empleado, o si el propio usuario consulta su perfil
    if current_user.get("rol") not in ["Administrador", "Empleado"] and current_user.get("id") != id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para ver este perfil.")

    user = await users_collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    return {
        "success": True,
        "user": serialize_user(user)
    }

@router.put("/{id}", response_model=None)
async def actualizar_usuario(
    id: str,
    data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Actualiza datos del usuario por ID."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido.")

    # Solo el propio usuario o un Administrador puede editar
    if current_user.get("rol") != "Administrador" and current_user.get("id") != id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para actualizar este usuario.")

    update_fields = {}
    for key, value in data.dict(exclude_unset=True).items():
        if value is not None:
            if key == "password":
                update_fields["password"] = hash_password(value)
            elif key == "email":
                update_fields["email"] = value.lower().strip()
            elif key in ["rol", "estado"]:
                # Solo Administrador puede cambiar rol o estado directamente
                if current_user.get("rol") == "Administrador":
                    update_fields[key] = value
            else:
                update_fields[key] = value

    if not update_fields:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se enviaron campos para actualizar.")

    update_fields["fechaActualizacion"] = datetime.now(timezone.utc).isoformat()

    result = await users_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    updated_user = await users_collection.find_one({"_id": ObjectId(id)})
    return {
        "success": True,
        "message": "Usuario actualizado con éxito.",
        "user": serialize_user(updated_user)
    }

@router.patch("/{id}/estado", response_model=None)
async def cambiar_estado_usuario(
    id: str,
    data: Optional[UserStatusUpdate] = None,
    current_user: dict = Depends(require_admin)
):
    """
    Cambia el estado del usuario (Activo / Inactivo).
    Protegido para rol de Administrador.
    """
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido.")

    user = await users_collection.find_one({"_id": ObjectId(id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    if data and data.estado:
        nuevo_estado = data.estado
    else:
        # Alternar si no se envía estado explícito
        nuevo_estado = "Inactivo" if user.get("estado") == "Activo" else "Activo"

    await users_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"estado": nuevo_estado, "fechaActualizacion": datetime.now(timezone.utc).isoformat()}}
    )

    user["estado"] = nuevo_estado
    return {
        "success": True,
        "message": f"Estado del usuario actualizado a {nuevo_estado}.",
        "user": serialize_user(user)
    }

@router.patch("/{id}/toggle-status", response_model=None)
async def toggle_status_alias(
    id: str,
    current_user: dict = Depends(require_admin)
):
    """Alias para toggle de estado usado por el frontend."""
    return await cambiar_estado_usuario(id=id, data=None, current_user=current_user)

@router.delete("/{id}", response_model=None)
async def eliminar_usuario(
    id: str,
    current_user: dict = Depends(require_admin)
):
    """Elimina permanentemente a un usuario por ID. Exclusivo de Administrador."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID de usuario inválido.")

    # Prevenir autoeliminación del administrador activo
    if current_user.get("id") == id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes eliminar tu propia cuenta de Administrador."
        )

    result = await users_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")

    return {
        "success": True,
        "message": "Usuario eliminado exitosamente de la base de datos."
    }
