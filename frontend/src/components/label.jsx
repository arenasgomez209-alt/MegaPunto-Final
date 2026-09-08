import React from 'react';

export default function Label({ htmlFor, children, required = false, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-slate-800 mb-1 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
