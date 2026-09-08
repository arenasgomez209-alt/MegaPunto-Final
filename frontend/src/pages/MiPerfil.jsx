import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Save,
  KeyRound,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';
import Badge from '../components/Badge.jsx';

export default function MiPerfil() {
  const { currentUser, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nombre: currentUser.nombre || '',
        apellido: currentUser.apellido || '',
        email: currentUser.email || '',
        telefono: currentUser.telefono || '',
        direccion: currentUser.direccion || '',
        tipoDocumento: currentUser.tipoDocumento || 'CC',
        numeroDocumento: currentUser.numeroDocumento || ''
      }));
    }
  }, [currentUser]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword) {
      if (formData.newPassword.length < 4) {
        showToast('La nueva contraseña debe tener al menos 4 caracteres.', 'error');
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        showToast('Las contraseñas no coinciden.', 'error');
        return;
      }
    }

    setLoading(true);
    const res = await updateUserProfile({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      tipoDocumento: formData.tipoDocumento,
      numeroDocumento: formData.numeroDocumento,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
    setLoading(false);

    if (res.success) {
      showToast(res.message || '¡Datos de tu cuenta actualizados con éxito!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } else {
      showToast(res.message, 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[color:var(--text-main)]">Debes iniciar sesión</h2>
        <p className="text-xs text-slate-400">Por favor inicia sesión para gestionar tu cuenta.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <Toast
          message={notification.msg}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header Profile Badge */}
      <div
        className="p-5 sm:p-6 rounded-2xl border relative overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl"
              style={{
                background:
                  currentUser.rol === 'Administrador'
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : currentUser.rol === 'Empleado'
                    ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
                    : 'linear-gradient(135deg, #ea580c, #f97316)'
              }}
            >
              {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  color={currentUser.rol === 'Administrador' ? 'purple' : currentUser.rol === 'Empleado' ? 'sky' : 'orange'}
                  icon={Shield}
                >
                  {currentUser.rol}
                </Badge>
                <Badge color={currentUser.estado === 'Inactivo' ? 'rose' : 'emerald'}>
                  {currentUser.estado || 'Activo'}
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] mt-1">
                {currentUser.nombre} {currentUser.apellido}
              </h1>
              <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details Section */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div className="border-b pb-3" style={{ borderColor: 'var(--border-glass)' }}>
            <h2 className="text-base font-black text-[color:var(--text-main)] flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" /> Información Personal
            </h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Actualiza tus datos de contacto y facturación en MEGAPUNTO.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              icon={User}
              required
            />
            <Input
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              icon={User}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                Tipo de Documento
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full p-3 rounded-xl text-xs font-semibold outline-none transition-all cursor-pointer"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="CC" style={{ background: '#0f0a28', color: '#fff' }}>Cédula de Ciudadanía (CC)</option>
                <option value="CE" style={{ background: '#0f0a28', color: '#fff' }}>Cédula de Extranjería (CE)</option>
                <option value="PAS" style={{ background: '#0f0a28', color: '#fff' }}>Pasaporte (PAS)</option>
                <option value="NIT" style={{ background: '#0f0a28', color: '#fff' }}>NIT Empresa</option>
              </select>
            </div>

            <Input
              label="Número de Documento"
              name="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              icon={FileText}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />
            <Input
              label="Teléfono / WhatsApp"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              icon={Phone}
              required
            />
          </div>

          <Input
            label="Dirección de Residencia / Entrega"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            icon={MapPin}
            required
          />
        </div>

        {/* Security & Password Section */}
        <div
          className="p-5 sm:p-6 rounded-2xl border space-y-4"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div className="border-b pb-3" style={{ borderColor: 'var(--border-glass)' }}>
            <h2 className="text-base font-black text-[color:var(--text-main)] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-400" /> Seguridad y Cambio de Contraseña
            </h2>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Deja estos campos en blanco si no deseas cambiar tu contraseña actual.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Contraseña Actual (opcional)"
                name="currentPassword"
                type={showCurrentPass ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña actual"
                icon={Lock}
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-[38px] text-slate-400 hover:text-white cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Nueva Contraseña"
                  name="newPassword"
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Mínimo 4 caracteres"
                  icon={Lock}
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-[38px] text-slate-400 hover:text-white cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirmar Nueva Contraseña"
                name="confirmNewPassword"
                type={showNewPass ? 'text' : 'password'}
                placeholder="Repite la nueva contraseña"
                icon={Lock}
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="orange"
            size="lg"
            disabled={loading}
            icon={Save}
          >
            {loading ? 'Guardando Cambios...' : 'Guardar Todos los Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
