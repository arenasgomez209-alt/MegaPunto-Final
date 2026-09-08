import React from 'react';
import {
  ShieldCheck,
  Award,
  Users,
  TrendingUp,
  Target,
  Eye,
  HeartHandshake,
  CheckCircle,
  Truck,
  Building,
  Sparkles,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import logoImg from '../Images/MegaPunto.png';

export default function QuienesSomos() {
  const stats = [
    { value: '+50.000', label: 'Clientes Felices en Colombia', icon: Users, clr: '#38bdf8' },
    { value: '100%', label: 'Garantía y Respaldo Oficial', icon: ShieldCheck, clr: '#34d399' },
    { value: '24/48h', label: 'Tiempos de Entrega Nacional', icon: Truck, clr: '#f97316' },
    { value: '+1.500', label: 'Artículos en Catálogo Activo', icon: ShoppingBag, clr: '#a78bfa' }
  ];

  const values = [
    {
      title: 'Compromiso y Transparencia',
      desc: 'Brindamos información clara y precisa en cada producto, precios transparentes con IVA incluido y garantías sin intermediarios.',
      icon: HeartHandshake,
      clr: '#f97316'
    },
    {
      title: 'Innovación Constante',
      desc: 'Incorporamos tecnología de punta en celulares, motocicletas de alto rendimiento y electrodomésticos inteligentes para el hogar.',
      icon: Sparkles,
      clr: '#a78bfa'
    },
    {
      title: 'Calidad Certificada',
      desc: 'Trabajamos exclusivamente con fabricantes directos y distribuidores oficiales autorizados en todo el país.',
      icon: Award,
      clr: '#34d399'
    },
    {
      title: 'Atención Personalizada',
      desc: 'Nuestro equipo de asesores y empleados acompaña a cada cliente antes, durante y después de su compra.',
      icon: Users,
      clr: '#38bdf8'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Nacimiento de MEGAPUNTO',
      desc: 'Iniciamos operaciones en Medellín con el propósito de conectar a los hogares colombianos con los mejores electrodomésticos a precios justos.'
    },
    {
      year: '2022',
      title: 'Expansión al Sector Tecnológico y Motos',
      desc: 'Ampliamos nuestro portafolio incluyendo smartphones de última generación, portátiles gamer y motocicletas urbanas y deportivas.'
    },
    {
      year: '2024',
      title: 'Consolidación Digital & Envíos Nacionales',
      desc: 'Lanzamiento de nuestra plataforma digital con cobertura en los 32 departamentos y soporte en tiempo real.'
    },
    {
      year: '2026',
      title: 'Liderazgo en Retail Omnicanal',
      desc: 'Integración tecnológica avanzada con persistencia en la nube y paneles diferenciados para atención ágil al cliente.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 shadow-sm">
          <Building className="w-3.5 h-3.5" /> Pasión por el Retail Colombiano
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[color:var(--text-main)] tracking-tight leading-tight">
          Tu Mundo, Tu Hogar y Tu Estilo en un Solo Lugar
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
          En <strong className="text-orange-400">MEGAPUNTO</strong> transformamos la experiencia de compra en Colombia combinando la cercanía del comercio tradicional con la eficiencia y seguridad del entorno digital.
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ value, label, icon: Icon, clr }) => (
          <div
            key={label}
            className="p-4 sm:p-5 rounded-2xl border stat-card flex flex-col justify-between"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${clr}1a`, border: `1px solid ${clr}30` }}>
                <Icon className="w-4.5 h-4.5" style={{ color: clr }} />
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MEGAPUNTO</span>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)]">{value}</div>
              <div className="text-xs text-[color:var(--text-muted)] font-medium mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Misión y Visión Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="p-5 sm:p-6 rounded-2xl border shadow-xl space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)'
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-lg">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-[color:var(--text-main)]">Nuestra Misión</h3>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
            Ofrecer a las familias y empresas colombianas acceso a productos de vanguardia en tecnología, electrodomésticos, movilidad y moda con los más altos estándares de calidad, facilidades de pago y un servicio al cliente humano y oportuno.
          </p>
        </div>

        <div
          className="p-5 sm:p-6 rounded-2xl border shadow-xl space-y-3 relative overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)'
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-lg">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-black text-[color:var(--text-main)]">Nuestra Visión</h3>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
            Consolidarnos como el referente número uno de comercio multidepartamento en Colombia, reconocidos por nuestra innovación tecnológica, confiabilidad en cada entrega y relaciones duraderas con nuestros clientes y aliados estratégicos.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-5">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
            Nuestros Pilares
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)]">
            Valores que Guían Cada Decisión
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-4 sm:p-5 rounded-2xl border shadow-xl flex flex-col justify-between group hover:translate-y-[-3px] transition-all"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-card)'
              }}
            >
              <div className="space-y-2.5">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${v.clr}1a`, border: `1px solid ${v.clr}30` }}
                >
                  <v.icon className="w-4.5 h-4.5" style={{ color: v.clr }} />
                </span>
                <h4 className="text-sm font-bold text-[color:var(--text-main)] group-hover:text-orange-400 transition-colors">
                  {v.title}
                </h4>
                <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div
        className="p-5 sm:p-8 rounded-2xl border shadow-2xl space-y-6"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)'
        }}
      >
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
            Nuestra Trayectoria
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)]">
            Evolución y Crecimiento Continuo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-2">
          {milestones.map((m) => (
            <div key={m.year} className="space-y-1.5 relative">
              <span className="text-xl font-black text-orange-400 block">{m.year}</span>
              <h4 className="text-sm font-bold text-[color:var(--text-main)]">{m.title}</h4>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer Card */}
      <div
        className="p-6 sm:p-8 rounded-2xl border text-center space-y-5 shadow-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, var(--bg-grad-radial-2) 100%)',
          borderColor: 'var(--border-card)'
        }}
      >
        <h3 className="text-xl sm:text-3xl font-black text-white">
          ¿Listo para Renovar tu Hogar o Tecnología?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Explora cientos de productos garantizados con envíos seguros a toda Colombia.
        </p>
        <div className="flex justify-center gap-3 pt-1 flex-wrap">
          <Link to="/productos">
            <Button variant="orange" size="md" icon={ShoppingBag}>
              Ver Catálogo Completo
            </Button>
          </Link>
          <Link to="/contacto">
            <Button variant="ghost" size="md">
              Contactar Asesor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
