import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Menu, X, User, UserPlus, ChevronDown, LogOut,
  Cpu, Shirt, Refrigerator, Footprints, ArrowRight, Settings,
  ShieldAlert, Briefcase, Smartphone, Bike, Heart, Bell, Search,
  Zap, Grid3x3, Package, CreditCard, HelpCircle
} from 'lucide-react';
import logoImg from '../Images/MegaPunto.png';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const DEPTS = [
  { label: 'Celulares',         sub: 'Smartphones · 5G · Accesorios',    icon: Smartphone,   clr: '#38bdf8' },
  { label: 'Motos',             sub: 'Deportivas · Urbanas · Repuestos', icon: Bike,         clr: '#f97316' },
  { label: 'Electrodomésticos', sub: 'Neveras · Estufas · Lavadoras',    icon: Refrigerator, clr: '#a78bfa' },
  { label: 'Tecnología',        sub: 'Laptops · Computadores · Gaming',  icon: Cpu,          clr: '#34d399' },
  { label: 'Moda y Ropa',       sub: 'Prendas de última temporada',      icon: Shirt,        clr: '#fb7185' },
  { label: 'Calzado',           sub: 'Tenis deportivos · Botas',         icon: Footprints,   clr: '#fbbf24' },
];

const NAV_LINKS = [
  { to: '/',          label: 'Inicio',     end: true },
  { to: '/productos', label: 'Categorías'             },
  { to: '/productos', label: 'Ofertas'                },
  { to: '/servicios', label: 'Soporte'                },
];

const formatCOP = (n) => `$${Number(n).toLocaleString('es-CO')}`;

