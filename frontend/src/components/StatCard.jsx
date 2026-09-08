import React from 'react';

/**
 * StatCard — KPI card compacta y consistente.
 * Usa la clase .kpi-card del Design System CSS.
 * Props:
 *   icon       (LucideIcon)  — ícono del KPI
 *   iconColor  (string)      — color del ícono (hex/tailwind)
 *   iconBg     (string)      — background del contenedor del ícono
 *   label      (string)      — etiqueta descriptiva (ej: "Total Usuarios")
 *   value      (string|num)  — valor principal
 *   valueColor (string)      — clase de color del valor (opcional)
 *   sublabel   (string)      — texto secundario pequeño
 *   sublabelColor (string)   — clase de color del sublabel (opcional)
 */
export default function StatCard({
  icon: Icon,
  iconColor = 'text-purple-400',
  iconBg = 'rgba(91,33,182,0.12)',
  label,
  value,
  valueColor = '',
  sublabel,
  sublabelColor = 'text-slate-400',
}) {
  return (
    <div className="kpi-card">
      {/* Icon container */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {Icon && <Icon className={`w-4.5 h-4.5 ${iconColor}`} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--text-muted)] truncate">
          {label}
        </p>
        <p className={`text-2xl font-black leading-tight text-[color:var(--text-main)] ${valueColor}`}>
          {value}
        </p>
        {sublabel && (
          <p className={`text-[10px] font-semibold mt-0.5 truncate ${sublabelColor}`}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
