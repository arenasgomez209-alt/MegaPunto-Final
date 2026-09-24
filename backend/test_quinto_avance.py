import asyncio
import httpx
from app.main import app

async def run_async_tests():
    print("==================================================")
    print("INICIANDO PRUEBAS AUTOMATIZADAS - QUINTO AVANCE")
    print("==================================================")

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        print("[PASS] 1. /api/health operativo")

        # 2. Dashboard Stats
        res = await client.get("/api/dashboard/stats")
        assert res.status_code == 200, f"Dashboard stats failed: {res.text}"
        data = res.json()
        assert "total_ventas" in data
        assert "ventas_por_dia" in data
        assert "ventas_por_semana" in data
        assert "ventas_por_mes" in data
        print(f"[PASS] 2. /api/dashboard/stats OK - Total ventas: {data['total_ventas']}, Facturación: ${data['total_facturacion']:,.0f}")

        # 3. Create Sale (Venta + Detalle + Factura)
        sale_payload = {
            "cliente_id": "test_client_id_123",
            "cliente_nombre": "Carlos Prueba SENA",
            "cliente_email": "carlos.sena@correo.com",
            "cliente_telefono": "3001234567",
            "cliente_documento": "100200300",
            "direccion_envio": "Calle 50 # 10-20, Medellín",
            "metodo_pago": "pse",
            "items": [
                {
                    "item_id": "demo_item_test",
                    "nombre": "Licuadora Haceb Expert Plus",
                    "tipo": "Producto",
                    "cantidad": 2,
                    "precio_unitario": 180000.0,
                    "descuento": 10000.0
                }
            ]
        }
        res = await client.post("/api/ventas", json=sale_payload)
        assert res.status_code == 201, f"Create sale failed: {res.text}"
        sale_data = res.json()["sale"]
        sale_id = sale_data["id"]
        invoice_num = sale_data.get("numero_factura")
        print(f"[PASS] 3. POST /api/ventas OK - Venta: {sale_data['numero_venta']} -> Factura: {invoice_num}")

        # 4. List sales
        res = await client.get("/api/ventas")
        assert res.status_code == 200
        sales_list = res.json()["sales"]
        assert len(sales_list) > 0
        print(f"[PASS] 4. GET /api/ventas OK - {len(sales_list)} ventas en historial")

        # 5. List invoices
        res = await client.get("/api/facturas")
        assert res.status_code == 200
        invoices_list = res.json()["invoices"]
        assert len(invoices_list) > 0
        test_inv = invoices_list[0]
        print(f"[PASS] 5. GET /api/facturas OK - {len(invoices_list)} facturas registradas")

        # 6. Download Invoice PDF
        res = await client.get(f"/api/facturas/{test_inv['id']}/pdf")
        assert res.status_code == 200, f"PDF Invoice download failed: {res.text}"
        assert res.headers["content-type"] == "application/pdf"
        assert len(res.content) > 1000
        print(f"[PASS] 6. GET /api/facturas/{{id}}/pdf OK - Archivo PDF generado ({len(res.content)} bytes)")

        # 7. Daily sales report JSON
        res = await client.get("/api/reportes/ventas/diario")
        assert res.status_code == 200
        rep_data = res.json()
        assert "total_general" in rep_data
        print(f"[PASS] 7. GET /api/reportes/ventas/diario OK - Total día: ${rep_data['total_general']:,.0f}")

        # 8. Export daily report in PDF
        res = await client.get("/api/reportes/ventas/diario/pdf")
        assert res.status_code == 200
        assert res.headers["content-type"] == "application/pdf"
        assert len(res.content) > 1000
        print(f"[PASS] 8. GET /api/reportes/ventas/diario/pdf OK - Reporte PDF generado ({len(res.content)} bytes)")

        # 9. Export daily report in Excel (.xlsx)
        res = await client.get("/api/reportes/ventas/diario/excel")
        assert res.status_code == 200
        assert "spreadsheetml" in res.headers["content-type"]
        assert len(res.content) > 1000
        print(f"[PASS] 9. GET /api/reportes/ventas/diario/excel OK - Archivo Excel generado ({len(res.content)} bytes)")

        # 10. Create PQR
        pqr_payload = {
            "tipo": "Petición",
            "asunto": "Consulta sobre garantía de lavadora",
            "descripcion": "Quisiera validar el tiempo de cobertura de garantía de mi lavadora LG comprada esta semana."
        }
        res = await client.post("/api/pqr?cliente_id=test_client_id_123&cliente_nombre=Carlos Prueba&cliente_email=carlos@sena.edu.co", json=pqr_payload)
        assert res.status_code == 201, f"Create PQR failed: {res.text}"
        pqr_data = res.json()["pqr"]
        pqr_id = pqr_data["id"]
        print(f"[PASS] 10. POST /api/pqr OK - Radicado: {pqr_data['radicado']}")

        # 11. Update PQR status & reply
        update_payload = {
            "estado": "Respondida",
            "respuesta": "Estimado Carlos, tu lavadora cuenta con 12 meses de garantía oficial y 10 años en el motor Inverter."
        }
        res = await client.patch(f"/api/pqr/{pqr_id}/estado?atendido_por=Carlos Empleado", json=update_payload)
        assert res.status_code == 200
        assert res.json()["pqr"]["estado"] == "Respondida"
        print(f"[PASS] 11. PATCH /api/pqr/{{id}}/estado OK - PQR respondida exitosamente")

        # 12. Chatbot with AI
        chat_payload = {
            "mensaje": "¿Qué marcas de neveras tienen disponibles y cuánto demora el envío?"
        }
        res = await client.post("/api/chatbot/chat", json=chat_payload)
        assert res.status_code == 200
        bot_res = res.json()
        assert len(bot_res["respuesta"]) > 10
        assert len(bot_res["sugerencias"]) > 0
        print(f"[PASS] 12. POST /api/chatbot/chat OK - Respuesta IA: \"{bot_res['respuesta'][:70]}...\"")

        print("==================================================")
        print("TODAS LAS 12 PRUEBAS AUTOMATIZADAS PASARON CON ÉXITO")
        print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_async_tests())
