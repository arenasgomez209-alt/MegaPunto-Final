import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import logoImg from '../Images/MegaPunto.png';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login({ onOpenRegister, onOpenRecover, onLoginSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Validación personalizada sin usar 'required' nativo de HTML
  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'email') {
      const val = value ? value.trim() : '';
      if (!val) {
        errorMsg = 'El correo electrónico es requerido.';
      } else if (!val.includes('@')) {
        errorMsg = 'El correo debe incluir el símbolo @ (ej: usuario@correo.com).';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errorMsg = 'Formato de correo electrónico no válido.';
      }
    }

    if (name === 'password') {
      const val = value ? value.trim() : '';
      if (!val) {
        errorMsg = 'La contraseña es requerida.';
      } else if (val.length < 4) {
        errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));

    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val
    }));

    setServerError('');

    if (type !== 'checkbox') {
      validateField(name, val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);

    if (isEmailValid && isPasswordValid) {
      setIsSubmitting(true);
      const res = await login(formData.email, formData.password);
      setIsSubmitting(false);

      if (res.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(res.user);
          }
          if (res.user.rol === 'Administrador') {
            navigate('/admin');
          } else if (res.user.rol === 'Empleado') {
            navigate('/empleado');
          } else {
            navigate('/');
          }
        }, 800);
      } else {
        setServerError(res.message);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 animate-fadeIn my-6 sm:my-10">
      <div
        className="rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Header Branding con espaciado balanceado */}
        <div
          className="p-7 sm:p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, var(--bg-grad-radial-2) 100%)' }}
        >
          <div className="flex justify-center mb-3 relative z-10">
            <img src={logoImg} alt="MEGAPUNTO" className="h-11 w-auto object-contain drop-shadow" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[color:var(--text-main)] relative z-10">
            Ingreso a tu Cuenta
          </h2>
          <p className="text-xs text-[color:var(--text-muted)] mt-1.5 max-w-xs mx-auto relative z-10 leading-relaxed">
            Accede a tu cuenta de MEGAPUNTO para comprar o administrar el sistema
          </p>
        </div>

        {/* Mensaje de error del servidor */}
        {serverError && (
          <div className="mx-6 sm:mx-8 mt-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-medium leading-tight">{serverError}</span>
          </div>
        )}

        {loginSuccess ? (
          <div className="p-8 sm:p-10 text-center space-y-4 animate-fadeInScale">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[color:var(--text-main)]">¡Bienvenido a MEGAPUNTO!</h3>
            <p className="text-xs text-slate-400">Autenticación exitosa. Conectado a MongoDB Atlas...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-5">
            <div>
              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <div className="relative">
              <Input
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[34px] text-slate-400 hover:text-white cursor-pointer transition-colors p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Recordarme y Recuperar Contraseña */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded accent-orange-500 w-3.5 h-3.5"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={onOpenRecover}
                className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón de Enviar */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="orange"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                icon={LogIn}
                className="py-3 font-bold tracking-wide shadow-lg"
              >
                {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>

            {/* Enlace a Registro */}
            <div className="pt-5 text-center border-t border-white/5">
              <p className="text-xs text-slate-400">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="font-bold text-orange-400 hover:text-orange-300 cursor-pointer underline ml-1 transition-colors"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}



