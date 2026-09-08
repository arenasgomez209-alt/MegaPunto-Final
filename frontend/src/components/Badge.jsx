import React from 'react';

/**
 * Badge — sistema de badges consistente para roles, estados y categorías.
 * Usa las clases .badge + .badge-{variant} del Design System CSS.
 */
const VARIANTS = {
  purple:  'badge-purple',
  orange:  'badge-orange',
  emerald: 'badge-emerald',
  sky:     'badge-sky',
  rose:    'badge-rose',
  amber:   'badge-amber',
  slate:   'badge-slate',
  // aliases semánticos
  admin:    'badge-purple',
  empleado: 'badge-sky',
  cliente:  'badge-orange',
  activo:   'badge-emerald',
  inactivo: 'badge-rose',
  nuevo:    'badge-sky',
  respondido: 'badge-emerald',
  cerrado:  'badge-slate',
};

export default function Badge({ children, variant = 'slate', icon: Icon, className = '' }) {
  const cls = VARIANTS[variant?.toLowerCase()] || VARIANTS[variant] || 'badge-slate';
  return (
    <span className={`badge ${cls} ${className}`}>
      {Icon && <Icon className="w-2.5 h-2.5 shrink-0" />}
      {children}
    </span>
  );
}

/**
 * Helper: get badge variant from rol string
 */
export function rolBadgeVariant(rol) {
  switch (rol) {
    case 'Administrador': return 'admin';
    case 'Empleado':      return 'empleado';
    case 'Cliente':       return 'cliente';
    default:              return 'slate';
  }
}

/**
 * Helper: get badge variant from estado string
 */
export function estadoBadgeVariant(estado) {
  switch (estado) {
    case 'Activo':    return 'activo';
    case 'Inactivo':  return 'inactivo';
    default:          return 'slate';
  }
}
