from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

# --- USUARIOS SCHEMAS ---

class UserRegister(BaseModel):
    nombre: str = Field(..., min_length=3, description="Nombre del usuario (mínimo 3 letras)")
    apellido: str = Field(..., min_length=3, description="Apellido del usuario (mínimo 3 letras)")
    tipoDocumento: str = Field("CC", description="Tipo de documento (CC, CE, PAS, NIT)")
    numeroDocumento: str = Field(..., min_length=5, max_length=20, description="Número de documento de identidad")
    direccion: str = Field(..., min_length=3, description="Dirección de residencia o despacho")
    telefono: str = Field(..., min_length=7, max_length=15, description="Número telefónico de contacto")
    email: EmailStr = Field(..., description="Correo electrónico válido")
    password: str = Field(..., min_length=4, description="Contraseña segura")
    rol: Optional[str] = Field("Cliente", description="Rol del usuario (Administrador, Empleado, Cliente)")
    estado: Optional[str] = Field("Activo", description="Estado del usuario (Activo, Inactivo)")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    tipoDocumento: Optional[str] = None
    numeroDocumento: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    estado: Optional[str] = None

class UserStatusUpdate(BaseModel):
    estado: str = Field(..., description="Nuevo estado del usuario (Activo o Inactivo)")

class UserResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    nombre: str
    apellido: str
    tipoDocumento: str
    numeroDocumento: str
    direccion: str
    telefono: str
    email: str
    rol: str
    estado: str
    fechaCreacion: Optional[str] = None

class TokenResponse(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse
    success: bool = True
    message: str = "Inicio de sesión exitoso"

# --- PRODUCTOS SCHEMAS ---

class ProductCreate(BaseModel):
    title: str = Field(..., min_length=3, description="Título o nombre del producto")
    category: str = Field("General", description="Categoría")
    price: float = Field(..., gt=0, description="Precio numérico")
    priceFormatted: Optional[str] = None
    rating: Optional[float] = 5.0
    reviews: Optional[int] = 0
    image: Optional[str] = None
    description: Optional[str] = ""
    inStock: Optional[bool] = True
    stock: Optional[int] = 10

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    priceFormatted: Optional[str] = None
    rating: Optional[float] = None
    reviews: Optional[int] = None
    image: Optional[str] = None
    description: Optional[str] = None
    inStock: Optional[bool] = None
    stock: Optional[int] = None

class ProductResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    title: str
    category: str
    price: float
    priceFormatted: Optional[str] = None
    rating: Optional[float] = 5.0
    reviews: Optional[int] = 0
    image: Optional[str] = None
    description: Optional[str] = ""
    inStock: Optional[bool] = True
    stock: Optional[int] = 10

# --- SERVICIOS SCHEMAS ---

class ServiceCreate(BaseModel):
    title: str = Field(..., min_length=3, description="Título del servicio")
    description: str = Field(..., min_length=5, description="Descripción del servicio")
    icon: Optional[str] = "Sparkles"

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None

class ServiceResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    title: str
    description: str
    icon: Optional[str] = "Sparkles"

# --- CONTACTO SCHEMAS ---

class ContactCreate(BaseModel):
    nombre: str
    email: EmailStr
    telefono: Optional[str] = ""
    asunto: Optional[str] = "Consulta General"
    mensaje: str

class ContactStatusUpdate(BaseModel):
    estado: str
