import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List
import httpx
from fastapi import APIRouter, HTTPException, status
from app.database import conversations_collection, messages_collection, products_collection, services_collection
from app.schemas import ChatbotRequest, ChatbotResponse

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot con Inteligencia Artificial"])

AI_API_KEY = os.getenv("AI_API_KEY", os.getenv("OPENAI_API_KEY", os.getenv("GEMINI_API_KEY", "")))
AI_PROVIDER_URL = os.getenv("AI_PROVIDER_URL", "https://api.openai.com/v1/chat/completions")

SYSTEM_CONTEXT = """
Eres "PuntoBot", el asistente virtual inteligente y cordial de MEGAPUNTO Colombia S.A.S. (Plataforma de comercio electrónico de electrodomésticos, tecnología, celulares y servicios técnicos).
Tu objetivo es:
1. Orientar a los clientes sobre productos disponibles (Neveras, Estufas Haceb, Lavadoras LG, Celulares Xiaomi/Samsung, Accesorios).
2. Asesorar sobre servicios técnicos (Mantenimiento preventivo, Instalación certificada, Reparación garantizada).
3. Informar políticas de pago (PSE, Tarjetas crédito/débito, Nequi, Contra Entrega) y envíos (Gratis por compras superiores a $150.000 COP a toda Colombia).
4. Orientar al usuario sobre garantías y cómo radicar una PQR (Petición, Queja o Reclamo) desde su Panel de Cliente o sección de PQR.
5. Responder siempre en español, con un tono amable, profesional, conciso y de alta calidad.
"""

def generate_local_ai_response(user_msg: str, catalog_products: list, catalog_services: list) -> tuple[str, list[str]]:
    """Motor de IA contextual con conocimiento profundo del catálogo de MEGAPUNTO."""
    msg = user_msg.lower().strip()

    # Preguntas sobre PQR / Reclamos / Garantías
    if any(k in msg for k in ["pqr", "queja", "reclamo", "peticion", "garantia", "devolucion", "soporte"]):
        reply = (
            "¡Hola! Con gusto te oriento con tu garantía o PQR. En **MEGAPUNTO** cuentas con 1 año de garantía oficial. "
            "Para radicar una PQR formal, puedes ingresar a tu **Panel de Cliente** en la sección **Mis PQR** o contactar a soporte "
            "desde el formulario de Contacto. El sistema te asignará de inmediato un número de radicado para hacerle seguimiento en tiempo real."
        )
        suggestions = ["¿Cómo radicar una PQR?", "¿Cuáles son los tiempos de respuesta de PQR?", "Ver métodos de pago"]
        return reply, suggestions

    # Preguntas sobre Celulares
    if any(k in msg for k in ["celular", "telefono", "smartphone", "xiaomi", "redmi", "iphone", "samsung"]):
        prods = [p.get("title", "") for p in catalog_products if "celular" in p.get("category", "").lower() or "celular" in p.get("title", "").lower()]
        prod_list = "\n• " + "\n• ".join(prods[:3]) if prods else "Celulares Xiaomi Redmi Note 13 Pro 5G y gama Galaxy."
        reply = (
            f"¡Excelente elección! En nuestra categoría de Celulares y Tecnología disponemos de equipos de última generación con garantía de 12 meses:\n"
            f"{prod_list}\n\n"
            f"Todos incluyen cargador original, factura electrónica con IVA discriminado y envío asegurado."
        )
        suggestions = ["Ver Celular Xiaomi Redmi", "¿Tienen envío gratis?", "¿Puedo pagar a contra entrega?"]
        return reply, suggestions

    # Preguntas sobre Electrodomésticos
    if any(k in msg for k in ["nevera", "estufa", "lavadora", "electrodomestico", "refrigerador", "horno", "haceb", "lg"]):
        prods = [f"{p.get('title')} ({p.get('priceFormatted', '')})" for p in catalog_products if "electro" in p.get("category", "").lower() or "electro" in p.get("title", "").lower()]
        prod_list = "\n• " + "\n• ".join(prods[:3]) if prods else "Neveras Samsung Digital Inverter, Estufas Haceb y Lavadoras LG Smart AI."
        reply = (
            f"En MEGAPUNTO somos distribuidores autorizados de grandes marcas como Haceb, Samsung y LG:\n"
            f"{prod_list}\n\n"
            f"Además, puedes solicitar el servicio de instalación técnica certificada al momento de tu compra."
        )
        suggestions = ["¿Cuánto cuesta el envío de una nevera?", "¿Qué métodos de pago reciben?", "Solicitar servicio técnico"]
        return reply, suggestions

    # Preguntas sobre Envíos
    if any(k in msg for k in ["envio", "despacho", "domicilio", "entrega", "flete", "donde entregan"]):
        reply = (
            "¡Realizamos envíos a toda Colombia! \n"
            "• **Envío GRATIS**: En compras superiores a **$150.000 COP**.\n"
            "• Tiempo de entrega: 24 a 48 horas hábiles en ciudades principales (Medellín, Bogotá, Cali, Barranquilla).\n"
            "• Tarifa estándar: $12.900 COP para compras inferiores al mínimo."
        )
        suggestions = ["¿Tienen tienda física?", "¿Cómo hacer seguimiento a mi pedido?", "¿Aceptan Nequi?"]
        return reply, suggestions

    # Preguntas sobre Pagos
    if any(k in msg for k in ["pago", "pagar", "tarjeta", "pse", "nequi", "contraentrega", "efectivo", "cuotas"]):
        reply = (
            "Contamos con múltiples opciones de pago 100% seguras:\n"
            "1. **PSE**: Débito bancario inmediato desde cualquier cuenta en Colombia.\n"
            "2. **Tarjetas de Crédito / Débito**: Visa, Mastercard y American Express.\n"
            "3. **Nequi**: Transferencia ágil desde tu celular.\n"
            "4. **Contra Entrega**: Paga al recibir el producto en tu domicilio (zonas seleccionadas)."
        )
        suggestions = ["Ver productos en oferta", "¿Cómo descargar mi factura?", "Hablar con un asesor"]
        return reply, suggestions

    # Preguntas sobre Servicios
    if any(k in msg for k in ["servicio", "instalacion", "mantenimiento", "reparacion", "tecnico"]):
        reply = (
            "Ofrecemos servicios técnicos profesionales certificados:\n"
            "• **Instalación de Electrodomésticos**: Redes de gas, agua y electricidad bajo norma técnica.\n"
            "• **Mantenimiento Preventivo y Correctivo**: Diagnóstico integral y repuestos originales.\n"
            "Puedes consultar todos los detalles en la pestaña de **Servicios** del menú superior."
        )
        suggestions = ["Cotizar instalación", "¿Tienen garantía los servicios?", "Ver catálogo de productos"]
        return reply, suggestions

    # Pregunta sobre Facturación
    if any(k in msg for k in ["factura", "facturacion", "dian", "rut", "pdf factura"]):
        reply = (
            "Cada compra en MEGAPUNTO genera automáticamente una **Factura Electrónica de Venta** oficial. "
            "Puedes consultar y descargar todas tus facturas en formato **PDF** directamente desde tu **Panel de Cliente** "
            "o el administrador puede emitirlas desde el módulo de Facturación."
        )
        suggestions = ["Ir a mi Panel de Cliente", "¿Cuáles son las políticas de devolución?", "Ver productos"]
        return reply, suggestions

    # Saludo o Pregunta General
    reply = (
        "¡Hola! Soy **PuntoBot**, tu asesor inteligente en MEGAPUNTO Colombia. "
        "Estoy aquí para ayudarte a elegir los mejores electrodomésticos y celulares, informarte sobre métodos de pago, "
        "tiempos de envío, consultar tus facturas o guiarte en la radicación de tus PQR. ¿En qué te puedo colaborar hoy?"
    )
    suggestions = [
        "¿Cuáles son los productos más vendidos?",
        "¿Cómo radicar una PQR?",
        "Métodos de pago y envío gratis",
        "Servicios técnicos certificados"
    ]
    return reply, suggestions

