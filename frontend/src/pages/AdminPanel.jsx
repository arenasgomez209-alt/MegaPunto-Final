import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Briefcase,
  UserPlus,
  Shield,
  Layers,
  ArrowUpRight,
  DollarSign,
  Boxes,
  Eye
} from 'lucide-react';
import { usersAPI, productsAPI } from '../services/api.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import ModalCrearProducto from '../components/ModalCrearProducto.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Toast from '../components/Toast.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' | 'productos' | 'resumen'
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // User filters & search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Todos');
  const [userStatusFilter, setUserStatusFilter] = useState('Todos');

  // Product filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Todos');

  // Modals & form state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const [userFormData, setUserFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    rol: 'Cliente',
    estado: 'Activo'
  });

  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    const res = await usersAPI.getAll({
      search: userSearch,
      rol: userRoleFilter,
      estado: userStatusFilter
    });
    setLoadingUsers(false);
    if (res.ok && res.data.success) {
      setUsers(res.data.users);
    }
  };

  // Fetch products
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
  }, [userRoleFilter, userStatusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [productCategoryFilter]);

  // Toggle user status
  const handleToggleUserStatus = async (user) => {
    const res = await usersAPI.toggleStatus(user._id);
    if (res.ok && res.data.success) {
      showToast(`Estado de ${user.nombre} cambiado a ${res.data.user.estado}`);
      fetchUsers();
    } else {
      showToast(res.data?.message || 'Error al cambiar estado', 'error');
    }
  };

  // Delete user
  const handleDeleteUser = async (user) => {
    if (window.confirm(`¿Estás seguro de eliminar permanentemente al usuario ${user.nombre} ${user.apellido}?`)) {
      const res = await usersAPI.delete(user._id);
      if (res.ok && res.data.success) {
        showToast('Usuario eliminado exitosamente.');
        fetchUsers();
      } else {
        showToast(res.data?.message || 'No se pudo eliminar el usuario', 'error');
      }
    }
  };

  // Delete product
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${product.title}"?`)) {
      const res = await productsAPI.delete(product._id);
      if (res.ok && res.data.success) {
        showToast('Producto eliminado del catálogo.');
        fetchProducts();
      } else {
        showToast(res.data?.message || 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  // Open modal to create or edit user
  const handleOpenUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        nombre: user.nombre,
        apellido: user.apellido,
        tipoDocumento: user.tipoDocumento || 'CC',
        numeroDocumento: user.numeroDocumento,
        direccion: user.direccion,
        telefono: user.telefono,
        email: user.email,
        password: '',
        rol: user.rol,
        estado: user.estado
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        nombre: '',
        apellido: '',
        tipoDocumento: 'CC',
        numeroDocumento: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        rol: 'Cliente',
        estado: 'Activo'
      });
    }
    setIsUserModalOpen(true);
  };

  // Save user (Create / Update)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (editingUser) {
      const res = await usersAPI.update(editingUser._id, userFormData);
      if (res.ok && res.data.success) {
        showToast('Usuario actualizado correctamente en MongoDB.');
        setIsUserModalOpen(false);
        fetchUsers();
      } else {
        showToast(res.data?.message || 'Error al actualizar usuario', 'error');
      }
    } else {
      const res = await usersAPI.create(userFormData);
      if (res.ok && res.data.success) {
        showToast('Nuevo usuario creado exitosamente.');
        setIsUserModalOpen(false);
        fetchUsers();
      } else {
        showToast(res.data?.message || 'Error al crear usuario', 'error');
      }
    }
  };

  // Quick switch role
  const handleQuickRoleChange = async (user, newRole) => {
    if (user.email === 'arenasgomez209@gmail.com' && newRole !== 'Administrador') {
      showToast('No es posible degradar el rol del Administrador principal.', 'error');
      return;
    }
    const res = await usersAPI.update(user._id, { rol: newRole });
    if (res.ok && res.data.success) {
      showToast(`Rol de ${user.nombre} actualizado a: ${newRole}`);
      fetchUsers();
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.estado === 'Activo').length;
  const totalEmployees = users.filter(u => u.rol === 'Empleado').length;
  const totalAdmins = users.filter(u => u.rol === 'Administrador').length;
  const totalProducts = products.length;

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
        title="Consola de Administración"
        description="Gestión completa de usuarios, roles, catálogo en tiempo real y persistencia MongoDB."
        badgeText="Panel Master MEGAPUNTO"
        badgeIcon={ShieldCheck}
        badgeColor="purple"
        actions={
          <>
            <button
              onClick={() => { fetchUsers(); fetchProducts(); }}
              className="p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer shadow-sm bg-white/5 border-white/10"
              title="Refrescar datos"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
            </button>
            <Button variant="orange" size="md" icon={UserPlus} onClick={() => handleOpenUserModal()}>
              Nuevo Usuario
            </Button>
            <Button variant="primary" size="md" icon={Plus} onClick={() => setIsProductModalOpen(true)}>
              Nuevo Producto
            </Button>
          </>
        }
      />

      {/* Modern Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          iconColor="text-purple-400"
          iconBg="rgba(168, 85, 247, 0.15)"
          label="Total Usuarios"
          value={totalUsers}
          sublabel="Registrados en MongoDB"
          sublabelColor="text-emerald-400"
        />
        <StatCard
          icon={UserCheck}
          iconColor="text-emerald-400"
          iconBg="rgba(52, 211, 153, 0.15)"
          label="Usuarios Activos"
          value={activeUsers}
          valueColor="text-emerald-400"
          sublabel="Cuentas con acceso"
        />
        <StatCard
          icon={Briefcase}
          iconColor="text-sky-400"
          iconBg="rgba(56, 189, 248, 0.15)"
          label="Empleados"
          value={totalEmployees}
          valueColor="text-sky-400"
          sublabel="Gestores inventario"
        />
        <StatCard
          icon={Boxes}
          iconColor="text-orange-400"
          iconBg="rgba(249, 115, 22, 0.15)"
          label="Total en Catálogo"
          value={totalProducts}
          valueColor="text-orange-400"
          sublabel="Productos publicados"
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-3 border-b pb-1" style={{ borderColor: 'var(--border-glass)' }}>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'usuarios'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          Gestión de Usuarios ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('productos')}
          className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'productos'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          Gestión de Catálogo ({products.length})
        </button>
      </div>

      {/* TAB 1: GESTIÓN DE USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6 animate-fadeInUp">
          {/* User Controls & Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo o documento..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl outline-none"
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                />
              </div>
              <button
                onClick={fetchUsers}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-purple-600 text-white cursor-pointer hover:bg-purple-700 shadow"
              >
                Buscar
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="p-2.5 text-xs font-semibold rounded-xl outline-none cursor-pointer"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
              >
                <option value="Todos" style={{ background: '#0f0a28', color: '#fff' }}>Todos los Roles</option>
                <option value="Administrador" style={{ background: '#0f0a28', color: '#fff' }}>Administradores</option>
                <option value="Empleado" style={{ background: '#0f0a28', color: '#fff' }}>Empleados</option>
                <option value="Cliente" style={{ background: '#0f0a28', color: '#fff' }}>Clientes</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="p-2.5 text-xs font-semibold rounded-xl outline-none cursor-pointer"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
              >
                <option value="Todos" style={{ background: '#0f0a28', color: '#fff' }}>Todos los Estados</option>
                <option value="Activo" style={{ background: '#0f0a28', color: '#fff' }}>Solo Activos</option>
                <option value="Inactivo" style={{ background: '#0f0a28', color: '#fff' }}>Solo Inactivos</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-3xl border shadow-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <table className="w-full text-left text-xs">
              <thead className="border-b text-[11px]" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                <tr>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Documento</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Contacto & Dirección</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Rol de Acceso</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Cargando usuarios desde MongoDB...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No se encontraron usuarios registrados con estos filtros.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow"
                            style={{
                              background:
                                u.rol === 'Administrador'
                                  ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                                  : u.rol === 'Empleado'
                                  ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                                  : 'linear-gradient(135deg, #ea580c, #f97316)'
                            }}
                          >
                            {u.nombre ? u.nombre.charAt(0).toUpperCase() : 'U'}
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
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400">
                          <Phone className="w-3 h-3" />
                          <span>{u.telefono}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[170px] mt-0.5" title={u.direccion}>
                          {u.direccion}
                        </div>
                      </td>

                      <td className="px-3 py-2.5">
                        {/* Quick Role Switcher */}
                        <select
                          value={u.rol}
                          onChange={(e) => handleQuickRoleChange(u, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wide cursor-pointer outline-none transition-all ${
                            u.rol === 'Administrador'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.rol === 'Empleado'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}
                        >
                          <option value="Administrador" style={{ background: '#0f0a28', color: '#fff' }}>👑 Administrador</option>
                          <option value="Empleado" style={{ background: '#0f0a28', color: '#fff' }}>💼 Empleado</option>
                          <option value="Cliente" style={{ background: '#0f0a28', color: '#fff' }}>👤 Cliente</option>
                        </select>
                      </td>

                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
                            u.estado === 'Activo'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                          }`}
                          title="Alternar estado Activo / Inactivo"
                        >
                          {u.estado === 'Activo' ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
                          {u.estado}
                        </button>
                      </td>

                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenUserModal(u)}
                            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {u.email !== 'arenasgomez209@gmail.com' && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DE PRODUCTOS */}
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
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider">Creador</th>
                  <th className="px-3 py-2.5 font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-glass)' }}>
                {loadingProducts ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      Cargando catálogo desde MongoDB...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No hay productos registrados en esta categoría.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.04] transition-colors">
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

                      <td className="px-3 py-2.5 text-slate-400 text-[11px]">
                        {p.creadoPor || 'Sistema'}
                      </td>

                      <td className="px-3 py-2.5 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Editar producto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal: Create or Edit User */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" style={{ background: 'rgba(4,2,16,0.88)', backdropFilter: 'blur(20px)' }}>
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border shadow-2xl animate-fadeInScale" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="mb-6 border-b pb-4" style={{ borderColor: 'var(--border-glass)' }}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">Control de Acceso</span>
              <h3 className="text-2xl font-black text-[color:var(--text-main)] mt-0.5">
                {editingUser ? 'Modificar Usuario en MongoDB' : 'Registrar Nuevo Usuario'}
              </h3>
              <p className="text-xs text-[color:var(--text-muted)] mt-1">Configura los datos del usuario, contraseña y permisos de rol.</p>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={userFormData.nombre}
                  onChange={(e) => setUserFormData({ ...userFormData, nombre: e.target.value })}
                  required
                />
                <Input
                  label="Apellido"
                  value={userFormData.apellido}
                  onChange={(e) => setUserFormData({ ...userFormData, apellido: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">Tipo de Documento</label>
                  <select
                    value={userFormData.tipoDocumento}
                    onChange={(e) => setUserFormData({ ...userFormData, tipoDocumento: e.target.value })}
                    className="w-full p-3 rounded-xl text-xs font-semibold outline-none"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                  >
                    <option value="CC" style={{ background: '#0f0a28', color: '#fff' }}>Cédula de Ciudadanía (CC)</option>
                    <option value="CE" style={{ background: '#0f0a28', color: '#fff' }}>Cédula de Extranjería (CE)</option>
                    <option value="PAS" style={{ background: '#0f0a28', color: '#fff' }}>Pasaporte (PAS)</option>
                    <option value="NIT" style={{ background: '#0f0a28', color: '#fff' }}>NIT Empresa</option>
                  </select>
                </div>

                <Input
                  label="Número de Documento"
                  value={userFormData.numeroDocumento}
                  onChange={(e) => setUserFormData({ ...userFormData, numeroDocumento: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  value={userFormData.telefono}
                  onChange={(e) => setUserFormData({ ...userFormData, telefono: e.target.value })}
                  required
                />
                <Input
                  label="Dirección"
                  value={userFormData.direccion}
                  onChange={(e) => setUserFormData({ ...userFormData, direccion: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Correo Electrónico"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                required
              />

              <Input
                label={editingUser ? "Nueva Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                type="password"
                placeholder={editingUser ? "••••••••" : "Mínimo 4 caracteres"}
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                required={!editingUser}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">Rol del Usuario</label>
                  <select
                    value={userFormData.rol}
                    onChange={(e) => setUserFormData({ ...userFormData, rol: e.target.value })}
                    className="w-full p-3 rounded-xl text-xs font-semibold outline-none"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                  >
                    <option value="Cliente" style={{ background: '#0f0a28', color: '#fff' }}>Cliente (Usuario Estándar)</option>
                    <option value="Empleado" style={{ background: '#0f0a28', color: '#fff' }}>Empleado (Gestor de Productos)</option>
                    <option value="Administrador" style={{ background: '#0f0a28', color: '#fff' }}>Administrador (Control Total)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">Estado Inicial</label>
                  <select
                    value={userFormData.estado}
                    onChange={(e) => setUserFormData({ ...userFormData, estado: e.target.value })}
                    className="w-full p-3 rounded-xl text-xs font-semibold outline-none"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-main)' }}
                  >
                    <option value="Activo" style={{ background: '#0f0a28', color: '#fff' }}>Activo</option>
                    <option value="Inactivo" style={{ background: '#0f0a28', color: '#fff' }}>Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-glass)' }}>
                <Button variant="ghost" type="button" onClick={() => setIsUserModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </Button>
              </div>
            </form>
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
          showToast(
            editingProduct
              ? '¡Producto actualizado exitosamente!'
              : '¡Producto añadido al catálogo con éxito!'
          );
          fetchProducts();
        }}
      />
    </div>
  );
}
