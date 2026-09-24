import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Package,
  MessageSquare,
  Users,
  Search,
  Plus,
  Edit2,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Download,
  AlertTriangle,
  Mail,
  Phone,
  X
} from 'lucide-react';
import {
  usersAPI,
  productsAPI,
  salesAPI,
  invoicesAPI,
  pqrAPI,
  contactAPI,
  dashboardAPI
} from '../services/api.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import ModalCrearProducto from '../components/ModalCrearProducto.jsx';
import Toast from '../components/Toast.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';

export default function EmpleadoPanel() {
  const [activeTab, setActiveTab] = useState('operativo'); // 'operativo' | 'ventas' | 'pqr' | 'productos' | 'clientes' | 'mensajes'

  const [notification, setNotification] = useState(null);
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatCOP = (num) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num || 0);

  // ────────────────── TAB 1: OPERATIVO ──────────────────
  const [stats, setStats] = useState(null);
  useEffect(() => {
    dashboardAPI.getStats().then(res => {
      if (res.ok && res.data?.success) setStats(res.data);
    });
  }, []);

  // ────────────────── TAB 2: VENTAS Y FACTURAS ──────────────────
  const [sales, setSales] = useState([]);
  const [salesSearch, setSalesSearch] = useState('');
  const [downloadingInv, setDownloadingInv] = useState(null);

  const fetchSales = async () => {
    const res = await salesAPI.getAll({ search: salesSearch });
    if (res.ok && res.data?.sales) setSales(res.data.sales);
  };

  useEffect(() => {
    if (activeTab === 'ventas') fetchSales();
  }, [activeTab, salesSearch]);

  const handleDownloadInvoice = async (sale) => {
    setDownloadingInv(sale.numero_venta);
    const ok = await invoicesAPI.downloadPdf(sale.numero_venta, sale.numero_venta);
    setDownloadingInv(null);
    if (ok) showToast('Factura descargada en PDF.');
    else showToast('Error al descargar factura.', 'error');
  };

  // ────────────────── TAB 3: PQR ──────────────────
  const [pqrs, setPqrs] = useState([]);
  const [pqrFilter, setPqrFilter] = useState('Todos');
  const [replyingPqr, setReplyingPqr] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('Respondida');

  const fetchPqrs = async () => {
    const params = pqrFilter !== 'Todos' ? { estado: pqrFilter } : {};
    const res = await pqrAPI.getAll(params);
    if (res.ok && res.data?.pqrs) setPqrs(res.data.pqrs);
  };

  useEffect(() => {
    if (activeTab === 'pqr') fetchPqrs();
  }, [activeTab, pqrFilter]);

  const handleSavePqrReply = async () => {
    if (!replyingPqr) return;
    const res = await pqrAPI.updateStatus(
      replyingPqr.id || replyingPqr._id,
      { estado: replyStatus, respuesta: replyText },
      'Carlos Empleado'
    );
    if (res.ok && res.data?.success) {
      showToast(`PQR ${replyingPqr.radicado} respondida con éxito.`);
      setReplyingPqr(null);
      setReplyText('');
      fetchPqrs();
    } else {
      showToast('Error al actualizar PQR.', 'error');
    }
  };

  // ────────────────── TAB 4: PRODUCTOS ──────────────────
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await productsAPI.getAll({ search: productSearch });
    if (res.ok && res.data?.success) setProducts(res.data.products);
  };

  useEffect(() => {
    if (activeTab === 'productos') fetchProducts();
  }, [activeTab, productSearch]);

  // ────────────────── TAB 5: CLIENTES ──────────────────
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState('');

  const fetchClients = async () => {
    const res = await usersAPI.getAll({ search: clientSearch, rol: 'Cliente' });
    if (res.ok && res.data?.success) setClients(res.data.users);
  };

  useEffect(() => {
    if (activeTab === 'clientes') fetchClients();
  }, [activeTab, clientSearch]);

  // ────────────────── TAB 6: MENSAJES DE CONTACTO ──────────────────
  const [messages, setMessages] = useState([]);
  const fetchMessages = async () => {
    const res = await contactAPI.getAll();
    if (res.ok && res.data?.messages) setMessages(res.data.messages);
  };

  useEffect(() => {
    if (activeTab === 'mensajes') fetchMessages();
  }, [activeTab]);

  const handleUpdateMessageStatus = async (id, estado) => {
    const res = await contactAPI.updateStatus(id, estado);
    if (res.ok) {
      showToast(`Mensaje marcado como ${estado}.`);
      fetchMessages();
    }
  };

  const sidebarTabs = [
    { id: 'operativo', label: 'Dashboard Operativo', icon: ShoppingBag },
    { id: 'ventas', label: 'Ventas y Facturas', icon: Package, badge: stats?.total_ventas },
    { id: 'pqr', label: 'Atención de PQR', icon: MessageSquare, badge: stats?.pqr_pendientes ? `${stats.pqr_pendientes} pend.` : undefined },
    { id: 'productos', label: 'Control de Inventario', icon: Package },
    { id: 'clientes', label: 'Directorio de Clientes', icon: Users },
    { id: 'mensajes', label: 'Mensajes Web', icon: Mail }
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={sidebarTabs}
      title="Panel de Operaciones y Ventas"
      subtitle="Gestión de despachos, pedidos, facturas y atención de solicitudes PQR"
      roleName="Empleado"
    >
      {notification && <Toast message={notification.msg} type={notification.type} />}

      {/* ── TAB 1: OPERATIVO ── */}
      {activeTab === 'operativo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              title="Ventas del Día"
              value={stats?.ventas_hoy || 0}
              icon={ShoppingBag}
              color="orange"
            />
            <StatCard
              title="Facturación Hoy"
              value={formatCOP(stats?.facturacion_hoy)}
              icon={ShoppingBag}
              color="emerald"
            />
            <StatCard
              title="PQR Pendientes"
              value={stats?.pqr_pendientes || 0}
              icon={AlertTriangle}
              color="rose"
            />
            <StatCard
              title="Productos en Catálogo"
              value={stats?.total_productos || 0}
              icon={Package}
              color="blue"
            />
          </div>

          <div className="p-6 rounded-2xl border space-y-3"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <h3 className="text-sm font-black text-[color:var(--text-main)] uppercase tracking-wider">
              Guía Operativa para Empleados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border space-y-1.5" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <span className="font-bold text-orange-400 block">1. Despachos y Facturas</span>
                <p className="text-slate-300 leading-relaxed">
                  Consulta el módulo de **Ventas y Facturas** para descargar la factura oficial en PDF de cada compra y alistarla junto al paquete.
                </p>
              </div>

              <div className="p-4 rounded-xl border space-y-1.5" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <span className="font-bold text-sky-400 block">2. Atención de PQR</span>
                <p className="text-slate-300 leading-relaxed">
                  Revisa oportunamente las **PQR Pendientes**. Recuerda que por ley se debe dar respuesta oportuna a los usuarios.
                </p>
              </div>

              <div className="p-4 rounded-xl border space-y-1.5" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <span className="font-bold text-emerald-400 block">3. Control de Stock</span>
                <p className="text-slate-300 leading-relaxed">
                  Mantén actualizado el inventario en **Control de Inventario** para evitar quiebres de stock en la tienda pública.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: VENTAS Y FACTURAS ── */}
      {activeTab === 'ventas' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Gestión de Ventas y Pedidos</h3>
              <p className="text-xs text-slate-400">Consulta de pedidos y descarga directa de facturas para despacho</p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Buscar venta o cliente..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                    <th className="p-3.5 font-bold text-slate-400">Nº Venta</th>
                    <th className="p-3.5 font-bold text-slate-400">Fecha</th>
                    <th className="p-3.5 font-bold text-slate-400">Cliente</th>
                    <th className="p-3.5 font-bold text-slate-400">Total</th>
                    <th className="p-3.5 font-bold text-slate-400">Estado</th>
                    <th className="p-3.5 font-bold text-slate-400 text-right">Factura PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                  {sales.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono font-bold text-orange-400">{s.numero_venta}</td>
                      <td className="p-3.5 text-slate-300">{s.fecha?.slice(0, 10)} {s.fecha?.slice(11, 16)}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-[color:var(--text-main)] block">{s.cliente_nombre}</span>
                        <span className="text-[10px] text-slate-500">{s.cliente_email}</span>
                      </td>
                      <td className="p-3.5 font-black text-emerald-400">{formatCOP(s.total)}</td>
                      <td className="p-3.5"><Badge color="emerald">{s.estado}</Badge></td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="emerald"
                          size="xs"
                          icon={Download}
                          disabled={downloadingInv === s.numero_venta}
                          onClick={() => handleDownloadInvoice(s)}
                        >
                          {downloadingInv === s.numero_venta ? 'Descargando...' : 'Factura PDF'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ATENCIÓN DE PQR ── */}
      {activeTab === 'pqr' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Atención a Solicitudes PQR</h3>
              <p className="text-xs text-slate-400">Responde y actualiza el estado de las peticiones de los clientes</p>
            </div>
            <select
              value={pqrFilter}
              onChange={(e) => setPqrFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border outline-none text-xs font-bold"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Respondida">Respondida</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          </div>

          <div className="space-y-4">
            {pqrs.map((p) => (
              <div key={p._id || p.id} className="p-5 rounded-2xl border space-y-3"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10">
                      {p.radicado}
                    </span>
                    <Badge color={p.estado === 'Respondida' ? 'emerald' : p.estado === 'En Proceso' ? 'sky' : 'rose'}>
                      {p.estado}
                    </Badge>
                    <h4 className="text-sm font-bold text-[color:var(--text-main)]">{p.asunto}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400">{p.fecha_creacion?.slice(0, 10)}</span>
                </div>

                <p className="text-xs text-slate-300 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  {p.descripcion}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-400">Cliente: <strong className="text-white">{p.cliente_nombre}</strong> ({p.cliente_email})</span>
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
                    <span className="font-bold text-emerald-400 block mb-0.5">Respuesta Oficial brindada:</span>
                    <p>{p.respuesta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

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

                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-400 font-bold block">Estado:</label>
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
                  <label className="text-slate-400 font-bold block">Respuesta para el Cliente:</label>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe la respuesta formal..."
                    className="w-full p-3 rounded-xl border outline-none text-xs"
                    style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <Button variant="ghost" size="sm" onClick={() => setReplyingPqr(null)}>
                    Cancelar
                  </Button>
                  <Button variant="orange" size="sm" icon={CheckCircle} onClick={handleSavePqrReply}>
                    Guardar Respuesta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: PRODUCTOS ── */}
      {activeTab === 'productos' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Control de Inventario y Stock</h3>
              <p className="text-xs text-slate-400">Actualiza existencias y precios del catálogo comercial</p>
            </div>
            <Button
              variant="orange"
              size="sm"
              icon={Plus}
              onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            >
              Nuevo Producto
            </Button>
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
                  <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-1 line-clamp-1">{p.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-orange-400">{formatCOP(p.price)}</span>
                    <span className="text-xs font-bold text-slate-300">Stock: {p.stock ?? 10} u.</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={Edit2}
                  className="w-full"
                  onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}
                >
                  Editar Información / Stock
                </Button>
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

      {/* ── TAB 5: CLIENTES ── */}
      {activeTab === 'clientes' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Directorio de Clientes</h3>
              <p className="text-xs text-slate-400">Consulta datos de contacto y entrega de los clientes registrados</p>
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                  <th className="p-3.5 font-bold text-slate-400">Cliente</th>
                  <th className="p-3.5 font-bold text-slate-400">Documento</th>
                  <th className="p-3.5 font-bold text-slate-400">Teléfono</th>
                  <th className="p-3.5 font-bold text-slate-400">Dirección</th>
                  <th className="p-3.5 font-bold text-slate-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                {clients.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5">
                      <span className="font-bold text-[color:var(--text-main)] block">{c.nombre} {c.apellido}</span>
                      <span className="text-[10px] text-slate-500">{c.email}</span>
                    </td>
                    <td className="p-3.5 text-slate-300">{c.tipoDocumento || 'CC'}: {c.numeroDocumento}</td>
                    <td className="p-3.5 text-slate-300">{c.telefono || 'N/A'}</td>
                    <td className="p-3.5 text-slate-300">{c.direccion || 'Medellín, Colombia'}</td>
                    <td className="p-3.5"><Badge color="emerald">{c.estado || 'Activo'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 6: MENSAJES DE CONTACTO ── */}
      {activeTab === 'mensajes' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-black text-[color:var(--text-main)]">Mensajes Recibidos desde la Web</h3>
            <p className="text-xs text-slate-400">Consultas generales enviadas a través del formulario de contacto</p>
          </div>

          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m._id || m.id} className="p-4 rounded-2xl border space-y-2"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[color:var(--text-main)]">{m.nombre}</span>
                    <span className="text-slate-400 text-xs">({m.email})</span>
                  </div>
                  <Badge color={m.estado === 'Respondido' ? 'emerald' : 'orange'}>{m.estado || 'Pendiente'}</Badge>
                </div>
                <p className="text-xs text-slate-300">{m.mensaje}</p>
                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleUpdateMessageStatus(m._id || m.id, 'Respondido')}
                  >
                    Marcar como Atendido
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
