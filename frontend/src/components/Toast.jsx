import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast — notificación flotante reutilizable.
 * Props:
 *   msg    (string)  — mensaje a mostrar
 *   type   (string)  — 'success' | 'error' | 'info'
 *   onClose (fn)     — callback para cerrar
 *   duration (ms)    — auto-cierre (default 4000, 0 = manual)
 */
export default function Toast({ msg, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!msg || duration === 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [msg, duration, onClose]);

  if (!msg) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bg: 'rgba(16, 85, 52, 0.95)',
      border: 'rgba(52, 211, 153, 0.35)',
      text: '#34d399',
    },
    error: {
      icon: AlertTriangle,
      bg: 'rgba(76, 10, 24, 0.95)',
      border: 'rgba(251, 113, 133, 0.35)',
      text: '#fb7185',
    },
    info: {
      icon: Info,
      bg: 'rgba(8, 30, 63, 0.95)',
      border: 'rgba(56, 189, 248, 0.35)',
      text: '#38bdf8',
    },
  };

  const c = config[type] || config.success;
  const Icon = c.icon;

  return (
    <div
      className="fixed top-[4.5rem] right-4 z-[200] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold animate-slideRight max-w-xs"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(16px)',
        color: '#fff',
      }}
      role="alert"
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color: c.text }} />
      <span className="flex-1 leading-snug">{msg}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-0.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Cerrar notificación"
        >
          <X className="w-3 h-3 opacity-70" />
        </button>
      )}
    </div>
  );
}
