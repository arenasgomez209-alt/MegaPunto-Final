import React from 'react';

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error = '',
  required = false,
  disabled = false,
  icon: Icon,
  placeholder = 'Seleccione una opción',
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-[11px] font-700 uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          {label}
        </label>
      )}


      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 opacity-60 pointer-events-none flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full py-2.5 px-3.5 ${Icon ? 'pl-11' : 'pl-3.5'} pr-10 text-sm rounded-xl shadow-xs transition-all duration-200 outline-none appearance-none cursor-pointer
            ${error
              ? 'border-red-500/70 focus:border-red-500 bg-red-500/5'
              : ''
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            background: error ? 'rgba(239,68,68,0.06)' : 'var(--bg-input)',
            border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border-input)',
            color: 'var(--text-main)',
            ...(disabled ? { opacity: 0.6 } : {}),
          }}
          onFocus={e => {
            if (!error) {
              e.target.style.borderColor = 'var(--border-glass-hover)';
              e.target.style.boxShadow = '0 0 0 3px var(--bg-grad-radial-1)';
            }
          }}
          onBlur={e => {
            if (!error) {
              e.target.style.borderColor = 'var(--border-input)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {placeholder && (
            <option value="" disabled style={{ background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
                {labelText}
              </option>
            );
          })}
        </select>
        
        {/* Custom chevron arrow */}
        <div className="absolute right-3.5 pointer-events-none opacity-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
