import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  User,
  UserPlus,
  ChevronDown,
  LogOut,
  MapPin,
  Phone,
  Cpu,
  Shirt,
  Car,
  Tv,
  Refrigerator,
  Footprints,
  ArrowRight,
  Settings,
  Sun,
  Moon,
  ShieldAlert,
  Briefcase,
  Smartphone,
  Bike
} from 'lucide-react';
import logoImg from '../Images/MegaPunto.png';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Badge from './Badge.jsx';

/* ── Department catalog data ─────────────────────── */
const DEPTS = [
  { label: 'Celulares',         sub: 'Smartphones · 5G · Accesorios',    icon: Smartphone,   clr: '#38bdf8' },
  { label: 'Motos',             sub: 'Deportivas · Urbanas · Repuestos', icon: Bike,         clr: '#f97316' },
  { label: 'Electrodomésticos', sub: 'Neveras · Estufas · Lavadoras',    icon: Refrigerator, clr: '#a78bfa' },
  { label: 'Tecnología',        sub: 'Laptops · Computadores · Gaming',  icon: Cpu,          clr: '#34d399' },
  { label: 'Moda y Ropa',       sub: 'Prendas de última temporada',      icon: Shirt,        clr: '#fb7185' },
  { label: 'Calzado',           sub: 'Tenis deportivos · Botas',         icon: Footprints,   clr: '#fbbf24' },
];

