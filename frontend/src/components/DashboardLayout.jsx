import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  Shield,
  Briefcase,
  ChevronRight,
  Store,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Badge from './Badge.jsx';

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  tabs = [],
  title = "Panel de Control",
  subtitle = "Gestión integral MEGAPUNTO",
  roleName = "Usuario",
  children
}) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'administrador':
        return { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', gradient: 'from-purple-600 to-indigo-600' };
      case 'empleado':
        return { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', gradient: 'from-blue-600 to-cyan-600' };
      default:
        return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-600 to-amber-600' };
    }
  };

  const roleStyle = getRoleColor(currentUser?.rol || roleName);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ────────────────── LEFT SIDEBAR ────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-100'
        }`}
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Brand / Logo Header */}
        <div className="p-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-glass)' }}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30 transition-transform group-hover:scale-105"
                 style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-[color:var(--text-main)] block leading-tight">
                MEGA<span className="text-orange-500">PUNTO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase block">
                Colombia · Quinto Avance
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Mini Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl border flex items-center gap-3 shrink-0"
             style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md bg-gradient-to-br ${roleStyle.gradient}`}>
            {currentUser?.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-[color:var(--text-main)] truncate">
              {currentUser?.nombre ? `${currentUser.nombre} ${currentUser.apellido || ''}` : 'Usuario MEGAPUNTO'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.email || 'sesion@megapunto.com'}</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                {currentUser?.rol || roleName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Módulos y Funciones
          </p>

          {tabs.map((tab) => {
            const Icon = tab.icon || Layers;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-[color:var(--text-main)] hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Bottom Actions (User Requirement) */}
        <div className="p-3 border-t space-y-1.5 shrink-0" style={{ borderColor: 'var(--border-glass)' }}>
          {/* Volver al Sitio Web */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-all group"
          >
            <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="flex-1 text-left">Volver al Sitio Web</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer group"
          >
            <LogOut className="w-4 h-4 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="flex-1 text-left">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ────────────────── MAIN CONTENT WRAPPER ────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-6 border-b flex items-center justify-between shrink-0"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-glass)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-[color:var(--text-main)] flex items-center gap-2">
                {title}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px]"
                 style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FastAPI + MongoDB Atlas En Línea</span>
            </div>

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Ver Tienda</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
