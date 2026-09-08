import React from 'react';

/**
 * PageHeader — encabezado de página interna compacto y consistente.
 * Reemplaza el patrón repetido de badge + h1 + descripción + acciones.
 * Props:
 *   badge       (string|node) — texto del chip identificador
 *   badgeVariant ('purple'|'orange'|'emerald'|'sky') — color del chip
 *   title       (string)      — título principal h1
 *   description (string)      — subtítulo/descripción
 *   actions     (node[])      — array de botones/acciones a la derecha
 *   icon        (LucideIcon)  — ícono junto al badge (opcional)
 *   className   (string)      — clases adicionales
 */
export default function PageHeader({
  badge,
  badgeVariant = 'purple',
  title,
  description,
  actions,
  icon: Icon,
  className = '',
}) {
  const badgeColors = {
    purple:  { bg: 'rgba(91,33,182,0.18)',  text: '#a78bfa', border: 'rgba(91,33,182,0.35)' },
    orange:  { bg: 'rgba(249,115,22,0.18)', text: '#fb923c', border: 'rgba(249,115,22,0.35)' },
    emerald: { bg: 'rgba(52,211,153,0.15)', text: '#34d399', border: 'rgba(52,211,153,0.3)' },
    sky:     { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  };
  const bc = badgeColors[badgeVariant] || badgeColors.purple;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${className}`}
      style={{ borderColor: 'var(--border-glass)' }}
    >
      {/* Left: badge + title + description */}
      <div className="space-y-0.5 min-w-0">
        {badge && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border mb-1"
            style={{ background: bc.bg, color: bc.text, borderColor: bc.border }}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {badge}
          </div>
        )}
        {title && (
          <h1 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] tracking-tight leading-tight truncate">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-xs text-[color:var(--text-muted)] leading-relaxed line-clamp-1">
            {description}
          </p>
        )}
      </div>

      {/* Right: actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {Array.isArray(actions) ? actions.map((action, i) => (
            <React.Fragment key={i}>{action}</React.Fragment>
          )) : actions}
        </div>
      )}
    </div>
  );
}
