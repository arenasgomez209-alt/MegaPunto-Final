import React from 'react';

/**
 * Button — componente de botón reutilizable del Design System MEGAPUNTO.
 * Variantes: primary | orange | secondary | outline | ghost | danger | info | success
 * Tamaños:   xs | sm | md | lg
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconEnd: IconEnd,
  fullWidth = false,
  className = '',
  title,
}) {
  const base = 'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none whitespace-nowrap';

  const sizes = {
    xs: 'text-[11px] px-2.5 py-1 gap-1',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2',
  };

  const variants = {
    primary: {
      cls: 'text-white font-bold focus-visible:ring-purple-500',
      style: {
        background: 'linear-gradient(135deg, #4c1d95, #5b21b6, #7c3aed)',
        boxShadow: '0 3px 12px var(--mp-glow-purple)',
        border: '1px solid rgba(124,58,237,0.4)',
      },
    },
    orange: {
      cls: 'text-white font-extrabold btn-glow-orange focus-visible:ring-orange-500',
      style: {},
    },
    secondary: {
      cls: 'text-white font-extrabold btn-glow-orange focus-visible:ring-orange-500',
      style: {},
    },
    outline: {
      cls: 'font-bold hover:border-purple-500/60 focus-visible:ring-purple-500',
      style: {
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-glass-hover)',
        color: 'var(--text-main)',
      },
    },
    ghost: {
      cls: 'opacity-65 hover:opacity-100 font-semibold focus-visible:ring-slate-400',
      style: {
        background: 'transparent',
        border: '1px solid transparent',
        color: 'var(--text-main)',
      },
    },
    danger: {
      cls: 'text-white font-bold focus-visible:ring-rose-500',
      style: {
        background: 'linear-gradient(135deg, #be123c, #e11d48)',
        boxShadow: '0 3px 12px rgba(225,29,72,0.3)',
        border: '1px solid rgba(251,113,133,0.4)',
      },
    },
    info: {
      cls: 'text-white font-bold focus-visible:ring-sky-500',
      style: {
        background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
        boxShadow: '0 3px 12px rgba(14,165,233,0.3)',
        border: '1px solid rgba(56,189,248,0.4)',
      },
    },
    success: {
      cls: 'text-white font-bold focus-visible:ring-emerald-500',
      style: {
        background: 'linear-gradient(135deg, #065f46, #10b981)',
        boxShadow: '0 3px 12px rgba(16,185,129,0.3)',
        border: '1px solid rgba(52,211,153,0.4)',
      },
    },
  };

  const v = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${base} ${v.cls} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={v.style}
    >
      {loading ? (
        <svg className="animate-spin w-3.5 h-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      {children && <span>{children}</span>}
      {!loading && IconEnd && <IconEnd className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
