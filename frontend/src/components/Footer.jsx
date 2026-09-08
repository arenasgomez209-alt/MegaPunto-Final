import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Send,
  CheckCircle,
} from 'lucide-react';
import logoImg from '../Images/MegaPunto.png';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer
      className="relative z-10 border-t mt-12 text-xs transition-colors duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-glass)',
        color: 'var(--text-muted)'
      }}
    >
      {/* Top Value Propositions Strip (Compact) */}
      <div className="border-b" style={{ borderColor: 'var(--border-glass)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[13px] text-[color:var(--text-main)]">Envíos a Todo el País</h4>
                <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">Gratis desde $150.000 COP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[13px] text-[color:var(--text-main)]">Garantía Directa</h4>
                <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">1 a 2 años oficiales</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[13px] text-[color:var(--text-main)]">Pagos 100% Seguros</h4>
                <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">PSE, Bancolombia, Nequi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-[13px] text-[color:var(--text-main)]">Devoluciones Fáciles</h4>
                <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">Hasta 30 días</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="inline-block mb-1">
              <img src={logoImg} alt="MEGAPUNTO" className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-[11px] text-[color:var(--text-muted)] leading-relaxed max-w-sm">
              Almacenes MEGAPUNTO es tu tienda multidepartamento preferida en Colombia. Ofrecemos la mejor selección de tecnología, celulares, motocicletas, electrodomésticos y moda con respaldo garantizado.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Centro Comercial Almacenes, Medellín, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Línea Nacional: +57 304 640 8290</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>contacto@megapunto.com.co</span>
              </div>
            </div>
          </div>

          {/* Column 2: Departamentos */}
          <div className="space-y-2.5">
            <h4 className="font-black text-[13px] text-[color:var(--text-main)] uppercase tracking-wider">
              Departamentos
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/productos" className="hover:text-orange-400 transition-colors">Celulares & Smartphones</Link></li>
              <li><Link to="/productos" className="hover:text-orange-400 transition-colors">Motocicletas & Repuestos</Link></li>
              <li><Link to="/productos" className="hover:text-orange-400 transition-colors">Electrodomésticos</Link></li>
              <li><Link to="/productos" className="hover:text-orange-400 transition-colors">Computadores & Laptops</Link></li>
              <li><Link to="/productos" className="hover:text-orange-400 transition-colors">Moda & Calzado</Link></li>
            </ul>
          </div>

          {/* Column 3: Empresa & Soporte */}
          <div className="space-y-2.5">
            <h4 className="font-black text-[13px] text-[color:var(--text-main)] uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/quienes_s" className="hover:text-orange-400 transition-colors">Quiénes Somos</Link></li>
              <li><Link to="/contacto" className="hover:text-orange-400 transition-colors">Centro de Ayuda</Link></li>
              <li><Link to="/contacto" className="hover:text-orange-400 transition-colors">Garantías y Devoluciones</Link></li>
              <li><Link to="/perfil" className="hover:text-orange-400 transition-colors">Mi Cuenta de Usuario</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-2.5">
            <h4 className="font-black text-[13px] text-[color:var(--text-main)] uppercase tracking-wider">
              Boletín
            </h4>
            <p className="text-[11px] text-[color:var(--text-muted)] leading-relaxed">
              Recibe promociones exclusivas.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>¡Suscrito con éxito!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-1.5">
                <input
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-[11px] rounded-lg outline-none transition-colors"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    color: 'var(--text-main)'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--border-glass-hover)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-input)'}
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-lg text-[11px] font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges Bar */}
      <div className="border-t py-4" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} <strong>Almacenes MEGAPUNTO S.A.S.</strong> Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">PSE</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Bancolombia</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Visa</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Mastercard</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Nequi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
