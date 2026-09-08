import React from 'react';
import { User, Mail, Phone, MapPin, Shield, ShoppingBag, Heart, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function ClientePanel() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-2xl border relative overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}>
              {currentUser?.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge color="orange">Panel de Cliente</Badge>
                <Badge color={currentUser?.estado === 'Inactivo' ? 'rose' : 'emerald'}>
                  {currentUser?.estado || 'Activo'}
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] mt-1">
                Bienvenido, {currentUser?.nombre} {currentUser?.apellido}
              </h1>
              <p className="text-xs text-[color:var(--text-muted)]">Cliente registrado en MEGAPUNTO Colombia</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link to="/perfil">
              <Button variant="ghost" size="sm" icon={User}>
                Editar Perfil
              </Button>
            </Link>
            <Link to="/productos">
              <Button variant="orange" size="sm" icon={ShoppingBag}>
                Ir de Compras
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Personal Details */}
        <div className="p-5 rounded-2xl border space-y-4 md:col-span-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Datos de la Cuenta
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Documento de Identidad</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">
                {currentUser?.tipoDocumento || 'CC'}: {currentUser?.numeroDocumento || 'No especificado'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Correo Electrónico</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Teléfono de Contacto</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.telefono || 'No registrado'}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Dirección de Entrega</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.direccion || 'Medellín, Colombia'}</span>
            </div>
          </div>
        </div>

        {/* Orders & Activity Simulator */}
        <div className="p-5 rounded-2xl border space-y-4 md:col-span-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Tus Compras y Pedidos Recientes
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Entregado
                </span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-1.5">
                  Pedido #MP-98421 - Celular Smartphone & Accesorio
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Realizado hace 3 días · Envío Gratis
                </p>
              </div>
              <div className="text-right sm:self-center">
                <span className="text-sm font-black text-orange-400 block">$1.290.000 COP</span>
                <span className="text-[10px] text-slate-500">1 Producto</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
              <div>
                <span className="text-[10px] font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                  En Preparación
                </span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] mt-1.5">
                  Pedido #MP-99104 - Electrodoméstico Hogar
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> En camino a tu dirección
                </p>
              </div>
              <div className="text-right sm:self-center">
                <span className="text-sm font-black text-orange-400 block">$2.850.000 COP</span>
                <span className="text-[10px] text-slate-500">1 Producto</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-glass)' }}>
            <span className="text-xs text-slate-400">¿Necesitas soporte con tus garantías o envíos?</span>
            <Link to="/contacto" className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
              Contactar Soporte <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
