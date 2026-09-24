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

# --- VENTAS Y DETALLE VENTAS SCHEMAS ---

class SaleItemCreate(BaseModel):
    item_id: str
    nombre: str
    tipo: str = "Producto"  # "Producto" o "Servicio"
    cantidad: int = Field(..., gt=0)
    precio_unitario: float = Field(..., ge=0)
    descuento: float = 0.0
    subtotal: Optional[float] = None
    total: Optional[float] = None

class SaleCreate(BaseModel):
    cliente_id: Optional[str] = None
    cliente_nombre: str
    cliente_email: EmailStr
    cliente_telefono: Optional[str] = ""
    cliente_documento: Optional[str] = ""
    direccion_envio: Optional[str] = ""
    metodo_pago: str = "pse"  # pse, card, nequi, contra, efectivo
    items: List[SaleItemCreate]
    descuento_global: float = 0.0
    notas: Optional[str] = ""

class SaleResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    numero_venta: str
    cliente_id: Optional[str] = None
    cliente_nombre: str
    cliente_email: str
    cliente_telefono: Optional[str] = None
    cliente_documento: Optional[str] = None
    usuario_id: Optional[str] = None
    items: List[dict] = []
    subtotal: float
    descuento: float = 0.0
    impuestos: float
    total: float
    fecha: str
    estado: str = "Completada"
    metodo_pago: str = "pse"
    direccion_envio: Optional[str] = None

# --- FACTURAS SCHEMAS ---

class InvoiceResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    numero_factura: str
    venta_id: str
    fecha_emision: str
    cliente: dict
    items: List[dict]
    subtotal: float
    impuestos: float
    descuento: float = 0.0
    total: float
    estado: str = "Pagada"
    metodo_pago: str

# --- PQR SCHEMAS ---

class PQRCreate(BaseModel):
    tipo: str = Field(..., description="Petición, Queja, Reclamo, Sugerencia")
    asunto: str = Field(..., min_length=3, max_length=150)
    descripcion: str = Field(..., min_length=10)

class PQRUpdateStatus(BaseModel):
    estado: str = Field(..., description="Pendiente, En Proceso, Respondida, Cerrada")
    respuesta: Optional[str] = None

class PQRResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    radicado: str
    cliente_id: str
    cliente_nombre: str
    cliente_email: str
    tipo: str
    asunto: str
    descripcion: str
    estado: str = "Pendiente"
    respuesta: Optional[str] = None
    atendido_por: Optional[str] = None
    fecha_creacion: str
    fecha_respuesta: Optional[str] = None

# --- CHATBOT SCHEMAS ---

class ChatbotMessage(BaseModel):
    remitente: str  # "user" o "bot"
    texto: str
    timestamp: Optional[str] = None

class ChatbotRequest(BaseModel):
    mensaje: str = Field(..., min_length=1)
    session_id: Optional[str] = None
    historial: Optional[List[ChatbotMessage]] = []

class ChatbotResponse(BaseModel):
    respuesta: str
    session_id: str
    sugerencias: Optional[List[str]] = []

# --- DASHBOARD STATS SCHEMAS ---

class DashboardStatsResponse(BaseModel):
    total_usuarios: int
    total_productos: int
    total_servicios: int
    total_ventas: int
    total_facturacion: float
    pqr_recibidas: int
    pqr_pendientes: int
    ventas_hoy: int
    facturacion_hoy: float
    ventas_por_dia: List[dict]
    ventas_por_semana: List[dict]
    ventas_por_mes: List[dict]
    top_productos: List[dict]
    ventas_por_categoria: List[dict]