@router.post("/chat", response_model=ChatbotResponse)
async def chat_with_bot(req: ChatbotRequest):
    """
    Endpoint de conversación con el Chatbot de Inteligencia Artificial.
    Usa la API Key de entorno si está configurada, con fallback contextual inteligente.
    """
    session_id = req.session_id or str(uuid.uuid4())
    user_text = req.mensaje.strip()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Guardar mensaje de usuario en base de datos
    await messages_collection.insert_one({
        "session_id": session_id,
        "remitente": "user",
        "texto": user_text,
        "fecha": now_iso
    })

    # Cargar contexto vivo de productos y servicios
    products_cursor = products_collection.find({}).limit(10)
    prods = []
    async for p in products_cursor:
        prods.append(p)

    services_cursor = services_collection.find({}).limit(10)
    servs = []
    async for s in services_cursor:
        servs.append(s)

    bot_reply = None
    sugerencias = ["¿Tienen envío gratis?", "¿Cómo radicar una PQR?", "Ver celulares en oferta"]

    # Si hay clave de IA configurada en .env, intentar llamada a OpenAI / servicio compatible
    if AI_API_KEY and len(AI_API_KEY) > 10:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                headers = {
                    "Authorization": f"Bearer {AI_API_KEY}",
                    "Content-Type": "application/json"
                }
                messages_payload = [{"role": "system", "content": SYSTEM_CONTEXT}]
                if req.historial:
                    for h in req.historial[-4:]:
                        role = "user" if h.remitente == "user" else "assistant"
                        messages_payload.append({"role": role, "content": h.texto})
                messages_payload.append({"role": "user", "content": user_text})

                response = await client.post(
                    AI_PROVIDER_URL,
                    headers=headers,
                    json={
                        "model": os.getenv("AI_MODEL", "gpt-4o-mini"),
                        "messages": messages_payload,
                        "max_tokens": 400,
                        "temperature": 0.7
                    }
                )
                if response.status_code == 200:
                    data = response.json()
                    bot_reply = data["choices"][0]["message"]["content"].strip()
        except Exception:
            bot_reply = None

    # Si no hay clave de IA o falló la conexión externa, usar motor contextual enriquecido
    if not bot_reply:
        bot_reply, sugerencias = generate_local_ai_response(user_text, prods, servs)

    # Guardar respuesta del bot en base de datos
    await messages_collection.insert_one({
        "session_id": session_id,
        "remitente": "bot",
        "texto": bot_reply,
        "fecha": datetime.now(timezone.utc).isoformat()
    })

    # Actualizar sesión de conversación
    await conversations_collection.update_one(
        {"session_id": session_id},
        {
            "$set": {"ultima_actividad": now_iso},
            "$setOnInsert": {"session_id": session_id, "creada_en": now_iso}
        },
        upsert=True
    )

    return ChatbotResponse(
        respuesta=bot_reply,
        session_id=session_id,
        sugerencias=sugerencias
    )