export default function Header({ onOpenLogin, onOpenRegister, isDarkMode, toggleTheme }) {
  const { currentUser, logout, isAdmin, isEmpleado } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catalogOpen,  setCatalogOpen]  = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const catalogRef = useRef(null);
  const userRef    = useRef(null);

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const fn = (e) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setCatalogOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target))    setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => window.removeEventListener('mousedown', fn);
  }, []);

  const linkCls = ({ isActive }) =>
    `relative px-3.5 py-1.5 text-sm font-semibold tracking-wide rounded-lg transition-colors duration-200 select-none ${
      isActive ? 'bg-white/10 text-white' : 'opacity-80 hover:opacity-100 hover:bg-white/5'
    }`;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{
        background: scrolled ? 'var(--bg-card)' : 'var(--bg-main)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-glass)',
      }}
    >
      {/* ── Top info strip (Compact) ──────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(90deg, var(--bg-grad-radial-1) 0%, var(--bg-grad-radial-2) 100%)',
          borderBottom: '1px solid var(--border-glass)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-7 flex items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-4 opacity-85">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
              Medellín, Colombia
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-orange-400 shrink-0" />
              3046408290
            </span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span className="text-orange-400 hidden sm:block">Envío gratis nacional desde $150.000</span>
            <Link to="/contacto" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
              Soporte & Garantías
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main bar ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[64px] gap-4">

          {/* Logo */}
          <Link to="/" className="shrink-0 group relative mr-2" aria-label="MEGAPUNTO inicio">
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--mp-glow-purple)', filter: 'blur(12px)' }}
            />
            <img
              src={logoImg}
              alt="MEGAPUNTO"
              className="relative h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* ── Desktop nav ─── */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkCls}>Inicio</NavLink>
            <NavLink to="/productos" className={linkCls}>Productos</NavLink>
            <NavLink to="/servicios" className={linkCls}>Servicios</NavLink>

            {/* Catalog dropdown */}
            <div ref={catalogRef} className="relative">
              <button
                onClick={() => setCatalogOpen(v => !v)}
                onMouseEnter={() => setCatalogOpen(true)}
                className={`flex items-center gap-1 px-3.5 py-1.5 text-sm font-semibold tracking-wide rounded-lg transition-colors duration-200 cursor-pointer select-none ${
                  catalogOpen ? 'bg-white/10 text-white' : 'opacity-80 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                Categorías
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catalogOpen ? 'rotate-180 text-orange-500' : 'opacity-60'}`} />
              </button>

              {/* MEGA DROPDOWN (Compact Grid) */}
              {catalogOpen && (
                <div
                  onMouseLeave={() => setCatalogOpen(false)}
                  className="absolute top-[calc(100%+8px)] left-0 w-[420px] rounded-2xl overflow-hidden animate-fadeInDown z-50 glass-card"
                >
                  <div className="px-4 py-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, var(--bg-grad-radial-2) 100%)' }}>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-orange-500">Departamentos</p>
                    <p className="text-[13px] font-bold mt-0.5">Explora todo el catálogo</p>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {DEPTS.map(({ label, sub, icon: Icon, clr }) => (
                      <Link
                        key={label}
                        to="/productos"
                        onClick={() => setCatalogOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group hover:bg-white/5"
                      >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ background: `${clr}15`, border: `1px solid ${clr}30` }}>
                          <Icon className="w-4 h-4" style={{ color: clr }} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-bold opacity-90 group-hover:opacity-100 transition-colors truncate">{label}</span>
                          <span className="block text-[10px] opacity-60 truncate">{sub}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 pt-1 border-t border-white/5">
                    <Link
                      to="/productos"
                      onClick={() => setCatalogOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-[13px] text-white btn-glow-orange"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Ver todo el catálogo
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/quienes_s" className={linkCls}>Nosotros</NavLink>
            <NavLink to="/contacto"  className={linkCls}>Contacto</NavLink>
          </nav>

          {/* ── Right controls ─── */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg opacity-80 hover:opacity-100 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
              style={{ background: 'var(--bg-input)' }}
              title={isDarkMode ? "Modo claro" : "Modo oscuro"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg opacity-80 hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105 border border-transparent hover:border-white/10"
              style={{ background: 'var(--bg-input)' }}
              title="Ver carrito"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg btn-glow-orange">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Auth area: Unified User Profile Dropdown Button */}
            {currentUser ? (
              <div ref={userRef} className="relative">
                {/* Unified Profile Trigger: Photo/Initial + Name/Greeting + Chevron */}
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl font-semibold text-xs cursor-pointer transition-all duration-200 text-white border border-white/10 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)] select-none group"
                  style={{ background: 'var(--bg-card)' }}
                  title="Abrir menú de usuario"
                >
                  {/* Photo / Avatar */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md transition-transform duration-200 group-hover:scale-105 shrink-0"
                    style={{
                      background: isAdmin
                        ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                        : isEmpleado
                        ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                        : 'linear-gradient(135deg, #ea580c, #f97316)'
                    }}
                  >
                    {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : (currentUser.email?.charAt(0).toUpperCase() || 'U')}
                  </div>

                  {/* Name and Greeting */}
                  <div className="text-left leading-tight hidden sm:block">
                    <span className="text-[10px] font-bold text-orange-400 block tracking-wide">
                      Bienvenido,
                    </span>
                    <span className="text-xs font-black text-white block max-w-[120px] truncate">
                      {currentUser.nombre || currentUser.email.split('@')[0]}
                    </span>
                  </div>

                  {/* Dropdown Chevron Arrow */}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 group-hover:text-white ${
                      userMenuOpen ? 'rotate-180 text-orange-400' : ''
                    }`}
                  />
                </button>

                {/* Submenu Dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden animate-fadeInScale z-50 shadow-2xl border"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-card)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    {/* User Card Header */}
                    <div className="p-4 border-b bg-white/[0.03]" style={{ borderColor: 'var(--border-glass)' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow shrink-0"
                          style={{
                            background: isAdmin
                              ? 'linear-gradient(135deg, #7c3aed, #ec4899)'
                              : isEmpleado
                              ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                              : 'linear-gradient(135deg, #ea580c, #f97316)'
                          }}
                        >
                          {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : (currentUser.email?.charAt(0).toUpperCase() || 'U')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-white truncate">
                            {currentUser.nombre} {currentUser.apellido || ''}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                          <div className="mt-1">
                            <Badge variant={isAdmin ? 'admin' : isEmpleado ? 'empleado' : 'cliente'} className="text-[9px] px-2 py-0.5">
                              {currentUser.rol}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      {/* Mi Perfil */}
                      <Link
                        to="/perfil"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer group"
                      >
                        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500/20 text-slate-400 group-hover:text-orange-400 transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block">Mi Perfil</span>
                          <span className="text-[10px] text-slate-400 font-normal block">Gestiona tus datos personales</span>
                        </div>
                      </Link>

                      {/* Panel Administrador (si aplica) */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-500/15 rounded-xl transition-all cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="block">Panel de Administrador</span>
                            <span className="text-[10px] text-purple-300/70 font-normal block">Control total del sistema</span>
                          </div>
                        </Link>
                      )}

                      {/* Panel Empleado (si aplica) */}
                      {isEmpleado && (
                        <Link
                          to="/empleado"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/15 rounded-xl transition-all cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="block">Panel de Empleado</span>
                            <span className="text-[10px] text-sky-300/70 font-normal block">Clientes y catálogo</span>
                          </div>
                        </Link>
                      )}

                      {/* Mis Pedidos (clientes) */}
                      {!isAdmin && !isEmpleado && (
                        <Link
                          to="/cliente"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 rounded-xl transition-all cursor-pointer group"
                        >
                          <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 transition-colors">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="block">Mis Pedidos</span>
                            <span className="text-[10px] text-slate-400 font-normal block">Historial de compras</span>
                          </div>
                        </Link>
                      )}

                      {/* Cerrar Sesión */}
                      <div className="pt-1 border-t" style={{ borderColor: 'var(--border-glass)' }}>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer group text-left"
                        >
                          <div className="p-1.5 rounded-lg bg-rose-500/15 group-hover:bg-rose-500 text-rose-400 group-hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <span className="block">Cerrar Sesión</span>
                            <span className="text-[10px] text-rose-400/70 font-normal block">Salir de tu cuenta</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button onClick={onOpenLogin} className="px-3.5 py-1.5 text-xs font-bold opacity-85 hover:opacity-100 rounded-lg transition-all border border-white/10 hover:bg-white/5 cursor-pointer">
                  Ingresar
                </button>
                <button onClick={onOpenRegister} className="px-4 py-1.5 text-xs font-extrabold text-white rounded-lg cursor-pointer btn-glow-orange">
                  Registro
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg opacity-80 hover:opacity-100 transition-all border border-transparent hover:border-white/10 cursor-pointer"
              style={{ background: 'var(--bg-input)' }}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fadeInDown"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(24px)',
            borderTop: '1px solid var(--border-card)',
          }}
        >
          <nav className="px-4 py-3 space-y-1">
            {[
              { to: '/',          label: 'Inicio',        end: true },
              { to: '/productos', label: 'Productos'              },
              { to: '/servicios', label: 'Servicios'              },
              { to: '/quienes_s', label: 'Quiénes Somos'          },
              { to: '/contacto',  label: 'Contacto & Soporte'     },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'opacity-100 text-orange-400 font-bold bg-white/5' : 'opacity-80 hover:opacity-100'
                  }`
                }
              >
                {label}
                <ArrowRight className="w-4 h-4 opacity-40" />
              </NavLink>
            ))}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20"
              >
                👑 Panel Administrador
                <ArrowRight className="w-4 h-4 opacity-70" />
              </NavLink>
            )}

            {isEmpleado && (
              <NavLink
                to="/empleado"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20"
              >
                💼 Panel Empleado
                <ArrowRight className="w-4 h-4 opacity-70" />
              </NavLink>
            )}
          </nav>

          {!currentUser ? (
            <div className="px-4 pb-4 pt-3 flex flex-col gap-2.5" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <button
                onClick={() => { setMobileOpen(false); onOpenLogin(); }}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <User className="w-4 h-4" />
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setMobileOpen(false); onOpenRegister(); }}
                className="w-full py-3 rounded-xl text-sm font-extrabold text-white flex items-center justify-center gap-2 btn-glow-orange"
              >
                <UserPlus className="w-4 h-4" />
                Crear una cuenta
              </button>
            </div>
          ) : (
            <div className="px-4 pb-4 pt-3 space-y-2" style={{ borderTop: '1px solid var(--border-glass)' }}>
              <div className="text-xs font-semibold text-orange-400 px-1">
                Bienvenido, <strong className="text-white">{currentUser.nombre || currentUser.email}</strong>
              </div>
              <Link
                to="/perfil"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-slate-200 bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-orange-400" />
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}

    </header>
  );
}
