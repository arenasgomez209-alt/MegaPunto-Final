import asyncio
from datetime import datetime, timezone
from app.database import (
    users_collection,
    products_collection,
    services_collection,
    sales_collection,
    sales_details_collection,
    invoices_collection,
    invoices_details_collection,
    pqr_collection,
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

    # Seed Sales and Invoices if none exist
    sales_count = await sales_collection.count_documents({})
    if sales_count == 0:
        print("  [+] Sembrando historial inicial de ventas y facturas para analítica...")
        sample_sales = [
            {
                "numero_venta": "VTA-20260920-1001",
                "cliente_id": "cliente_demo_1",
                "cliente_nombre": "María Cliente",
                "cliente_email": "cliente@megapunto.com",
                "cliente_telefono": "3209876543",
                "cliente_documento": "1000000003",
                "direccion_envio": "Avenida El Poblado # 10-50, Medellín",
                "metodo_pago": "pse",
                "subtotal": 2850000.0,
                "descuento": 0.0,
                "impuestos": 541500.0,
                "total": 3391500.0,
                "fecha": "2026-09-20T14:30:00",
                "estado": "Completada",
                "items": [
                    {
                        "item_id": "demo_prod_1",
                        "nombre": "Nevera Samsung No Frost 400L Inverter Digital",
                        "tipo": "Producto",
                        "cantidad": 1,
                        "precio_unitario": 2850000.0,
                        "descuento": 0.0,
                        "subtotal": 2850000.0,
                        "total": 2850000.0
                    }
                ]
            },
            {
                "numero_venta": "VTA-20260921-1002",
                "cliente_id": "cliente_demo_2",
                "cliente_nombre": "Alejandro Torres",
                "cliente_email": "atorres@correo.com",
                "cliente_telefono": "3148901234",
                "cliente_documento": "1020304050",
                "direccion_envio": "Calle 44 # 65-10, Laureles, Medellín",
                "metodo_pago": "card",
                "subtotal": 1290000.0,
                "descuento": 50000.0,
                "impuestos": 235600.0,
                "total": 1475600.0,
                "fecha": "2026-09-21T11:15:00",
                "estado": "Completada",
                "items": [
                    {
                        "item_id": "demo_prod_2",
                        "nombre": "Celular Xiaomi Redmi Note 13 Pro 256GB 5G",
                        "tipo": "Producto",
                        "cantidad": 1,
                        "precio_unitario": 1290000.0,
                        "descuento": 50000.0,
                        "subtotal": 1240000.0,
                        "total": 1240000.0
                    }
                ]
            },
            {
                "numero_venta": "VTA-20260922-1003",
                "cliente_id": "cliente_demo_3",
                "cliente_nombre": "Diana Patricia Ríos",
                "cliente_email": "dianarios@gmail.com",
                "cliente_telefono": "3015558899",
                "cliente_documento": "71345678",
                "direccion_envio": "Carrera 80 # 32-45, Belén, Medellín",
                "metodo_pago": "nequi",
                "subtotal": 1150000.0,
                "descuento": 0.0,
                "impuestos": 218500.0,
                "total": 1368500.0,
                "fecha": "2026-09-22T16:45:00",
                "estado": "Completada",
                "items": [
                    {
                        "item_id": "demo_prod_3",
                        "nombre": "Estufa Haceb 4 Puestos a Gas en Acero Inoxidable",
                        "tipo": "Producto",
                        "cantidad": 1,
                        "precio_unitario": 1150000.0,
                        "descuento": 0.0,
                        "subtotal": 1150000.0,
                        "total": 1150000.0
                    }
                ]
            },
            {
                "numero_venta": "VTA-20260923-1004",
                "cliente_id": "cliente_demo_1",
                "cliente_nombre": "María Cliente",
                "cliente_email": "cliente@megapunto.com",
                "cliente_telefono": "3209876543",
                "cliente_documento": "1000000003",
                "direccion_envio": "Avenida El Poblado # 10-50, Medellín",
                "metodo_pago": "contra",
                "subtotal": 3200000.0,
                "descuento": 100000.0,
                "impuestos": 589000.0,
                "total": 3689000.0,
                "fecha": "2026-09-23T10:20:00",
                "estado": "Completada",
                "items": [
                    {
                        "item_id": "demo_prod_4",
                        "nombre": "Lavadora Carga Frontal LG 18kg Smart AI",
                        "tipo": "Producto",
                        "cantidad": 1,
                        "precio_unitario": 3200000.0,
                        "descuento": 100000.0,
                        "subtotal": 3100000.0,
                        "total": 3100000.0
                    }
                ]
            }
        ]

        for s in sample_sales:
            sale_res = await sales_collection.insert_one(s)
            sale_id = str(sale_res.inserted_id)

            # Insert detalle
            for item in s["items"]:
                await sales_details_collection.insert_one({
                    "venta_id": sale_id,
                    "numero_venta": s["numero_venta"],
                    **item,
                    "fecha": s["fecha"]
                })

            # Insert corresponding invoice
            inv_num = f"FAC-{s['numero_venta'].split('-')[1]}-{s['numero_venta'].split('-')[2]}"
            await invoices_collection.insert_one({
                "numero_factura": inv_num,
                "venta_id": sale_id,
                "numero_venta": s["numero_venta"],
                "fecha_emision": s["fecha"],
                "cliente": {
                    "id": s["cliente_id"],
                    "nombre": s["cliente_nombre"],
                    "email": s["cliente_email"],
                    "telefono": s["cliente_telefono"],
                    "documento": s["cliente_documento"],
                    "direccion": s["direccion_envio"]
                },
                "items": s["items"],
                "subtotal": s["subtotal"],
                "impuestos": s["impuestos"],
                "descuento": s["descuento"],
                "total": s["total"],
                "metodo_pago": s["metodo_pago"],
                "estado": "Pagada"
            })
        print("  [+] Ventas y facturas sembradas exitosamente.")

    # Seed Sample PQRs if none exist
    pqr_count = await pqr_collection.count_documents({})
    if pqr_count == 0:
        print("  [+] Sembrando solicitudes PQR de demostración...")
        sample_pqrs = [
            {
                "radicado": "PQR-20260920-5001",
                "cliente_id": "cliente_demo_1",
                "cliente_nombre": "María Cliente",
                "cliente_email": "cliente@megapunto.com",
                "tipo": "Petición",
                "asunto": "Solicitud de instalación técnica para Nevera Samsung",
                "descripcion": "Compré una nevera Samsung y requiero coordinar el día de la instalación con el técnico certificado en mi domicilio.",
                "estado": "Respondida",
                "respuesta": "Estimada María, un técnico certificado se pondrá en contacto contigo en las próximas 24 horas para agendar la visita.",
                "atendido_por": "Carlos Empleado",
                "fecha_creacion": "2026-09-20T15:00:00",
                "fecha_respuesta": "2026-09-21T09:30:00"
            },
            {
                "radicado": "PQR-20260922-5002",
                "cliente_id": "cliente_demo_2",
                "cliente_nombre": "Alejandro Torres",
                "cliente_email": "atorres@correo.com",
                "tipo": "Queja",
                "asunto": "Demora leve en la entrega del pedido",
                "descripcion": "El transportador llegó después de las 6:00 PM y no me avisó con anticipación por mensaje de texto.",
                "estado": "En Proceso",
                "respuesta": "Se elevó la observación con la empresa de mensajería para optimizar las notificaciones de ruta.",
                "atendido_por": "Juan Administrador",
                "fecha_creacion": "2026-09-22T17:10:00",
                "fecha_respuesta": None
            },
            {
                "radicado": "PQR-20260923-5003",
                "cliente_id": "cliente_demo_3",
                "cliente_nombre": "Diana Patricia Ríos",
                "cliente_email": "dianarios@gmail.com",
                "tipo": "Petición",
                "asunto": "Copia de factura electrónica en formato PDF",
                "descripcion": "Requiero copia de la factura con desglose de IVA para efectos contables de mi empresa.",
                "estado": "Pendiente",
                "respuesta": None,
                "atendido_por": None,
                "fecha_creacion": "2026-09-23T11:00:00",
                "fecha_respuesta": None
            }
        ]
        await pqr_collection.insert_many(sample_pqrs)
        print("  [+] PQRs iniciales sembradas con éxito.")

    print("[SEED] Sembrado completado con exito.")

if __name__ == "__main__":
    asyncio.run(seed_database())

