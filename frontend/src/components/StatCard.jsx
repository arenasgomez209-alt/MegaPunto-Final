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
  iconColor,
  iconBg,
  label,
  title,
  value,
  valueColor = 'text-slate-900',
  sublabel,
  trend,
  sublabelColor = 'text-slate-500',
  color = 'purple',
}) {
  const displayLabel = label || title;
  const displaySublabel = sublabel || trend;

  // Preset styles based on color prop
  const colorMap = {
    purple:  { bg: 'bg-purple-50 text-purple-600 border-purple-100',  icon: 'text-purple-600',  accent: '#7c3aed' },
    orange:  { bg: 'bg-orange-50 text-orange-600 border-orange-100',  icon: 'text-orange-600',  accent: '#ea580c' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'text-emerald-600', accent: '#059669' },
    blue:    { bg: 'bg-blue-50 text-blue-600 border-blue-100',      icon: 'text-blue-600',    accent: '#2563eb' },
    sky:     { bg: 'bg-sky-50 text-sky-600 border-sky-100',        icon: 'text-sky-600',     accent: '#0284c7' },
    rose:    { bg: 'bg-rose-50 text-rose-600 border-rose-100',      icon: 'text-rose-600',    accent: '#e11d48' },
  };

  const currentTheme = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex items-start gap-3.5">
      {/* Icon container */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${currentTheme.bg}`}
        style={iconBg ? { background: iconBg } : {}}
      >
        {Icon && <Icon className={`w-5 h-5 ${iconColor || currentTheme.icon} group-hover:scale-110 transition-transform`} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {displayLabel && (
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate mb-0.5">
            {displayLabel}
          </p>
        )}
        <p className={`text-xl sm:text-2xl font-black leading-tight tracking-tight ${valueColor}`}>
          {value}
        </p>
        {displaySublabel && (
          <p className={`text-[10px] font-bold mt-1 truncate ${sublabelColor}`}>
            {displaySublabel}
          </p>
        )}
      </div>
    </div>
  );
}
