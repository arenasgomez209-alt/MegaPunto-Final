from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import check_db_connection
from app.seed import seed_database
from app.routes import (
    usuarios,
    auth,
    productos,
    servicios,
    contacto,
    ventas,
    facturas,
    reportes,
    dashboard,
    pqr,
    chatbot
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[FASTAPI] Iniciando FastAPI Backend - MegaPunto Quinto Avance...")
    await check_db_connection()
    try:
        await seed_database()
    except Exception as e:
        print(f"[FASTAPI] Error al sembrar base de datos: {e}")
    yield
    # Shutdown
    print("[FASTAPI] Deteniendo FastAPI Backend...")


app = FastAPI(
    title="MEGAPUNTO API - SENA Quinto Avance",
    description="Backend Full Stack en FastAPI con persistencia en Base de Datos, reportes en PDF y Excel, facturación, dashboards con analítica, PQR y Chatbot con Inteligencia Artificial.",
    version="5.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de Routers Principales (Quinto Avance)
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(productos.router)
app.include_router(servicios.router)
app.include_router(contacto.router)
app.include_router(ventas.router)
app.include_router(facturas.router)
app.include_router(reportes.router)
app.include_router(dashboard.router)
app.include_router(pqr.router)
app.include_router(chatbot.router)

# Inclusión de Aliases para retrocompatibilidad con frontend existente
app.include_router(usuarios.router, prefix="/api/users", tags=["Usuarios (Alias)"])
app.include_router(productos.router, prefix="/api/products", tags=["Productos (Alias)"])
app.include_router(contacto.router, prefix="/api/contact", tags=["Contacto (Alias)"])

@app.get("/", tags=["Estado"])
async def root():
    return {
        "status": "online",
        "api": "MEGAPUNTO Full Stack Backend",
        "framework": "FastAPI",
        "database": "MongoDB Atlas",
        "documentacion": "/docs"
    }

@app.get("/api/health", tags=["Estado"])
async def health():
    return {"status": "ok", "message": "Backend operativo"}