export default function Header({ onOpenLogin, onOpenRegister }) {
  const { currentUser, logout, isAdmin, isEmpleado } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catalogOpen,  setCatalogOpen]  = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const catalogRef = useRef(null);
  const userRef    = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setCatalogOpen(false);
      if (userRef.current    && !userRef.current.contains(e.target))    setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const avatarGradient = isAdmin
    ? 'linear-gradient(135deg,#7c3aed,#ec4899)'
    : isEmpleado
    ? 'linear-gradient(135deg,#0284c7,#38bdf8)'
    : 'linear-gradient(135deg,#ea580c,#f97316)';

  const avatarLetter = currentUser?.nombre
    ? currentUser.nombre.charAt(0).toUpperCase()
    : (currentUser?.email?.charAt(0).toUpperCase() || 'U');

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/60' : ''}`}>

      {/* TOP INFO STRIP */}
      <div style={{ background: 'linear-gradient(90deg,#3b0764 0%,#6d28d9 50%,#4c1d95 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-9 flex items-center justify-between text-[11px] font-semibold text-white">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500 text-white shrink-0">NUEVO</span>
            <span className="text-white/90 hidden sm:block">Envíos gratis en compras superiores a $150.000 COP · Financiación hasta 36 cuotas sin intereses</span>
            <span className="text-white/90 sm:hidden text-[10px]">Envíos gratis +$150k</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/70 shrink-0">
            <Link to="/contacto" className="hover:text-white transition-colors">Rastrear Pedido</Link>
            <span className="text-white/20">|</span>
            <span className="hover:text-white transition-colors cursor-pointer">Mis Puntos</span>
            <span className="text-white/20">|</span>
            <span className="text-orange-300 font-bold">ES · COP</span>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div style={{ background: '#0b0f19', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-[68px] gap-5">

            <Link to="/" className="shrink-0 group" aria-label="MEGAPUNTO inicio">
              <img src={logoImg} alt="MEGAPUNTO" className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-lg" />
            </Link>

            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full rounded-xl overflow-hidden transition-all duration-200" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                <input type="text" placeholder="Buscar productos, marcas, categorías..." className="flex-1 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none bg-transparent" />
                <button className="px-5 py-2.5 font-bold text-sm text-white hover:brightness-110 shrink-0" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>Buscar</button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">

              <button className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer hidden sm:flex border border-transparent hover:border-white/10">
                <Heart className="w-5 h-5" />
              </button>

              <button className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer hidden sm:flex border border-transparent hover:border-white/10">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full ring-1 ring-[#0b0f19]" />
              </button>

              <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/10 hover:border-orange-500/40 bg-white/5 hover:bg-white/8 text-white transition-all cursor-pointer group" title="Ver carrito">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="text-[9px] text-white/40 block font-semibold">Mi Carrito</span>
                  <span className="text-xs font-black text-orange-400">{formatCOP(0)}</span>
                </div>
              </button>

              {currentUser ? (
                <div ref={userRef} className="relative">
                  <button onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl cursor-pointer transition-all duration-200 border hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] select-none group"
                    style={{ background: '#6d28d9', borderColor: userMenuOpen ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.12)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-md shrink-0 transition-transform group-hover:scale-105" style={{ background: avatarGradient }}>
                      {avatarLetter}
                    </div>
                    <div className="hidden sm:block text-left leading-tight">
                      <span className="text-[9px] font-bold text-purple-200 block">Hola, {currentUser.nombre?.split(' ')[0] || 'Usuario'}</span>
                      <span className="text-xs font-black text-white block">Mi cuenta</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-purple-300 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden animate-fadeInScale z-50 border" style={{ background: '#0b0f19', borderColor: 'rgba(255,255,255,0.12)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)' }}>
                      <div className="p-5 border-b border-white/8" style={{ background: 'linear-gradient(135deg,rgba(109,40,217,0.3) 0%,rgba(11,15,25,1) 100%)' }}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg shrink-0" style={{ background: avatarGradient }}>{avatarLetter}</div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-white truncate">{currentUser.nombre} {currentUser.apellido || ''}</p>
                            <p className="text-[10px] text-white/40 truncate mt-0.5">{currentUser.email}</p>
                            <div className="mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full w-fit text-[9px] font-extrabold uppercase border border-purple-500/40 bg-purple-500/15 text-purple-300">
                              <ShieldAlert className="w-2.5 h-2.5" />{currentUser.rol}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ label: 'Pedidos', value: '0' }, { label: 'Garantías', value: '0' }, { label: 'Puntos', value: '0' }].map(s => (
                            <div key={s.label} className="rounded-xl py-2.5 text-center border border-white/5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                              <span className="block text-sm font-black text-white">{s.value}</span>
                              <span className="block text-[9px] text-white/40 font-semibold">{s.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        {[
                          { to: '/perfil',   icon: User,       label: 'Mi Perfil',       sub: 'Datos personales',          accent: '' },
                          { to: '/cliente',  icon: Package,    label: 'Mis Pedidos',      sub: 'Historial de compras',      accent: '' },
                          ...(isAdmin    ? [{ to: '/admin',    icon: ShieldAlert, label: 'Panel Admin',    sub: 'Gestión total del sistema', accent: 'purple' }] : []),
                          ...(isEmpleado ? [{ to: '/empleado', icon: Briefcase,   label: 'Panel Empleado', sub: 'Catálogo y clientes',       accent: 'sky' }] : []),
                          { to: '/contacto', icon: CreditCard, label: 'Métodos de Pago', sub: 'PSE · Nequi · Bancolombia', accent: '' },
                          { to: '/contacto', icon: Settings,   label: 'Configuración',   sub: 'Preferencias de cuenta',    accent: '' },
                          { to: '/contacto', icon: HelpCircle, label: 'Ayuda & Soporte', sub: 'Centro de atención',        accent: '' },
                        ].map(item => {
                          const isPurple = item.accent === 'purple';
                          const isSky    = item.accent === 'sky';
                          return (
                            <Link key={item.label} to={item.to} onClick={() => setUserMenuOpen(false)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group ${isPurple ? 'text-purple-300 hover:bg-purple-500/15' : isSky ? 'text-sky-300 hover:bg-sky-500/15' : 'text-slate-200 hover:text-white hover:bg-white/8'}`}>
                              <div className={`p-1.5 rounded-lg shrink-0 ${isPurple ? 'bg-purple-500/20 text-purple-400' : isSky ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 group-hover:bg-white/10 text-white/50 group-hover:text-white/80'} transition-colors`}>
                                <item.icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <span className="block truncate">{item.label}</span>
                                <span className={`text-[10px] font-normal block ${isPurple ? 'text-purple-400/60' : isSky ? 'text-sky-400/60' : 'text-white/30'}`}>{item.sub}</span>
                              </div>
                            </Link>
                          );
                        })}
                        <div className="pt-1 mt-1 border-t border-white/8">
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-all cursor-pointer group text-left">
                            <div className="p-1.5 rounded-lg bg-rose-500/15 group-hover:bg-rose-500/25 text-rose-400 shrink-0"><LogOut className="w-3.5 h-3.5" /></div>
                            <div><span className="block">Cerrar Sesión</span><span className="text-[10px] font-normal text-rose-400/60">Salir de tu cuenta</span></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={onOpenLogin} className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-white/10 hover:border-purple-400/40 text-white/90 hover:text-white hover:bg-white/5 cursor-pointer transition-all">Ingresar</button>
                  <button onClick={onOpenRegister} className="px-4 py-1.5 text-xs font-extrabold text-white rounded-xl cursor-pointer transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}>Registro</button>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 cursor-pointer border border-white/10" aria-label="Menu">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className="hidden md:block" style={{ background: '#080c14', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-12 gap-2">

            <div ref={catalogRef} className="relative shrink-0">
              <button onClick={() => setCatalogOpen(v => !v)} onMouseEnter={() => setCatalogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white cursor-pointer transition-all select-none"
                style={{ background: catalogOpen ? '#7c3aed' : '#6d28d9', boxShadow: catalogOpen ? '0 4px 16px rgba(124,58,237,0.4)' : 'none' }}>
                <Grid3x3 className="w-4 h-4" />
                Todas las Categorías
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${catalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {catalogOpen && (
                <div onMouseLeave={() => setCatalogOpen(false)} className="absolute top-[calc(100%+4px)] left-0 w-[420px] rounded-2xl overflow-hidden animate-fadeInDown z-50 border shadow-2xl" style={{ background: '#0b0f19', borderColor: 'rgba(255,255,255,0.12)' }}>
                  <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(234,88,12,0.08) 100%)' }}>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-orange-500">Departamentos</p>
                    <p className="text-[13px] font-bold mt-0.5 text-white">Explora todo el catálogo</p>
                  </div>
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {DEPTS.map(({ label, sub, icon: Icon, clr }) => (
                      <Link key={label} to="/productos" onClick={() => setCatalogOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all group hover:bg-white/5">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: `${clr}15`, border: `1px solid ${clr}30` }}>
                          <Icon className="w-4 h-4" style={{ color: clr }} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-bold text-white/95 group-hover:text-white truncate">{label}</span>
                          <span className="block text-[10px] text-white/50 group-hover:text-white/70 truncate">{sub}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 pt-1 border-t border-white/5">
                    <Link to="/productos" onClick={() => setCatalogOpen(false)} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-[13px] text-white btn-glow-orange">
                      <ShoppingBag className="w-4 h-4" />Ver todo el catálogo
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

            <nav className="flex items-center gap-0.5">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink key={label} to={to} end={end}
                  className={({ isActive }) => `px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-orange-400 bg-orange-500/10' : 'text-white/90 hover:text-orange-400 hover:bg-white/5'}`}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex-1" />

            <Link to="/productos" className="flex items-center gap-2 px-4 py-2 rounded-lg font-extrabold text-sm text-white hover:scale-[1.03] hover:brightness-110 shrink-0" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)', boxShadow: '0 3px 14px rgba(249,115,22,0.4)' }}>
              <Zap className="w-4 h-4" />Ofertas Flash
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden animate-fadeInDown" style={{ background: '#0b0f19', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-4 pt-4">
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              <input type="text" placeholder="Buscar productos..." className="flex-1 px-4 py-2.5 text-sm bg-white/5 text-white placeholder:text-white/30 outline-none" />
              <button className="px-4 py-2.5 text-white" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}><Search className="w-4 h-4" /></button>
            </div>
          </div>
          <nav className="px-4 py-3 space-y-1">
            {[{ to: '/', label: 'Inicio', end: true }, { to: '/productos', label: 'Categorías' }, { to: '/productos', label: 'Ofertas' }, { to: '/quienes_s', label: 'Nosotros' }, { to: '/contacto', label: 'Soporte' }].map(({ to, label, end }) => (
              <NavLink key={label} to={to} end={end} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold ${isActive ? 'text-orange-400 bg-orange-500/10' : 'text-white/90 hover:text-white hover:bg-white/5'}`}>
                {label}<ArrowRight className="w-4 h-4 opacity-40" />
              </NavLink>
            ))}
            {isAdmin && <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20">👑 Panel Administrador<ArrowRight className="w-4 h-4 opacity-70" /></NavLink>}
            {isEmpleado && <NavLink to="/empleado" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20">💼 Panel Empleado<ArrowRight className="w-4 h-4 opacity-70" /></NavLink>}
          </nav>
          {!currentUser ? (
            <div className="px-4 pb-4 pt-3 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => { setMobileOpen(false); onOpenLogin(); }} className="w-full py-3 rounded-xl text-sm font-bold text-white/90 flex items-center justify-center gap-2 bg-white/5 border border-white/10 cursor-pointer"><User className="w-4 h-4" />Iniciar Sesión</button>
              <button onClick={() => { setMobileOpen(false); onOpenRegister(); }} className="w-full py-3 rounded-xl text-sm font-extrabold text-white flex items-center justify-center gap-2 cursor-pointer" style={{ background: 'linear-gradient(135deg,#ea580c,#f97316)' }}><UserPlus className="w-4 h-4" />Crear una cuenta</button>
            </div>
          ) : (
            <div className="px-4 pb-4 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-semibold text-orange-400 px-1">Bienvenido, <strong className="text-white">{currentUser.nombre || currentUser.email}</strong></div>
              <Link to="/perfil" onClick={() => setMobileOpen(false)} className="w-full py-2.5 rounded-xl text-sm font-bold text-white/90 bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 cursor-pointer"><User className="w-4 h-4 text-orange-400" />Mi Perfil</Link>
              <button onClick={handleLogout} className="w-full py-2.5 rounded-xl text-sm font-bold text-rose-400 bg-rose-500/10 flex items-center justify-center gap-2 cursor-pointer"><LogOut className="w-4 h-4" />Cerrar Sesión</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
