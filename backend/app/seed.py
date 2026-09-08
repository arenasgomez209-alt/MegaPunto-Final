import asyncio
from datetime import datetime, timezone
from app.database import (
    users_collection,
    products_collection,
    services_collection,
    check_db_connection
)
from app.security import hash_password

INITIAL_USERS = [
    {
        "nombre": "Juan Administrador",
        "apellido": "SENA",
        "tipoDocumento": "CC",
        "numeroDocumento": "1000000001",
        "direccion": "Calle 50 # 45-20, Medellín",
        "telefono": "3046408290",
        "email": "admin@megapunto.com",
        "password": hash_password("Admin123*"),
        "rol": "Administrador",
        "estado": "Activo",
        "fechaCreacion": datetime.now(timezone.utc).isoformat()
    },
    {
        "nombre": "Carlos Empleado",
        "apellido": "Gómez",
        "tipoDocumento": "CC",
        "numeroDocumento": "1000000002",
        "direccion": "Carrera 70 # 30-15, Medellín",
        "telefono": "3104567890",
        "email": "empleado@megapunto.com",
        "password": hash_password("Empleado123*"),
        "rol": "Empleado",
        "estado": "Activo",
        "fechaCreacion": datetime.now(timezone.utc).isoformat()
    },
    {
        "nombre": "María Cliente",
        "apellido": "Restrepo",
        "tipoDocumento": "CC",
        "numeroDocumento": "1000000003",
        "direccion": "Avenida El Poblado # 10-50, Medellín",
        "telefono": "3209876543",
        "email": "cliente@megapunto.com",
        "password": hash_password("Cliente123*"),
        "rol": "Cliente",
        "estado": "Activo",
        "fechaCreacion": datetime.now(timezone.utc).isoformat()
    }
]

INITIAL_PRODUCTS = [
    {
        "title": "Nevera Samsung No Frost 400L Inverter Digital",
        "category": "Electrodomésticos",
        "price": 2850000,
        "priceFormatted": "$2.850.000 COP",
        "rating": 4.9,
        "reviews": 58,
        "image": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80",
        "description": "Refrigerador Samsung con tecnología Digital Inverter para ahorro de energía, congelado rápido y dispensador de agua.",
        "inStock": True,
        "stock": 15
    },
    {
        "title": "Estufa Haceb 4 Puestos a Gas en Acero Inoxidable",
        "category": "Electrodomésticos",
        "price": 1150000,
        "priceFormatted": "$1.150.000 COP",
        "rating": 4.8,
        "reviews": 34,
        "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
        "description": "Estufa Haceb de 4 quemadores con horno de gran capacidad, encendido electrónico y tapa de vidrio templado.",
        "inStock": True,
        "stock": 20
    },
    {
        "title": "Lavadora Carga Frontal LG 18kg Smart AI",
        "category": "Electrodomésticos",
        "price": 3200000,
        "priceFormatted": "$3.200.000 COP",
        "rating": 4.9,
        "reviews": 72,
        "image": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
        "description": "Lavadora inteligente LG con motor AI DD, función de lavado a vapor antisalérgenos y conectividad Wi-Fi.",
        "inStock": True,
        "stock": 8
    },
    {
        "title": "Celular Xiaomi Redmi Note 13 Pro 256GB 5G",
        "category": "Celulares",
        "price": 1290000,
        "priceFormatted": "$1.290.000 COP",
        "rating": 4.9,
        "reviews": 142,
        "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
        "description": "Smartphone Xiaomi con cámara principal de 200MP, pantalla AMOLED a 120Hz y carga ultra rápida de 67W.",
        "inStock": True,
        "stock": 25
    },
    {
        "title": "iPhone 15 Pro Max 256GB Titanio Natural",
        "category": "Celulares",
        "price": 5490000,
        "priceFormatted": "$5.490.000 COP",
        "rating": 5.0,
        "reviews": 98,
        "image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
        "description": "Smartphone Apple con chip A17 Pro, diseño en titanio aeroespacial y zoom óptico 5x.",
        "inStock": True,
        "stock": 10
    },
    {
        "title": "Motocicleta Yamaha MT-03 ABS 2026",
        "category": "Motos",
        "price": 27500000,
        "priceFormatted": "$27.500.000 COP",
        "rating": 5.0,
        "reviews": 65,
        "image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
        "description": "Bicilíndrica hiper naked de 321cc, frenos ABS doble canal, iluminación full LED y tablero digital completo.",
        "inStock": True,
        "stock": 5
    }
]

INITIAL_SERVICES = [
    {
        "title": "Envío Nacional Gratis",
        "description": "En compras superiores a $150.000 COP a todas las ciudades y municipios de Colombia.",
        "icon": "Truck"
    },
    {
        "title": "Garantía Extendida MEGAPUNTO",
        "description": "Protección directa de 1 a 3 años para tu celular, motocicleta, computador o electrodoméstico.",
        "icon": "ShieldCheck"
    },
    {
        "title": "Financiación & Pagos Seguros",
        "description": "Paga con tarjeta de crédito, PSE, Nequi, Daviplata o solicita Crédito Fácil MEGAPUNTO en minutos.",
        "icon": "CreditCard"
    },
    {
        "title": "Puntos MEGAPUNTO Rewards",
        "description": "Acumula puntos en cada compra y canjéalos por descuentos reales y regalos de temporada.",
        "icon": "Gift"
    },
    {
        "title": "Devoluciones Sin Complicaciones",
        "description": "Hasta 30 días para cambios o devoluciones con atención rápida en nuestras sedes físicas.",
        "icon": "RefreshCw"
    },
    {
        "title": "Soporte y Asesoría Inmediata",
        "description": "Equipo de atención al cliente disponible vía WhatsApp y correo para resolver tus consultas.",
        "icon": "Clock"
    }
]

async def seed_database():
    print("[SEED] Verificando base de datos y sembrando registros iniciales...")
    await check_db_connection()

    # Seed Users
    for user_data in INITIAL_USERS:
        existing = await users_collection.find_one({"email": user_data["email"]})
        if not existing:
            await users_collection.insert_one(user_data)
            print(f"  [+] Usuario creado: {user_data['email']} ({user_data['rol']})")
        else:
            print(f"  [*] Usuario ya existe: {user_data['email']}")

    # Seed Products
    prod_count = await products_collection.count_documents({})
    if prod_count == 0:
        await products_collection.insert_many(INITIAL_PRODUCTS)
        print(f"  [+] {len(INITIAL_PRODUCTS)} productos iniciales insertados.")
    else:
        print(f"  [*] Catalogo de productos ya cuenta con {prod_count} registros.")

    # Seed Services
    srv_count = await services_collection.count_documents({})
    if srv_count == 0:
        await services_collection.insert_many(INITIAL_SERVICES)
        print(f"  [+] {len(INITIAL_SERVICES)} servicios iniciales insertados.")
    else:
        print(f"  [*] Catalogo de servicios ya cuenta con {srv_count} registros.")

    print("[SEED] Sembrado completado con exito.")

if __name__ == "__main__":
    asyncio.run(seed_database())

