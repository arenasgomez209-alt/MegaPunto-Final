import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  FileText,
  FileSpreadsheet,
  Download,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Clock,
  Filter,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  MessageSquare,
  Shield,
  Send,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  usersAPI,
  productsAPI,
  salesAPI,
  invoicesAPI,
  reportsAPI,
  dashboardAPI,
  pqrAPI
} from '../services/api.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import ModalCrearProducto from '../components/ModalCrearProducto.jsx';
import ModalGestionUsuario from '../components/ModalGestionUsuario.jsx';
import Toast from '../components/Toast.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'ventas' | 'facturas' | 'reportes' | 'pqr' | 'usuarios' | 'productos'

  // Notification Toast
  const [notification, setNotification] = useState(null);
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatCOP = (num) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num || 0);

  // ────────────────── TAB 1: ANALYTICS & DASHBOARD ──────────────────
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsPeriod, setStatsPeriod] = useState('dia'); // 'dia' | 'semana' | 'mes'
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    const params = {};
    if (filterStartDate) params.fecha_inicio = filterStartDate;
    if (filterEndDate) params.fecha_fin = filterEndDate;
    if (filterStatus !== 'Todos') params.estado = filterStatus;

    const res = await dashboardAPI.getStats(params);
    setLoadingStats(false);
    if (res.ok && res.data?.success) {
      setDashboardStats(res.data);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [filterStartDate, filterEndDate, filterStatus]);

  // ────────────────── TAB 2: VENTAS ──────────────────
  const [sales, setSales] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [salesSearch, setSalesSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchSales = async () => {
    setLoadingSales(true);
    const res = await salesAPI.getAll({ search: salesSearch });
    setLoadingSales(false);
    if (res.ok && res.data?.sales) {
      setSales(res.data.sales);
    }
  };

  useEffect(() => {
    if (activeTab === 'ventas') fetchSales();
  }, [activeTab, salesSearch]);

  // ────────────────── TAB 3: FACTURAS ──────────────────
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [downloadingInv, setDownloadingInv] = useState(null);

  const fetchInvoices = async () => {
    setLoadingInvoices(true);
    const res = await invoicesAPI.getAll({ search: invoiceSearch });
    setLoadingInvoices(false);
    if (res.ok && res.data?.invoices) {
      setInvoices(res.data.invoices);
    }
  };

  useEffect(() => {
    if (activeTab === 'facturas') fetchInvoices();
  }, [activeTab, invoiceSearch]);

  const handleDownloadInvoice = async (inv) => {
    setDownloadingInv(inv.id || inv._id);
    const ok = await invoicesAPI.downloadPdf(inv.id || inv._id, inv.numero_factura);
    setDownloadingInv(null);
    if (ok) {
      showToast(`Factura ${inv.numero_factura} descargada exitosamente.`);
    } else {
      showToast('Error al descargar la factura en PDF.', 'error');
    }
  };

  // ────────────────── TAB 4: REPORTES DIARIOS ──────────────────
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyReportData, setDailyReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const fetchDailyReport = async (date) => {
    setLoadingReport(true);
    const res = await reportsAPI.getDaily(date);
    setLoadingReport(false);
    if (res.ok && res.data?.success) {
      setDailyReportData(res.data);
    }
  };

  useEffect(() => {
    if (activeTab === 'reportes') fetchDailyReport(reportDate);
  }, [activeTab, reportDate]);

  const handleExportReportPdf = async () => {
    setExportingPdf(true);
    const ok = await reportsAPI.downloadDailyPdf(reportDate);
    setExportingPdf(false);
    if (ok) showToast(`Reporte PDF del ${reportDate} generado y descargado.`);
    else showToast('Error al exportar reporte en PDF.', 'error');
  };

  const handleExportReportExcel = async () => {
    setExportingExcel(true);
    const ok = await reportsAPI.downloadDailyExcel(reportDate);
    setExportingExcel(false);
    if (ok) showToast(`Reporte Excel (.xlsx) del ${reportDate} generado.`);
    else showToast('Error al exportar reporte en Excel.', 'error');
  };

  // ────────────────── TAB 5: PQR ──────────────────
  const [pqrs, setPqrs] = useState([]);
  const [loadingPqrs, setLoadingPqrs] = useState(false);
  const [pqrFilterStatus, setPqrFilterStatus] = useState('Todos');
  const [replyingPqr, setReplyingPqr] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('Respondida');

  const fetchPqrs = async () => {
    setLoadingPqrs(true);
    const params = pqrFilterStatus !== 'Todos' ? { estado: pqrFilterStatus } : {};
    const res = await pqrAPI.getAll(params);
    setLoadingPqrs(false);
    if (res.ok && res.data?.pqrs) {
      setPqrs(res.data.pqrs);
    }
  };

  useEffect(() => {
    if (activeTab === 'pqr') fetchPqrs();
  }, [activeTab, pqrFilterStatus]);

  const handleSavePqrReply = async () => {
    if (!replyingPqr) return;
    const res = await pqrAPI.updateStatus(
      replyingPqr.id || replyingPqr._id,
      { estado: replyStatus, respuesta: replyText },
      'Juan Administrador'
    );
    if (res.ok && res.data?.success) {
      showToast(`PQR ${replyingPqr.radicado} actualizada exitosamente.`);
      setReplyingPqr(null);
      setReplyText('');
      fetchPqrs();
    } else {
      showToast('Error al actualizar PQR.', 'error');
    }
  };

  // ────────────────── TAB 6: USUARIOS ──────────────────
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Todos');
  const [userStatusFilter, setUserStatusFilter] = useState('Todos');
  const [userSubTab, setUserSubTab] = useState('empleados'); // 'empleados' | 'clientes'

  // Modal crear/editar empleado
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = crear, object = editar
  const emptyUserForm = { nombre: '', apellido: '', email: '', telefono: '', tipoDocumento: 'CC', numeroDocumento: '', password: '' };
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);

  const openCreateEmpleado = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
    setIsUserModalOpen(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      telefono: user.telefono || '',
      tipoDocumento: user.tipoDocumento || 'CC',
      numeroDocumento: user.numeroDocumento || '',
      password: ''
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (payload) => {
    setSavingUser(true);
    let res;
    if (editingUser) {
      res = await usersAPI.update(editingUser._id || editingUser.id, payload);
    } else {
      res = await usersAPI.create({ ...payload, rol: 'Empleado' });
    }
    setSavingUser(false);
    if (res.ok && (res.data?.success || res.data?.id || res.data?._id)) {
      showToast(editingUser ? 'Usuario actualizado correctamente.' : 'Empleado creado correctamente.');
      setIsUserModalOpen(false);
      fetchUsers();
    } else {
      showToast(res.data?.message || 'Error al guardar. Verifica los datos.', 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    const rol = user.rol || 'Usuario';
    if (!window.confirm(`¿Eliminar a ${user.nombre} ${user.apellido || ''} (${rol})? Esta acción no se puede deshacer.`)) return;
    const res = await usersAPI.delete(user._id || user.id);
    if (res.ok) {
      showToast(`${user.nombre} eliminado correctamente.`);
      fetchUsers();
    } else {
      showToast(res.data?.message || 'Error al eliminar usuario.', 'error');
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await usersAPI.getAll({
      search: userSearch,
      rol: userRoleFilter !== 'Todos' ? userRoleFilter : undefined,
      estado: userStatusFilter !== 'Todos' ? userStatusFilter : undefined
    });
    setLoadingUsers(false);
    if (res.ok && res.data?.success) {
      setUsers(res.data.users || []);
    }
  };

  useEffect(() => {
    if (activeTab === 'usuarios') fetchUsers();
  }, [activeTab, userRoleFilter, userStatusFilter]);

  const handleToggleUserStatus = async (user) => {
    const res = await usersAPI.toggleStatus(user._id || user.id);
    if (res.ok && res.data?.success) {
      showToast(`Estado de ${user.nombre} actualizado a ${res.data.user?.estado || 'cambiado'}.`);
      fetchUsers();
    } else {
      showToast('Error al cambiar estado.', 'error');
    }
  };

  // Filtros por sub-pestaña
  const empleados = users.filter(u => u.rol === 'Empleado');
  const clientes  = users.filter(u => u.rol === 'Cliente');

  // ────────────────── TAB 7: PRODUCTOS ──────────────────
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await productsAPI.getAll({ search: productSearch });
    setLoadingProducts(false);
    if (res.ok && res.data?.success) {
      setProducts(res.data.products);
    }
  };

  useEffect(() => {
    if (activeTab === 'productos') fetchProducts();
  }, [activeTab]);

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    const res = await productsAPI.delete(prodId);
    if (res.ok) {
      showToast('Producto eliminado.');
      fetchProducts();
    }
  };

  // ────────────────── SIDEBAR TABS DEFINITION ──────────────────
  const sidebarTabs = [
    { id: 'analytics', label: 'Dashboard & Analítica', icon: TrendingUp },
    { id: 'ventas', label: 'Historial de Ventas', icon: ShoppingBag, badge: dashboardStats?.total_ventas },
    { id: 'facturas', label: 'Facturas de Venta', icon: FileText },
    { id: 'reportes', label: 'Reportes Diarios (PDF/XLS)', icon: FileSpreadsheet },
    { id: 'pqr', label: 'Gestión de PQR', icon: MessageSquare, badge: dashboardStats?.pqr_pendientes ? `${dashboardStats.pqr_pendientes} pend.` : undefined },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users, badge: dashboardStats?.total_usuarios },
    { id: 'productos', label: 'Catálogo & Inventario', icon: Package, badge: dashboardStats?.total_productos }
  ];

  // Chart data selector
  const chartData = statsPeriod === 'mes'
    ? (dashboardStats?.ventas_por_mes || [])
    : statsPeriod === 'semana'
    ? (dashboardStats?.ventas_por_semana || [])
    : (dashboardStats?.ventas_por_dia || []);

  const chartXKey = statsPeriod === 'mes' ? 'mes' : statsPeriod === 'semana' ? 'semana' : 'fecha';

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={sidebarTabs}
      title="Panel de Administración General"
      subtitle="Control central de analítica comercial, ventas, reportes y PQR"
      roleName="Administrador"
    >
      {notification && <Toast message={notification.msg} type={notification.type} />}

      {/* ════════════════════ TAB 1: ANALYTICS & DASHBOARD ════════════════════ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Filter Bar (Requerimiento 13) */}
          <div className="p-4 rounded-2xl border bg-white border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-slate-800">Filtros del Dashboard:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px] font-medium">Desde:</span>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px] font-medium">Hasta:</span>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 outline-none text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Completada">Completada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelada">Cancelada</option>
              </select>

              {(filterStartDate || filterEndDate || filterStatus !== 'Todos') && (
                <button
                  onClick={() => { setFilterStartDate(''); setFilterEndDate(''); setFilterStatus('Todos'); }}
                  className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  Restablecer
                </button>
              )}
            </div>
          </div>

          {/* KPI Cards (Requerimiento 10) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              title="Ventas Totales"
              value={dashboardStats?.total_ventas || 0}
              icon={ShoppingBag}
              color="orange"
              trend={dashboardStats?.ventas_hoy ? `+${dashboardStats.ventas_hoy} hoy` : 'Al día'}
            />
            <StatCard
              title="Facturación Total"
              value={formatCOP(dashboardStats?.total_facturacion)}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Usuarios"
              value={dashboardStats?.total_usuarios || 0}
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Productos"
              value={dashboardStats?.total_productos || 0}
              icon={Package}
              color="blue"
            />
            <StatCard
              title="PQR Recibidas"
              value={dashboardStats?.pqr_recibidas || 0}
              icon={MessageSquare}
              color="sky"
            />
            <StatCard
              title="PQR Pendientes"
              value={dashboardStats?.pqr_pendientes || 0}
              icon={AlertTriangle}
              color="rose"
            />
          </div>

          {/* Period selector for charts */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[color:var(--text-main)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Comportamiento y Análisis de Ventas
            </h3>
            <div className="flex items-center gap-1 p-1 rounded-xl border bg-white border-slate-200 shadow-2xs">
              <button
                onClick={() => setStatsPeriod('dia')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsPeriod === 'dia' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Por Día
              </button>
              <button
                onClick={() => setStatsPeriod('semana')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsPeriod === 'semana' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Por Semana
              </button>
              <button
                onClick={() => setStatsPeriod('mes')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statsPeriod === 'mes' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Por Mes
              </button>
            </div>
          </div>

          {/* Charts Row: Bar Chart + Line Chart (Requerimiento 11) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras: Monto de Facturación */}
            <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Facturación Comercial ({statsPeriod.toUpperCase()})
                  </h4>
                  <p className="text-[11px] text-slate-500">Total en pesos colombianos (COP)</p>
                </div>
                <Badge color="orange">Gráfico de Barras</Badge>
              </div>

              <div className="h-64 w-full pt-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey={chartXKey} stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        formatter={(val) => [formatCOP(val), 'Facturación']}
                      />
                      <Bar dataKey="total" fill="#ea580c" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">Sin datos en el período</div>
                )}
              </div>
            </div>

            {/* Gráfico Lineal: Número de Ventas y Tendencia */}
            <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Operaciones y Tendencia de Ventas
                  </h4>
                  <p className="text-[11px] text-slate-500">Volumen de pedidos confirmados</p>
                </div>
                <Badge color="emerald">Gráfico Lineal</Badge>
              </div>

              <div className="h-64 w-full pt-2">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey={chartXKey} stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                        formatter={(val) => [val, 'Ventas Realizadas']}
                      />
                      <Line type="monotone" dataKey="cantidad" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs">Sin datos en el período</div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Top Products & Categories Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Top 5 Productos con Mayor Facturación
              </h4>
              <div className="space-y-2">
                {dashboardStats?.top_productos?.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-black flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 truncate">{p.nombre}</span>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="font-black text-orange-600 block">{formatCOP(p.total)}</span>
                      <span className="text-[10px] text-slate-500">{p.cantidad} u. vendidas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorías */}
            <div className="p-5 rounded-2xl border bg-white border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Distribución por Categorías
              </h4>
              <div className="space-y-2">
                {dashboardStats?.ventas_por_categoria?.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs hover:border-slate-300 transition-colors">
                    <span className="font-bold text-slate-800">{cat.categoria}</span>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">{formatCOP(cat.total)}</span>
                      <span className="text-[10px] text-slate-500">{cat.cantidad} unidades</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ TAB 2: HISTORIAL DE VENTAS ════════════════════ */}
      {activeTab === 'ventas' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Historial General de Ventas</h3>
              <p className="text-xs text-slate-400">Consulta de operaciones registradas desde la tienda web y módulos POS</p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Buscar por venta, cliente, producto..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          {/* Sales Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                    <th className="p-3.5 font-bold text-slate-400">Nº Venta</th>
                    <th className="p-3.5 font-bold text-slate-400">Fecha</th>
                    <th className="p-3.5 font-bold text-slate-400">Cliente</th>
                    <th className="p-3.5 font-bold text-slate-400">Ítems</th>
                    <th className="p-3.5 font-bold text-slate-400">Método</th>
                    <th className="p-3.5 font-bold text-slate-400">Total</th>
                    <th className="p-3.5 font-bold text-slate-400">Estado</th>
                    <th className="p-3.5 font-bold text-slate-400 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                  {sales.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-orange-400">{s.numero_venta}</td>
                      <td className="p-3.5 text-slate-300">{s.fecha?.slice(0, 10)} {s.fecha?.slice(11, 16)}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-[color:var(--text-main)] block">{s.cliente_nombre}</span>
                        <span className="text-[10px] text-slate-500">{s.cliente_email}</span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {s.items?.length || 1} producto(s)
                      </td>
                      <td className="p-3.5 font-semibold uppercase text-slate-400">{s.metodo_pago}</td>
                      <td className="p-3.5 font-black text-emerald-400">{formatCOP(s.total)}</td>
                      <td className="p-3.5">
                        <Badge color={s.estado === 'Completada' ? 'emerald' : 'orange'}>{s.estado}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Eye}
                          onClick={() => setSelectedSale(s)}
                        >
                          Ver Detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">No se encontraron ventas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sale Detail Modal */}
          {selectedSale && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                 onClick={() => setSelectedSale(null)}>
              <div className="w-full max-w-xl rounded-3xl border p-6 space-y-4"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                   onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="text-base font-black text-[color:var(--text-main)]">Detalle de Operación</h3>
                    <p className="text-xs text-orange-400 font-mono font-bold">{selectedSale.numero_venta}</p>
                  </div>
                  <button onClick={() => setSelectedSale(null)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-2xl border"
                     style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cliente:</span>
                    <span className="font-bold text-[color:var(--text-main)]">{selectedSale.cliente_nombre}</span>
                    <span className="text-[11px] text-slate-400 block">{selectedSale.cliente_email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Dirección de Entrega:</span>
                    <span className="font-bold text-[color:var(--text-main)]">{selectedSale.direccion_envio || 'Medellín, Colombia'}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ítems Vendidos</h4>
                  {selectedSale.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border text-xs"
                         style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                      <div>
                        <span className="font-bold text-[color:var(--text-main)] block">{it.nombre}</span>
                        <span className="text-[10px] text-slate-400">{it.tipo} · Cant: {it.cantidad} × {formatCOP(it.precio_unitario)}</span>
                      </div>
                      <span className="font-black text-orange-400">{formatCOP(it.total || (it.precio_unitario * it.cantidad))}</span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="p-3 rounded-xl border space-y-1.5 text-xs text-right"
                     style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>{formatCOP(selectedSale.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IVA (19%):</span>
                    <span>{formatCOP(selectedSale.impuestos)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-orange-400 pt-1 border-t border-white/10">
                    <span>Total Cancelado:</span>
                    <span>{formatCOP(selectedSale.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ TAB 3: FACTURACIÓN ════════════════════ */}
      {activeTab === 'facturas' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Facturación Electrónica</h3>
              <p className="text-xs text-slate-400">Consulta y descarga directa de facturas de venta en formato PDF</p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Buscar por nº de factura, cliente, documento..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                    <th className="p-3.5 font-bold text-slate-400">Nº Factura</th>
                    <th className="p-3.5 font-bold text-slate-400">Fecha Emisión</th>
                    <th className="p-3.5 font-bold text-slate-400">Cliente</th>
                    <th className="p-3.5 font-bold text-slate-400">Documento</th>
                    <th className="p-3.5 font-bold text-slate-400">Total</th>
                    <th className="p-3.5 font-bold text-slate-400">Estado</th>
                    <th className="p-3.5 font-bold text-slate-400 text-right">Descargar</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                  {invoices.map((inv) => (
                    <tr key={inv._id || inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-emerald-400">{inv.numero_factura}</td>
                      <td className="p-3.5 text-slate-300">{inv.fecha_emision?.slice(0, 10)}</td>
                      <td className="p-3.5 font-bold text-[color:var(--text-main)]">{inv.cliente?.nombre}</td>
                      <td className="p-3.5 text-slate-400">{inv.cliente?.documento || 'No registrado'}</td>
                      <td className="p-3.5 font-black text-orange-400">{formatCOP(inv.total)}</td>
                      <td className="p-3.5">
                        <Badge color="emerald">{inv.estado || 'Pagada'}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="emerald"
                          size="xs"
                          icon={Download}
                          disabled={downloadingInv === (inv.id || inv._id)}
                          onClick={() => handleDownloadInvoice(inv)}
                        >
                          {downloadingInv === (inv.id || inv._id) ? 'Generando...' : 'Descargar PDF'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">No hay facturas disponibles con el filtro actual.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ TAB 4: REPORTES DIARIOS (PDF / EXCEL) ════════════════════ */}
      {activeTab === 'reportes' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header & Controls */}
          <div className="p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                Generación y Exportación de Reportes Diarios
              </h3>
              <p className="text-xs text-slate-400">Exporta en formatos oficiales PDF y Excel (.xlsx) para auditorías SENA</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border outline-none text-xs font-bold"
                  style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                />
              </div>

              {/* Botón Exportar PDF (Requerimiento 5) */}
              <Button
                variant="orange"
                size="sm"
                icon={Download}
                disabled={exportingPdf}
                onClick={handleExportReportPdf}
              >
                {exportingPdf ? 'Exportando...' : 'Exportar PDF'}
              </Button>

              {/* Botón Exportar Excel (Requerimiento 6) */}
              <Button
                variant="emerald"
                size="sm"
                icon={FileSpreadsheet}
                disabled={exportingExcel}
                onClick={handleExportReportExcel}
              >
                {exportingExcel ? 'Exportando...' : 'Exportar Excel (.xlsx)'}
              </Button>
            </div>
          </div>

          {/* Daily Consolidated Cards */}
          {dailyReportData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <span className="text-[11px] text-slate-400 font-semibold block">Ventas Registradas</span>
                <span className="text-xl font-black text-orange-400 mt-1 block">{dailyReportData.total_operaciones}</span>
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <span className="text-[11px] text-slate-400 font-semibold block">Ítems Vendidos</span>
                <span className="text-xl font-black text-sky-400 mt-1 block">{dailyReportData.total_items_vendidos}</span>
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <span className="text-[11px] text-slate-400 font-semibold block">IVA Consolidado (19%)</span>
                <span className="text-xl font-black text-purple-400 mt-1 block">{formatCOP(dailyReportData.impuestos)}</span>
              </div>
              <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <span className="text-[11px] text-slate-400 font-semibold block">Total General Facturado</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">{formatCOP(dailyReportData.total_general)}</span>
              </div>
            </div>
          )}

          {/* Daily Sales Table Preview */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-glass)' }}>
              <span className="text-xs font-black text-[color:var(--text-main)] uppercase tracking-wider">
                Operaciones del Día: {reportDate}
              </span>
              <Badge color="orange">{dailyReportData?.ventas?.length || 0} Registros</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                    <th className="p-3 font-bold text-slate-400">Nº Venta</th>
                    <th className="p-3 font-bold text-slate-400">Hora</th>
                    <th className="p-3 font-bold text-slate-400">Cliente</th>
                    <th className="p-3 font-bold text-slate-400">Productos/Servicios</th>
                    <th className="p-3 font-bold text-slate-400">Subtotal</th>
                    <th className="p-3 font-bold text-slate-400">IVA</th>
                    <th className="p-3 font-bold text-slate-400">Total</th>
                    <th className="p-3 font-bold text-slate-400">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                  {dailyReportData?.ventas?.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-mono font-bold text-orange-400">{s.numero_venta}</td>
                      <td className="p-3 text-slate-300">{s.fecha?.slice(11, 16) || '--:--'}</td>
                      <td className="p-3 font-bold text-[color:var(--text-main)]">{s.cliente_nombre}</td>
                      <td className="p-3 text-slate-300 max-w-xs truncate">
                        {s.items?.map(it => `${it.nombre} (x${it.cantidad})`).join(', ')}
                      </td>
                      <td className="p-3 text-slate-400">{formatCOP(s.subtotal)}</td>
                      <td className="p-3 text-slate-400">{formatCOP(s.impuestos)}</td>
                      <td className="p-3 font-black text-emerald-400">{formatCOP(s.total)}</td>
                      <td className="p-3">
                        <Badge color={s.estado === 'Completada' ? 'emerald' : 'orange'}>{s.estado}</Badge>
                      </td>
                    </tr>
                  ))}
                  {(!dailyReportData?.ventas || dailyReportData.ventas.length === 0) && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">No se registraron ventas en la fecha {reportDate}.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════ TAB 5: GESTIÓN DE PQR ════════════════════ */}
      {activeTab === 'pqr' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Gestión de Peticiones, Quejas y Reclamos (PQR)</h3>
              <p className="text-xs text-slate-400">Atención oficial a solicitudes radicadas por los clientes</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtrar por estado:</span>
              <select
                value={pqrFilterStatus}
                onChange={(e) => setPqrFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl border outline-none text-xs font-bold"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
              >
                <option value="Todos">Todos</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Respondida">Respondida</option>
                <option value="Cerrada">Cerrada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pqrs.map((p) => {
              const statusColor = p.estado === 'Respondida' ? 'emerald' : p.estado === 'En Proceso' ? 'sky' : p.estado === 'Cerrada' ? 'purple' : 'rose';
              return (
                <div
                  key={p._id || p.id}
                  className="p-5 rounded-2xl border space-y-3"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                        {p.radicado}
                      </span>
                      <span className="text-xs font-black text-slate-300">[{p.tipo}]</span>
                      <h4 className="text-sm font-bold text-[color:var(--text-main)]">{p.asunto}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge color={statusColor}>{p.estado}</Badge>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {p.fecha_creacion?.slice(0, 10)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    {p.descripcion}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                    <div className="text-slate-400">
                      <span>Radicado por: </span>
                      <span className="font-bold text-[color:var(--text-main)]">{p.cliente_nombre}</span> ({p.cliente_email})
                    </div>

                    <Button
                      variant="orange"
                      size="xs"
                      icon={Send}
                      onClick={() => {
                        setReplyingPqr(p);
                        setReplyText(p.respuesta || '');
                        setReplyStatus(p.estado || 'Respondida');
                      }}
                    >
                      {p.respuesta ? 'Modificar Respuesta' : 'Responder PQR'}
                    </Button>
                  </div>

                  {p.respuesta && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                      <span className="font-bold block text-emerald-400 mb-1">
                        Respuesta Oficial (por {p.atendido_por || 'Soporte'}):
                      </span>
                      <p>{p.respuesta}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {pqrs.length === 0 && (
              <div className="p-12 text-center text-slate-400 border rounded-2xl" style={{ borderColor: 'var(--border-card)' }}>
                No hay solicitudes PQR registradas bajo este criterio.
              </div>
            )}
          </div>

          {/* Modal para Responder PQR */}
          {replyingPqr && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                 onClick={() => setReplyingPqr(null)}>
              <div className="w-full max-w-lg rounded-3xl border p-6 space-y-4"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                   onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-black text-[color:var(--text-main)]">
                    Atención de PQR: {replyingPqr.radicado}
                  </h3>
                  <button onClick={() => setReplyingPqr(null)} className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400">Asunto:</span>
                  <p className="font-bold text-[color:var(--text-main)]">{replyingPqr.asunto}</p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-400 font-bold block">Nuevo Estado:</label>
                  <select
                    value={replyStatus}
                    onChange={(e) => setReplyStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border outline-none text-xs"
                    style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                  >
                    <option value="En Proceso">En Proceso</option>
                    <option value="Respondida">Respondida</option>
                    <option value="Cerrada">Cerrada</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-400 font-bold block">Respuesta Oficial al Cliente:</label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe la respuesta formal, solución o explicación detallada..."
                    className="w-full p-3 rounded-xl border outline-none text-xs"
                    style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <Button variant="ghost" size="sm" onClick={() => setReplyingPqr(null)}>
                    Cancelar
                  </Button>
                  <Button variant="orange" size="sm" icon={CheckCircle} onClick={handleSavePqrReply}>
                    Guardar y Notificar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════ TAB 6: GESTIÓN DE USUARIOS ════════════════════ */}
      {activeTab === 'usuarios' && (
        <div className="space-y-5 animate-fadeIn">

          {/* Header + botón crear empleado */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Control y Gestión de Usuarios</h3>
              <p className="text-xs font-medium" style={{color:'#7c3aed'}}>Administra empleados y clientes de la plataforma</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Input placeholder="Buscar..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} icon={Search} />
              {userSubTab === 'empleados' && (
                <Button variant="orange" size="sm" icon={Plus} onClick={openCreateEmpleado}>
                  Nuevo Empleado
                </Button>
              )}
            </div>
          </div>

          {/* Sub-tabs: Empleados | Clientes */}
          <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-glass)' }}>
            {[{ id: 'empleados', label: `Empleados (${empleados.length})` }, { id: 'clientes', label: `Clientes (${clientes.length})` }].map(t => (
              <button
                key={t.id}
                onClick={() => setUserSubTab(t.id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer ${
                  userSubTab === t.id
                    ? 'bg-purple-600 text-white'
                    : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-main)] hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TABLA EMPLEADOS ── */}
          {userSubTab === 'empleados' && (
            <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                      <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Empleado</th>
                      <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Documento</th>
                      <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Teléfono</th>
                      <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Estado</th>
                      <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px] text-right" style={{color:'#7c3aed'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr><td colSpan={5} className="py-12 text-center">
                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs" style={{color:'#7c3aed'}}>Cargando empleados...</p>
                      </td></tr>
                    ) : empleados.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-sm" style={{color:'#524b6e'}}>No hay empleados registrados.</td></tr>
                    ) : empleados.filter(u => !userSearch || `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())).map((u) => (
                      <tr key={u._id || u.id} className="border-b hover:bg-purple-500/5 transition-colors" style={{ borderColor: 'var(--border-glass)' }}>
                        <td className="p-3.5">
                          <span className="font-bold text-[color:var(--text-main)] block">{u.nombre} {u.apellido}</span>
                          <span className="text-[10px] font-medium" style={{color:'#ea580c'}}>{u.email}</span>
                        </td>
                        <td className="p-3.5 font-semibold" style={{color:'#383252'}}>{u.tipoDocumento || 'CC'}: {u.numeroDocumento || '—'}</td>
                        <td className="p-3.5 font-semibold" style={{color:'#383252'}}>{u.telefono || '—'}</td>
                        <td className="p-3.5">
                          <Badge color={u.estado === 'Activo' ? 'emerald' : 'rose'}>{u.estado}</Badge>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="xs" icon={Edit2} onClick={() => openEditUser(u)}>Editar</Button>
                            <Button variant="ghost" size="xs" onClick={() => handleToggleUserStatus(u)}>
                              {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                            </Button>
                            <Button variant="danger" size="xs" icon={Trash2} onClick={() => handleDeleteUser(u)}>Eliminar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TABLA CLIENTES ── */}
          {userSubTab === 'clientes' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ background: 'rgba(234,88,12,0.06)', borderColor: 'rgba(234,88,12,0.2)' }}>
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                <p className="text-xs font-semibold" style={{color:'#ea580c'}}>Los clientes sólo pueden crearse mediante el registro público. Aquí puedes editar sus datos o eliminar su cuenta.</p>
              </div>
              <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                        <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Cliente</th>
                        <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Documento</th>
                        <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Teléfono</th>
                        <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px]" style={{color:'#7c3aed'}}>Estado</th>
                        <th className="p-3.5 font-extrabold uppercase tracking-wider text-[10px] text-right" style={{color:'#7c3aed'}}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr><td colSpan={5} className="py-12 text-center">
                          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs" style={{color:'#ea580c'}}>Cargando clientes...</p>
                        </td></tr>
                      ) : clientes.length === 0 ? (
                        <tr><td colSpan={5} className="py-12 text-center text-sm" style={{color:'#524b6e'}}>No hay clientes registrados aún.</td></tr>
                      ) : clientes.filter(u => !userSearch || `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())).map((u) => (
                        <tr key={u._id || u.id} className="border-b hover:bg-orange-500/5 transition-colors" style={{ borderColor: 'var(--border-glass)' }}>
                          <td className="p-3.5">
                            <span className="font-bold text-[color:var(--text-main)] block">{u.nombre} {u.apellido}</span>
                            <span className="text-[10px] font-medium" style={{color:'#ea580c'}}>{u.email}</span>
                          </td>
                          <td className="p-3.5 font-semibold" style={{color:'#383252'}}>{u.tipoDocumento || 'CC'}: {u.numeroDocumento || '—'}</td>
                          <td className="p-3.5 font-semibold" style={{color:'#383252'}}>{u.telefono || '—'}</td>
                          <td className="p-3.5">
                            <Badge color={u.estado === 'Activo' ? 'emerald' : 'rose'}>{u.estado}</Badge>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="xs" icon={Edit2} onClick={() => openEditUser(u)}>Editar</Button>
                              <Button variant="ghost" size="xs" onClick={() => handleToggleUserStatus(u)}>
                                {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                              </Button>
                              <Button variant="danger" size="xs" icon={Trash2} onClick={() => handleDeleteUser(u)}>Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── MODAL PORTAL: CREAR / EDITAR EMPLEADO O CLIENTE ── */}
          <ModalGestionUsuario
            isOpen={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSave={handleSaveUser}
            editingUser={editingUser}
            saving={savingUser}
          />
        </div>
      )}

      {/* ════════════════════ TAB 7: CATÁLOGO & PRODUCTOS ════════════════════ */}
      {activeTab === 'productos' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Catálogo de Productos</h3>
              <p className="text-xs font-medium" style={{color:'#7c3aed'}}>Administra precios, stock e inventario en tiempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="orange"
                size="sm"
                icon={Plus}
                onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
              >
                Nuevo Producto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p._id || p.id} className="p-4 rounded-2xl border space-y-3"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="h-40 rounded-xl overflow-hidden bg-slate-800">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <Badge color="orange">{p.category}</Badge>
                  <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-1.5 line-clamp-1">{p.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-orange-500">{formatCOP(p.price)}</span>
                    <span className="text-[11px] font-bold" style={{color:'#7c3aed'}}>Stock: {p.stock ?? 10} u.</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Edit2}
                    className="flex-1"
                    onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    icon={Trash2}
                    onClick={() => handleDeleteProduct(p._id || p.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <ModalCrearProducto
            isOpen={isProductModalOpen}
            onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
            onProductCreated={() => { setIsProductModalOpen(false); fetchProducts(); }}
            editingProduct={editingProduct}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
