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
  Store,
  Sparkles,
  Lock
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
    <footer className="relative z-10 border-t border-white/10 text-slate-300 text-xs transition-colors duration-300" style={{ background: '#0b0f19' }}>
      
      {/* Main Footer Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img src={logoImg} alt="MEGAPUNTO" className="h-9 w-auto object-contain brightness-110" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Almacenes MEGAPUNTO es tu tienda multidepartamento líder en Colombia. Compra electrodomésticos, motocicletas, tecnología y moda con garantía oficial, financiación y envíos nacionales asegurados.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Centro Comercial Almacenes, Medellín, Colombia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Línea Nacional WhatsApp: +57 304 640 8290</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>contacto@megapunto.com.co</span>
              </div>
            </div>
          </div>

          {/* Column 2: Departamentos */}
          <div className="space-y-3">
            <h4 className="font-black text-xs text-white uppercase tracking-wider">
              Departamentos
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/productos" className="text-slate-400 hover:text-orange-400 transition-colors">Celulares & Smartphones</Link></li>
              <li><Link to="/productos" className="text-slate-400 hover:text-orange-400 transition-colors">Motocicletas & Repuestos</Link></li>
              <li><Link to="/productos" className="text-slate-400 hover:text-orange-400 transition-colors">Electrodomésticos Hogar</Link></li>
              <li><Link to="/productos" className="text-slate-400 hover:text-orange-400 transition-colors">Computadores & Gaming</Link></li>
              <li><Link to="/productos" className="text-slate-400 hover:text-orange-400 transition-colors">Moda & Calzado</Link></li>
            </ul>
          </div>

          {/* Column 3: Empresa & Soporte */}
          <div className="space-y-3">
            <h4 className="font-black text-xs text-white uppercase tracking-wider">
              Empresa & Ayuda
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/quienes_s" className="text-slate-400 hover:text-purple-400 transition-colors">Quiénes Somos</Link></li>
              <li><Link to="/servicios" className="text-slate-400 hover:text-purple-400 transition-colors">Servicios y Respaldo</Link></li>
              <li><Link to="/contacto" className="text-slate-400 hover:text-purple-400 transition-colors">Radicar PQR / Soporte</Link></li>
              <li><Link to="/contacto" className="text-slate-400 hover:text-purple-400 transition-colors">Garantías y Devoluciones</Link></li>
              <li><Link to="/perfil" className="text-slate-400 hover:text-purple-400 transition-colors">Mi Cuenta de Usuario</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-black text-xs text-white uppercase tracking-wider">
              Boletín de Ofertas
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Suscríbete para recibir cupones exclusivos y promociones flash antes que nadie.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>¡Te has suscrito con éxito!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Suscribirme Ahora
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Legal & Payment Badges Bar */}
      <div className="border-t border-white/5 bg-black/40 py-5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} <strong>Almacenes MEGAPUNTO S.A.S.</strong> NIT: 900.542.118-4 · Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-slate-300">
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">PSE</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Bancolombia</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Nequi</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Daviplata</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Visa</span>
            <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
