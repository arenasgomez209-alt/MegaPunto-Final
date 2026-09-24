import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, CreditCard, Lock, Save, UserPlus, MapPin } from 'lucide-react';

/**
 * ModalGestionUsuario — React Portal
 * Props:
 *  - isOpen      : boolean
 *  - onClose     : () => void
 *  - onSave      : (formData) => void  — recibe el payload del formulario
 *  - editingUser : object | null       — null = crear, object = editar
 *  - saving      : boolean
 */
export default function ModalGestionUsuario({ isOpen, onClose, onSave, editingUser, saving }) {

  const empty = {
    nombre: '', apellido: '', email: '',
    telefono: '', tipoDocumento: 'CC',
    numeroDocumento: '', password: '',
    direccion: ''
  };

  const [form, setForm] = useState(empty);

  // Pre-rellenar al editar
  useEffect(() => {
    if (editingUser) {
      setForm({
        nombre:          editingUser.nombre          || '',
        apellido:        editingUser.apellido         || '',
        email:           editingUser.email            || '',
        telefono:        editingUser.telefono         || '',
        tipoDocumento:   editingUser.tipoDocumento    || 'CC',
        numeroDocumento: editingUser.numeroDocumento  || '',
        password:        '',
        direccion:       editingUser.direccion        || '',
      });
    } else {
      setForm(empty);
    }
  }, [editingUser, isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const isEdit = !!editingUser;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form });
  };

  /* ── Colores de la marca ─────────────────────── */
  const C = {
    orange:       '#f97316',
    orangeDark:   '#ea580c',
    purple:       '#7c3aed',
    purpleDark:   '#6d28d9',
    navy:         '#0b0f19',
    navyCard:     '#111827',
    border:       'rgba(255,255,255,0.09)',
    borderAccent: 'rgba(124,58,237,0.35)',
    labelClr:     '#f97316',   // naranja para labels
    sublabel:     '#a78bfa',   // lavanda suave
    inputBg:      '#1a2035',
    inputBorder:  'rgba(255,255,255,0.1)',
    inputFocus:   '#7c3aed',
    placeholder:  'rgba(255,255,255,0.25)',
    textMain:     '#ffffff',
    textSub:      'rgba(255,255,255,0.55)',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.6rem 0.875rem',
    fontSize: '0.8125rem',
    fontWeight: 500,
    borderRadius: '0.625rem',
    outline: 'none',
    background: C.inputBg,
    border: `1.5px solid ${C.inputBorder}`,
    color: C.textMain,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const handleFocus  = (e) => { e.target.style.borderColor = C.inputFocus; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.2)'; };
  const handleBlur   = (e) => { e.target.style.borderColor = C.inputBorder; e.target.style.boxShadow = 'none'; };

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-usuario-title"
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fadeInScale"
          style={{
            background: C.navy,
            border: `1px solid ${C.borderAccent}`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px ${C.borderAccent}, 0 0 40px rgba(124,58,237,0.12)`,
          }}
        >
          {/* ── Header — gradiente naranja + púrpura del logo ── */}
          <div
            style={{
              background: `linear-gradient(135deg, ${C.orangeDark} 0%, ${C.orange} 40%, ${C.purpleDark} 100%)`,
              borderBottom: `1px solid rgba(255,255,255,0.1)`,
              padding: '1.25rem 1.5rem',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Ícono */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                  {isEdit
                    ? <User size={20} color="#fff" />
                    : <UserPlus size={20} color="#fff" />}
                </div>
                <div>
                  <h2 id="modal-usuario-title" style={{ color: '#fff', fontWeight: 900, fontSize: '1rem', margin: 0 }}>
                    {isEdit ? `Editar ${editingUser.rol || 'Usuario'}` : 'Crear Nuevo Empleado'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', margin: 0, marginTop: 2 }}>
                    {isEdit
                      ? `Modificando datos de ${editingUser.nombre} ${editingUser.apellido || ''}`
                      : 'Completa el formulario para registrar al nuevo empleado'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ padding: 8, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                aria-label="Cerrar"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            {/* Nombre + Apellido */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Nombre" required icon={<User size={12} />} labelClr={C.labelClr}>
                <input required minLength={3} placeholder="Ej: Juan" value={form.nombre} onChange={set('nombre')}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </Field>
              <Field label="Apellido" required icon={<User size={12} />} labelClr={C.labelClr}>
                <input required minLength={3} placeholder="Ej: Pérez" value={form.apellido} onChange={set('apellido')}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </Field>
            </div>

            {/* Email */}
            <Field label="Correo Electrónico" required icon={<Mail size={12} />} labelClr={C.labelClr}>
              <input required type="email" placeholder="empleado@megapunto.com" value={form.email} onChange={set('email')}
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>

            {/* Documento */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Tipo Documento" icon={<CreditCard size={12} />} labelClr={C.labelClr}>
                <select value={form.tipoDocumento} onChange={set('tipoDocumento')}
                  style={{ ...inputStyle, cursor: 'pointer' }} onFocus={handleFocus} onBlur={handleBlur}>
                  <option value="CC">Cédula (CC)</option>
                  <option value="CE">Cédula Extranjería</option>
                  <option value="NIT">NIT</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </Field>
              <Field label="Número Documento" required icon={<CreditCard size={12} />} labelClr={C.labelClr}>
                <input required minLength={5} placeholder="1098765432" value={form.numeroDocumento} onChange={set('numeroDocumento')}
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </Field>
            </div>

            {/* Teléfono */}
            <Field label="Teléfono / Celular" required icon={<Phone size={12} />} labelClr={C.labelClr}>
              <input required minLength={7} maxLength={15} placeholder="3001234567" value={form.telefono} onChange={set('telefono')}
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>

            {/* Dirección */}
            <Field label="Dirección" required icon={<MapPin size={12} />} labelClr={C.labelClr}>
              <input required minLength={3} placeholder="Ej: Cra 45 #10-20, Medellín" value={form.direccion} onChange={set('direccion')}
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>

            {/* Contraseña */}
            <Field
              label={isEdit ? 'Nueva Contraseña (vacío = sin cambios)' : 'Contraseña'}
              required={!isEdit}
              icon={<Lock size={12} />}
              labelClr={C.labelClr}
            >
              <input type="password"
                placeholder={isEdit ? '••••••••' : 'Mínimo 6 caracteres'}
                required={!isEdit}
                value={form.password} onChange={set('password')}
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </Field>

            {/* Divisor */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0.25rem 0' }} />

            {/* Botones */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 12, border: `1.5px solid rgba(124,58,237,0.4)`, background: 'transparent', color: '#a78bfa', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = '#c4b5fd'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a78bfa'; }}
              >
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                style={{ flex: 1, padding: '0.75rem', borderRadius: 12, border: 'none', background: saving ? '#374151' : `linear-gradient(135deg, ${C.orangeDark}, ${C.orange})`, color: '#fff', fontWeight: 800, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: saving ? 'none' : '0 4px 18px rgba(249,115,22,0.45)' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
              >
                {saving ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEdit ? 'Guardar Cambios' : 'Crear Empleado'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/* ── Helper: fila de campo ── */
function Field({ label, required, icon, labelClr, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: labelClr }}>
        {icon}
        {label}
        {required && <span style={{ color: '#f97316', marginLeft: 1 }}>*</span>}
      </label>
      {children}
    </div>
  );
}
