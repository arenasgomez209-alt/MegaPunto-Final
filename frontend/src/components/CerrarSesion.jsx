import React from 'react';
import { LogOut, User, ShieldCheck } from 'lucide-react';
import Button from './Button.jsx';

export default function CerrarSesion({ user, onLogout, onClose }) {
  if (!user) return null;

  return (
    <div 
      className="rounded-2xl p-5 space-y-4 max-w-sm w-full"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-center gap-3 pb-3 border-b border-[color:var(--border-glass)]">
        <div 
          className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center shadow-md"
          style={{ background: 'var(--mp-purple-dark)' }}
        >
          {user.email ? user.email.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-[color:var(--text-main)] truncate">Cliente MEGAPUNTO</h4>
          <p className="text-xs text-[color:var(--text-muted)] font-medium truncate">{user.email}</p>
          <span 
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1"
            style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}
          >
            <ShieldCheck className="w-3 h-3" /> Sesión Activa
          </span>
        </div>
      </div>

      <p className="text-xs text-[color:var(--text-muted)]">
        Estás conectado a la plataforma de Almacenes MEGAPUNTO.
      </p>

      <div className="flex items-center gap-2 pt-2">
        {onClose && (
          <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          fullWidth
          icon={LogOut}
          onClick={onLogout}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
