import React from 'react';

/**
 * Input — campo de texto reutilizable del Design System MEGAPUNTO.
 * Props:
 *   icon    (LucideIcon) — ícono a la izquierda
 *   label   (string)     — etiqueta del campo
 *   error   (string)     — mensaje de error (muestra borde rojo)
 *   type    (string)     — tipo de input
 *   ...props             — todos los props nativos de <input>
 */
export default function Input({ icon: Icon, label, error, type = 'text', id, ...props }) {
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-700 uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors duration-200"
            style={{ color: 'var(--text-muted)' }}>
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none placeholder:opacity-40 ${error ? 'field-input error' : 'field-input'}`}
          style={{
            background: 'var(--bg-input)',
            border: error
              ? '1px solid rgba(251,113,133,0.55)'
              : '1px solid var(--border-input)',
            color: 'var(--text-main)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error
              ? 'rgba(251,113,133,0.7)'
              : 'var(--border-glass-hover)';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(251,113,133,0.12)'
              : '0 0 0 3px var(--bg-input-focus)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error
              ? 'rgba(251,113,133,0.55)'
              : 'var(--border-input)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[11px] font-600 text-rose-400">{error}</span>
      )}
    </div>
  );
}
