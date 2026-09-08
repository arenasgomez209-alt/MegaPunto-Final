import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
  Truck,
  Eye,
  Shield,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  MapPin,
  FileText,
  Edit2
} from 'lucide-react';
import { usersAPI, contactAPI, productsAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';
import ModalCrearProducto from '../components/ModalCrearProducto.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';

export default function EmpleadoPanel() {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('clientes'); // 'clientes' | 'mensajes' | 'despachos' | 'productos'
  const [users, setUsers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Products state for viewing & editing
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todos');
  const [editingProduct, setEditingProduct] = useState(null);

  // Search & Filter state for Customers (Read-Only)
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('Todos');

  // Contact message state
  const [messageFilter, setMessageFilter] = useState('Todos');

  // Modal for adding/editing products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Selected customer for detail drawer
  const [selectedUser, setSelectedUser] = useState(null);

  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch users (Read-Only)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await usersAPI.getAll({
      search: userSearch,
      estado: userStatusFilter
    });
    setLoadingUsers(false);
    if (res.ok && res.data.success) {
      setUsers(res.data.users);
    }
  };

  // Fetch contact messages
  const fetchContactMessages = async () => {
    setLoadingMessages(true);
    const res = await contactAPI.getAll({
      estado: messageFilter
    });
    setLoadingMessages(false);
    if (res.ok && res.data.success) {
      setContactMessages(res.data.messages);
    }
  };

  // Fetch products for employee editing
  const fetchProducts = async () => {
    setLoadingProducts(true);
    const res = await productsAPI.getAll({
      search: productSearch,
      category: productCategoryFilter
    });
    setLoadingProducts(false);
    if (res.ok && res.data.success) {
      setProducts(res.data.products);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userStatusFilter]);

  useEffect(() => {
    fetchContactMessages();
  }, [messageFilter]);

  useEffect(() => {
    fetchProducts();
  }, [productCategoryFilter]);

  // Update contact message status
  const handleUpdateMessageStatus = async (msgId, newStatus) => {
    const res = await contactAPI.updateStatus(msgId, newStatus);
    if (res.ok && res.data.success) {
      showToast(`Consulta marcada como: ${newStatus}`);
      fetchContactMessages();
    } else {
      showToast(res.data?.message || 'Error al actualizar', 'error');
    }
  };

  const clientUsers = users.filter(u => u.rol === 'Cliente' || u.rol === 'Usuario');
  const pendingMessages = contactMessages.filter(m => m.estado === 'Pendiente').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <PageHeader
        title="Panel de Operaciones y Clientes"
        description={`Bienvenido, ${currentUser?.nombre || 'Empleado'}. Gestiona la atención al cliente, consulta el directorio de usuarios y edita o publica productos del catálogo.`}
        badgeText="Estación de Trabajo · Empleado MEGAPUNTO"
        badgeIcon={Shield}
        badgeColor="sky"
        actions={
          <>
            <button
              onClick={() => { fetchUsers(); fetchContactMessages(); fetchProducts(); }}
              className="p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer shadow-sm bg-white/5 border-white/10"
              title="Refrescar datos"
            >
              <RefreshCw className="w-4 h-4 text-sky-400" />
            </button>
            <Button
              variant="orange"
              size="md"
              icon={Plus}
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
            >
              Nuevo Producto
            </Button>
          </>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          iconColor="text-sky-400"
          iconBg="rgba(56, 189, 248, 0.15)"
          label="Directorio de Clientes"
          value={clientUsers.length}
          sublabel="Modo Consulta (Solo Lectura)"
          sublabelColor="text-sky-400"
        />
        <StatCard
          icon={ShoppingBag}
          iconColor="text-amber-400"
          iconBg="rgba(245, 158, 11, 0.15)"
          label="Catálogo de Productos"
          value={products.length}
          valueColor="text-amber-400"
          sublabel="Permiso de Edición Activo"
          sublabelColor="text-amber-400"
        />
        <StatCard
          icon={MessageSquare}
          iconColor="text-orange-400"
          iconBg="rgba(249, 115, 22, 0.15)"
          label="Consultas de Contacto"
          value={contactMessages.length}
          valueColor="text-orange-400"
          sublabel={`${pendingMessages} mensajes pendientes`}
          sublabelColor="text-rose-400"
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-3 border-b pb-1 overflow-x-auto" style={{ borderColor: 'var(--border-glass)' }}>
        <button
          onClick={() => { setActiveTab('productos'); fetchProducts(); }}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'productos'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Gestión de Productos ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('clientes')}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'clientes'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          Directorio de Clientes ({clientUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('mensajes')}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'mensajes'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Consultas de Clientes ({contactMessages.length})
        </button>

        <button
          onClick={() => setActiveTab('despachos')}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'despachos'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          Control de Despachos
        </button>
      </div>

      {/* TAB 1: DIRECTORIO DE CLIENTES (SOLO LECTURA) */}
      {activeTab === 'clientes' && (
        <div className="space-y-6 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre, documento o correo..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                />
              </div>
              <button
                onClick={fetchUsers}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-sky-600 text-white cursor-pointer hover:bg-sky-700 shadow"
              >
                Buscar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-slate-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                🔒 Permiso: Solo Consulta
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <table className="w-full text-left text-xs">
              <thead className="border-b text-[11px]" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                <tr>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Identificación</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Teléfono / WhatsApp</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Dirección de Entrega</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-right">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Cargando directorio de clientes...
                    </td>
                  </tr>
                ) : clientUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No se encontraron clientes registrados.
                    </td>
                  </tr>
                ) : (
                  clientUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-[color:var(--text-main)] block text-sm">
                              {u.nombre} {u.apellido}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-slate-300 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] mr-1.5 font-bold">
                          {u.tipoDocumento || 'CC'}
                        </span>
                        {u.numeroDocumento}
                      </td>

                      <td className="px-3 py-2.5 text-slate-300">
                        <a
                          href={`https://wa.me/57${u.telefono.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                          title="Abrir chat en WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{u.telefono}</span>
                        </a>
                      </td>

                      <td className="px-3 py-2.5 text-slate-300">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 max-w-xs truncate">
                          <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                          <span>{u.direccion}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.estado === 'Activo' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {u.estado}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ver Ficha
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CONSULTAS Y MENSAJES DE CONTACTO */}
      {activeTab === 'mensajes' && (
        <div className="space-y-6 animate-fadeInUp">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Filtrar por estado:</span>
              <div className="flex rounded-xl p-1 bg-black/20 border border-white/10">
                {['Todos', 'Pendiente', 'En Gestión', 'Atendido'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setMessageFilter(st)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      messageFilter === st ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Total consultas: <strong className="text-orange-400">{contactMessages.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loadingMessages ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                Cargando mensajes de contacto desde MongoDB...
              </div>
            ) : contactMessages.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 rounded-3xl border border-dashed p-8">
                No hay consultas registradas con este filtro.
              </div>
            ) : (
              contactMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-xl"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        msg.estado === 'Pendiente'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : msg.estado === 'En Gestión'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {msg.estado}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.createdAt).toLocaleString('es-CO')}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-[color:var(--text-main)]">{msg.asunto || 'Consulta General'}</h4>
                      <p className="text-xs text-orange-400 font-bold mt-0.5">{msg.nombre} ({msg.email})</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 leading-relaxed">
                      "{msg.mensaje}"
                    </div>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: 'var(--border-glass)' }}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateMessageStatus(msg._id, 'En Gestión')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 cursor-pointer"
                      >
                        En Gestión
                      </button>
                      <button
                        onClick={() => handleUpdateMessageStatus(msg._id, 'Atendido')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 cursor-pointer"
                      >
                        Marcar Atendido
                      </button>
                    </div>

                    <a
                      href={`mailto:${msg.email}?subject=Respuesta%20MEGAPUNTO:%20${encodeURIComponent(msg.asunto || 'Consulta')}`}
                      className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-orange-700 transition-colors shadow"
                    >
                      <Send className="w-3 h-3" /> Responder
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONTROL DE DESPACHOS */}
      {activeTab === 'despachos' && (
        <div className="space-y-6 animate-fadeInUp">
          <div className="p-6 sm:p-8 rounded-3xl border space-y-4 shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <h3 className="text-lg font-black text-[color:var(--text-main)] flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-400" /> Monitoreo y Salida de Pedidos
            </h3>
            <p className="text-xs text-slate-400">
              Registro logístico de despachos desde la bodega principal en Medellín para envíos nacionales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border bg-white/[0.02]" style={{ borderColor: 'var(--border-glass)' }}>
                <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">En Empaque</span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-2">Guía #ENV-8921 - Celular Smartphone</h4>
                <p className="text-xs text-slate-400 mt-1">Destino: Bogotá D.C. · Envía Colvanes</p>
              </div>

              <div className="p-4 rounded-2xl border bg-white/[0.02]" style={{ borderColor: 'var(--border-glass)' }}>
                <span className="text-[10px] font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">En Ruta</span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-2">Guía #ENV-8922 - Motocicleta Deportiva</h4>
                <p className="text-xs text-slate-400 mt-1">Destino: Medellín · Despacho Directo</p>
              </div>

              <div className="p-4 rounded-2xl border bg-white/[0.02]" style={{ borderColor: 'var(--border-glass)' }}>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Entregado</span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-2">Guía #ENV-8920 - Nevera Inverter</h4>
                <p className="text-xs text-slate-400 mt-1">Destino: Cali · Recibido a conformidad</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CATÁLOGO Y EDICIÓN DE PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="space-y-6 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar producto por título o descripción..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                />
              </div>
              <button
                onClick={fetchProducts}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-orange-600 text-white cursor-pointer hover:bg-orange-700 shadow"
              >
                Buscar
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="p-2.5 text-xs font-semibold rounded-xl outline-none cursor-pointer"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
              >
                <option value="Todos" style={{ background: '#0f0a28', color: '#fff' }}>Todas las Categorías</option>
                <option value="Celulares" style={{ background: '#0f0a28', color: '#fff' }}>Celulares</option>
                <option value="Motos" style={{ background: '#0f0a28', color: '#fff' }}>Motos</option>
                <option value="Electrodomésticos" style={{ background: '#0f0a28', color: '#fff' }}>Electrodomésticos</option>
                <option value="Tecnología" style={{ background: '#0f0a28', color: '#fff' }}>Tecnología</option>
                <option value="Moda & Ropa" style={{ background: '#0f0a28', color: '#fff' }}>Moda & Ropa</option>
                <option value="Calzado" style={{ background: '#0f0a28', color: '#fff' }}>Calzado</option>
              </select>

              <Button
                variant="orange"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                Nuevo Producto
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <table className="w-full text-left text-xs">
              <thead className="border-b text-[11px]" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                <tr>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Producto</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Precio</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                {loadingProducts ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      Cargando catálogo desde MongoDB...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">
                      No hay productos registrados en esta categoría.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id || p.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0 shadow"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=150&q=80'; }}
                          />
                          <div className="max-w-xs">
                            <span className="font-bold text-[color:var(--text-main)] block truncate text-sm">{p.title}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">{p.description}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {p.category}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 font-black text-orange-400 text-sm">
                        {p.priceFormatted || `$${p.price?.toLocaleString()} COP`}
                      </td>

                      <td className="px-3 py-2.5 text-slate-300 font-bold">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs">
                          {p.stock || 10} unid.
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-bold text-xs transition-colors cursor-pointer"
                          title="Editar información de este producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar Producto</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" style={{ background: 'rgba(4,2,16,0.85)', backdropFilter: 'blur(16px)' }}>
          <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 border shadow-2xl animate-fadeInScale" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderColor: 'var(--border-glass)' }}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">Ficha de Cliente</span>
                <h3 className="text-xl font-black text-[color:var(--text-main)]">{selectedUser.nombre} {selectedUser.apellido}</h3>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded-full text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Documento</span>
                <span className="font-bold text-white">{selectedUser.tipoDocumento || 'CC'}: {selectedUser.numeroDocumento}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Correo</span>
                <span className="font-bold text-white">{selectedUser.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Teléfono</span>
                <span className="font-bold text-white">{selectedUser.telefono}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Dirección de Entrega</span>
                <span className="font-bold text-white">{selectedUser.direccion}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end" style={{ borderColor: 'var(--border-glass)' }}>
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Product */}
      <ModalCrearProducto
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onProductSaved={() => {
          fetchProducts();
          showToast(
            editingProduct
              ? '¡Producto actualizado exitosamente en el catálogo!'
              : '¡Producto publicado con éxito en la tienda y guardado en MongoDB!'
          );
        }}
      />
    </div>
  );
}
