import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import Input from './Input.jsx';
import Button from './Button.jsx';
import logoImg from '../Images/MegaPunto.png';

export default function RecuperarContrasena({ onReturnToLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (val) => {
    if (!val.trim()) {
      setError('El correo electrónico es obligatorio.');
      return false;
    } else if (!val.includes('@')) {
      setError('El correo debe contener el símbolo @.');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError('Formato de correo electrónico no válido.');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (error) {
      validateEmail(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <div 
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        
        {/* Header Branding */}
        <div 
          className="p-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, var(--bg-grad-radial-2) 100%)' }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--mp-glow-orange) 0%, transparent 70%)', filter: 'blur(20px)' }} />
          <div className="flex justify-center mb-3 relative z-10">
            <div 
              className="p-2.5 rounded-2xl"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            >
              <img src={logoImg} alt="MEGAPUNTO" className="h-10 w-auto object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-[color:var(--text-main)] flex items-center justify-center gap-2 relative z-10">
            <KeyRound className="w-5 h-5 text-orange-500" />
            Recuperar Contraseña
          </h2>
          <p className="text-xs text-orange-500 font-bold uppercase tracking-widest mt-1 relative z-10">
            Te enviaremos las instrucciones para restablecer tu contraseña
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
              >
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-[color:var(--text-main)]">¡Correo de Recuperación Enviado!</h3>
              <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
                Hemos enviado un enlace seguro a <strong className="text-orange-500">{email}</strong>. Revisa tu bandeja de entrada o carpeta de correo no deseado.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                    if (onReturnToLogin) onReturnToLogin();
                  }}
                >
                  Regresar al Inicio de Sesión
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              <p className="text-xs text-[color:var(--text-muted)]">
                Ingresa el correo electrónico asociado a tu cuenta MEGAPUNTO y te enviaremos un enlace de recuperación.
              </p>

              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                icon={Mail}
                error={error}
                required
              />

              <Button
                type="submit"
                variant="orange"
                fullWidth
                size="lg"
                loading={isSubmitting}
              >
                Recuperar Contraseña
              </Button>

              <div className="pt-4 border-t border-[color:var(--border-glass)] flex items-center justify-between">
                {onReturnToLogin && (
                  <button
                    type="button"
                    onClick={onReturnToLogin}
                    className="text-xs font-bold text-purple-500 hover:text-purple-400 transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar al Inicio de Sesión
                  </button>
                )}

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-slate-500 hover:text-slate-300 transition"
                  >
                    Cerrar ventana
                  </button>
                )}
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
