from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Query
from app.database import (
    users_collection,
    products_collection,
    services_collection,
    sales_collection,
    invoices_collection,
    pqr_collection
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard y Analítica"])

@router.get("/stats")
async def get_dashboard_stats(
    fecha_inicio: Optional[str] = Query(None, description="YYYY-MM-DD"),
    fecha_fin: Optional[str] = Query(None, description="YYYY-MM-DD"),
    estado: Optional[str] = Query(None),
    cliente_id: Optional[str] = Query(None)
):
    """
    Retorna métricas consolidadas (Cards) y series temporales para gráficos
    (barras, líneas, distribución de productos y categorías) con filtros dinámicos.
    """
    # Totales base del sistema
    total_usuarios = await users_collection.count_documents({})
    total_productos = await products_collection.count_documents({})
    total_servicios = await services_collection.count_documents({})
    pqr_recibidas = await pqr_collection.count_documents({})
    pqr_pendientes = await pqr_collection.count_documents({"estado": {"$in": ["Pendiente", "En Proceso"]}})

    # Filtro dinámico para ventas
    sales_filter = {}
    if estado and estado != "Todos":
        sales_filter["estado"] = estado
    if cliente_id:
        sales_filter["cliente_id"] = cliente_id

    if fecha_inicio and fecha_fin:
        sales_filter["fecha"] = {"$gte": f"{fecha_inicio}T00:00:00", "$lte": f"{fecha_fin}T23:59:59"}
    elif fecha_inicio:
        sales_filter["fecha"] = {"$gte": f"{fecha_inicio}T00:00:00"}
    elif fecha_fin:
        sales_filter["fecha"] = {"$lte": f"{fecha_fin}T23:59:59"}

    # Obtener ventas filtradas
    cursor = sales_collection.find(sales_filter).sort("fecha", 1)
    sales = []
    async for s in cursor:
        sales.append(s)

    total_ventas = len(sales)
    total_facturacion = sum(float(s.get("total", 0)) for s in sales)

    # Ventas de hoy
    today_str = datetime.now().strftime("%Y-%m-%d")
    ventas_hoy_list = [s for s in sales if str(s.get("fecha", "")).startswith(today_str)]
    ventas_hoy = len(ventas_hoy_list)
    facturacion_hoy = sum(float(s.get("total", 0)) for s in ventas_hoy_list)

    # Agrupación por Día (últimos 7-14 días o según filtro)
    dias_dict = {}
    for s in sales:
        d = str(s.get("fecha", ""))[:10]
        if not d:
            continue
        if d not in dias_dict:
            dias_dict[d] = {"fecha": d, "total": 0.0, "cantidad": 0}
        dias_dict[d]["total"] += float(s.get("total", 0))
        dias_dict[d]["cantidad"] += 1

    # Asegurar orden cronológico
    ventas_por_dia = sorted(list(dias_dict.values()), key=lambda x: x["fecha"])
    # Limitar a los últimos 14 días si no hay filtro estricto
    if len(ventas_por_dia) > 14 and not fecha_inicio:
        ventas_por_dia = ventas_por_dia[-14:]

    # Agrupación por Semana
    semanas_dict = {}
    for s in sales:
        fecha_str = str(s.get("fecha", ""))[:10]
        try:
            dt = datetime.strptime(fecha_str, "%Y-%m-%d")
            sem_key = f"Sem {dt.strftime('%W')}"
        except Exception:
            sem_key = "Semana 1"

        if sem_key not in semanas_dict:
            semanas_dict[sem_key] = {"semana": sem_key, "total": 0.0, "cantidad": 0}
        semanas_dict[sem_key]["total"] += float(s.get("total", 0))
        semanas_dict[sem_key]["cantidad"] += 1

    ventas_por_semana = list(semanas_dict.values())

    # Agrupación por Mes
    meses_nombres = {
        "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic"
    }
    meses_dict = {}
    for s in sales:
        fecha_str = str(s.get("fecha", ""))[:7]  # YYYY-MM
        if len(fecha_str) == 7:
            m_code = fecha_str.split("-")[1]
            mes_label = f"{meses_nombres.get(m_code, m_code)} {fecha_str.split('-')[0]}"
        else:
            mes_label = "General"

        if mes_label not in meses_dict:
            meses_dict[mes_label] = {"mes": mes_label, "total": 0.0, "cantidad": 0}
        meses_dict[mes_label]["total"] += float(s.get("total", 0))
        meses_dict[mes_label]["cantidad"] += 1

    ventas_por_mes = list(meses_dict.values())

    # Top Productos vendidos
    productos_dict = {}
    categorias_dict = {}

    for s in sales:
        for it in s.get("items", []):
            p_name = it.get("nombre", "Venta")
            p_cant = int(it.get("cantidad", 1))
            p_tot = float(it.get("total", 0))
            p_cat = it.get("categoria", it.get("tipo", "General"))

            # Top producto
            if p_name not in productos_dict:
                productos_dict[p_name] = {"nombre": p_name, "cantidad": 0, "total": 0.0}
            productos_dict[p_name]["cantidad"] += p_cant
            productos_dict[p_name]["total"] += p_tot

            # Categoría
            if p_cat not in categorias_dict:
                categorias_dict[p_cat] = {"categoria": p_cat, "total": 0.0, "cantidad": 0}
            categorias_dict[p_cat]["total"] += p_tot
            categorias_dict[p_cat]["cantidad"] += p_cant

    top_productos = sorted(list(productos_dict.values()), key=lambda x: x["total"], reverse=True)[:5]
    ventas_por_categoria = sorted(list(categorias_dict.values()), key=lambda x: x["total"], reverse=True)

    return {
        "success": True,
        "total_usuarios": total_usuarios,
        "total_productos": total_productos,
        "total_servicios": total_servicios,
        "total_ventas": total_ventas,
        "total_facturacion": round(total_facturacion, 2),
        "pqr_recibidas": pqr_recibidas,
        "pqr_pendientes": pqr_pendientes,
        "ventas_hoy": ventas_hoy,
        "facturacion_hoy": round(facturacion_hoy, 2),
        "ventas_por_dia": ventas_por_dia,
        "ventas_por_semana": ventas_por_semana,
        "ventas_por_mes": ventas_por_mes,
        "top_productos": top_productos,
        "ventas_por_categoria": ventas_por_categoria
    }
