import React, { useState } from 'react';
import { 
  X, 
  User, 
  FileText, 
  Hash, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle, 
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import Input from './Input.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';
import logoImg from '../Images/MegaPunto.png';
import { useAuth } from '../context/AuthContext.jsx';

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PAS', label: 'Pasaporte (PAS)' },
  { value: 'NIT', label: 'NIT Empresa / Persona Jurídica' }
];

export default function Modalregistrar({ isOpen, onClose, onRegisterSuccess }) {
  const { register } = useAuth();

  const initialForm = {
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateField = (name, value, allValues = formData) => {
    let errorMsg = '';
    const val = typeof value === 'string' ? value.trim() : (value || '');

    switch (name) {
      case 'nombre':
        if (!val) {
          errorMsg = 'El nombre es requerido.';
        } else if (val.length < 3) {
          errorMsg = 'El nombre debe tener mínimo 3 letras.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
          errorMsg = 'El nombre solo debe contener letras.';
        }
        break;

      case 'apellido':
        if (!val) {
          errorMsg = 'El apellido es requerido.';
        } else if (val.length < 3) {
          errorMsg = 'El apellido debe tener mínimo 3 letras.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) {
          errorMsg = 'El apellido solo debe contener letras.';
        }
        break;

      case 'tipoDocumento':
        if (!val) {
          errorMsg = 'Seleccione un tipo de documento.';
        }
        break;

      case 'numeroDocumento':
        if (!val) {
          errorMsg = 'El número de documento es requerido.';
        } else if (!/^\d+$/.test(val)) {
          errorMsg = 'El documento solo permite números.';
        } else if (val.length < 5 || val.length > 12) {
          errorMsg = 'El documento debe tener entre 5 y 12 dígitos numéricos.';
        }
        break;

      case 'direccion':
        if (!val) {
          errorMsg = 'La dirección de residencia es requerida.';
        } else if (val.length < 4) {
          errorMsg = 'Escriba una dirección válida (mínimo 4 caracteres).';
        }
        break;

      case 'telefono':
        if (!val) {
          errorMsg = 'El número de teléfono es requerido.';
        } else if (!/^\d+$/.test(val)) {
          errorMsg = 'El teléfono solo permite números.';
        } else if (val.length < 7 || val.length > 10) {
          errorMsg = 'El teléfono debe tener entre 7 y 10 dígitos.';
        }
        break;

      case 'email':
        if (!val) {
          errorMsg = 'El correo electrónico es requerido.';
        } else if (!val.includes('@')) {
          errorMsg = 'El correo debe incluir el símbolo @ (ej: usuario@correo.com).';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errorMsg = 'Formato de correo no válido (ej: cliente@correo.com).';
        }
        break;

      case 'password':
        if (!value) {
          errorMsg = 'La contraseña es requerida.';
        } else if (value.length < 4) {
          errorMsg = 'La contraseña debe contener mínimo 4 caracteres.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errorMsg = 'Debe confirmar su contraseña.';
        } else if (value !== allValues.password) {
          errorMsg = 'Las contraseñas no coinciden.';
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));

    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar longitud máxima mientras escribe
    if (name === 'numeroDocumento' && value.length > 12) return;
    if (name === 'telefono' && value.length > 10) return;

    const nextForm = { ...formData, [name]: value };
    setFormData(nextForm);
    setServerError('');
    validateField(name, value, nextForm);
  };

  const validateAll = () => {
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const fieldValid = validateField(key, formData[key], formData);
      if (!fieldValid) isValid = false;
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (validateAll()) {
      setIsSubmitting(true);
      const res = await register({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        password: formData.password,
        rol: 'Cliente'
      });
      setIsSubmitting(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(res.user);
          }
          onClose();
        }, 1200);
      } else {
        setServerError(res.message);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      style={{ background: 'rgba(4,2,16,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 animate-fadeInScale border shadow-2xl custom-scrollbar"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: 'var(--shadow-card)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="mb-6 text-center">
          <img src={logoImg} alt="MEGAPUNTO" className="h-10 w-auto mx-auto mb-2 object-contain" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
            Registro de Clientes
          </span>
          <h2 className="text-2xl font-black text-[color:var(--text-main)] mt-0.5 tracking-tight">
            Crea tu Cuenta en MEGAPUNTO
          </h2>
          <p className="text-xs text-[color:var(--text-muted)] mt-1.5 max-w-md mx-auto">
            Completa tus datos personales para acceder a compras, seguimiento de pedidos y promociones.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium leading-tight">{serverError}</span>
          </div>
        )}

        {success ? (
          <div className="py-10 text-center space-y-4 animate-fadeInScale">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-[color:var(--text-main)]">¡Registro Exitoso en MongoDB!</h3>
            <p className="text-xs text-slate-400">
              Tu cuenta ha sido creada y sincronizada en MongoDB Atlas. Iniciando sesión automáticamente...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre (mínimo 3 letras)"
                name="nombre"
                placeholder="Ej: Juan"
                icon={User}
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />
              <Input
                label="Apellido (mínimo 3 letras)"
                name="apellido"
                placeholder="Ej: Gómez"
                icon={User}
                value={formData.apellido}
                onChange={handleChange}
                error={errors.apellido}
              />
            </div>

            {/* Tipo de Documento y Número */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Tipo de Documento"
                name="tipoDocumento"
                options={documentTypes}
                value={formData.tipoDocumento}
                onChange={handleChange}
                error={errors.tipoDocumento}
              />
              <Input
                label="Número de Documento"
                name="numeroDocumento"
                placeholder="Ej: 1020304050"
                icon={Hash}
                value={formData.numeroDocumento}
                onChange={handleChange}
                error={errors.numeroDocumento}
              />
            </div>

            {/* Dirección y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dirección de Residencia"
                name="direccion"
                placeholder="Ej: Calle 50 # 45-20"
                icon={MapPin}
                value={formData.direccion}
                onChange={handleChange}
                error={errors.direccion}
              />
              <Input
                label="Número Telefónico"
                name="telefono"
                type="tel"
                placeholder="Ej: 3001234567"
                icon={Phone}
                value={formData.telefono}
                onChange={handleChange}
                error={errors.telefono}
              />
            </div>

            {/* Correo Electrónico */}
            <div>
              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="cliente@ejemplo.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Contraseña y Confirmación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Contraseña (mínimo 4 caracteres)"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[34px] text-slate-400 hover:text-white cursor-pointer p-1"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                icon={UserPlus}
                className="py-3 font-bold tracking-wide shadow-lg"
              >
                {isSubmitting ? 'Guardando en MongoDB Atlas...' : 'Completar Registro de Cliente'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

