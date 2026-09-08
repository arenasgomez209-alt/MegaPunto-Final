from fastapi import APIRouter, HTTPException, status, Depends
from app.database import users_collection
from app.schemas import UserLogin, UserRegister, UserUpdate
from app.security import (
    verify_password,
    create_access_token,
    get_current_user,
    hash_password
)
from app.routes.usuarios import serialize_user, registrar_usuario

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

@router.post("/login", response_model=None)
async def login(credentials: UserLogin):
    """
    Inicio de sesión con correo y contraseña.
    Verifica hash de contraseña y emite JWT con 'sub', 'role' y 'exp'.
    """
    email_clean = credentials.email.lower().strip()
    user = await users_collection.find_one({"email": email_clean})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos."
        )

    if not verify_password(credentials.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos."
        )

    if user.get("estado") == "Inactivo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tu cuenta se encuentra inactiva. Por favor contacta al administrador."
        )

    user_clean = serialize_user(user)

    # JWT Payload: sub = email, role = rol
    token_data = {
        "sub": user["email"],
        "role": user.get("rol", "Cliente"),
        "name": f"{user.get('nombre', '')} {user.get('apellido', '')}".strip()
    }
    token = create_access_token(data=token_data)

    return {
        "success": True,
        "message": f"¡Bienvenido, {user.get('nombre')}!",
        "token": token,
        "user": user_clean
    }

@router.post("/register", response_model=None)
async def register(data: UserRegister):
    """
    Alias de registro que devuelve token y datos del usuario para inicio automático.
    """
    res = await registrar_usuario(data)
    user_created = res["user"]

    token_data = {
        "sub": user_created["email"],
        "role": user_created.get("rol", "Cliente"),
        "name": f"{user_created.get('nombre', '')} {user_created.get('apellido', '')}".strip()
    }
    token = create_access_token(data=token_data)

    return {
        "success": True,
        "message": "Registro completado con éxito.",
        "token": token,
        "user": user_created
    }

@router.get("/profile", response_model=None)
@router.get("/me", response_model=None)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Retorna el perfil del usuario autenticado actual."""
    return {
        "success": True,
        "user": current_user
    }

@router.put("/profile", response_model=None)
async def update_profile(data: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Actualiza los datos del perfil propio."""
    from bson import ObjectId
    update_data = data.dict(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        update_data["password"] = hash_password(update_data["password"])
    else:
        update_data.pop("password", None)

    # No permitir cambiar rol desde el perfil propio
    update_data.pop("rol", None)
    update_data.pop("estado", None)

    if update_data:
        await users_collection.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )

    updated_user = await users_collection.find_one({"_id": ObjectId(current_user["id"])})
    return {
        "success": True,
        "message": "Perfil actualizado correctamente.",
        "user": serialize_user(updated_user)
    }
