import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Pause, Play,
  ShoppingBag, Truck, ShieldCheck, CreditCard,
  Headphones, ArrowRight, Zap, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

import img1  from '../Images/IMG1.jfif';
import img2  from '../Images/IMG2.jfif';
import img3  from '../Images/IMG3.jfif';
import img4  from '../Images/IMG4.jfif';
import img5  from '../Images/IMG5.jfif';
import img6  from '../Images/IMG6.jfif';
import img7  from '../Images/IMG7.jfif';
import img8  from '../Images/IMG8.jfif';
import img9  from '../Images/Img9.jfif';
import img10 from '../Images/IMG10.jfif';

const slides = [
  { id:1,  title:'Electrodomésticos de Alta Eficiencia', dept:'Línea Blanca',        src:img1,  clr:'#a78bfa', glow:'rgba(167,139,250,0.3)' },
  { id:2,  title:'Computadores y Tecnología Pro',         dept:'Tecnología',           src:img2,  clr:'#38bdf8', glow:'rgba(56,189,248,0.3)'  },
  { id:3,  title:'Moda y Tendencias de Temporada',        dept:'Ropa & Accesorios',   src:img3,  clr:'#fb7185', glow:'rgba(251,113,133,0.3)' },
  { id:4,  title:'Calzado Deportivo y Ergonómico',        dept:'Zapatería',            src:img4,  clr:'#fbbf24', glow:'rgba(251,191,36,0.3)'  },
  { id:5,  title:'Supermercado y Despensa del Hogar',     dept:'Alimentos & Víveres', src:img5,  clr:'#34d399', glow:'rgba(52,211,153,0.3)'  },
  { id:6,  title:'Smart TVs 4K y Entretenimiento',        dept:'Audio & Video',        src:img6,  clr:'#818cf8', glow:'rgba(129,140,248,0.3)' },
  { id:7,  title:'Muebles y Decoración de Interiores',   dept:'Diseño de Interiores', src:img7,  clr:'#a78bfa', glow:'rgba(167,139,250,0.3)' },
  { id:8,  title:'Smartphones y Dispositivos Móviles',    dept:'Tecnología Móvil',     src:img8,  clr:'#38bdf8', glow:'rgba(56,189,248,0.3)'  },
  { id:9,  title:'Motocicletas y Vehículos Urbanos',      dept:'Automotriz',           src:img9,  clr:'#f97316', glow:'rgba(249,115,22,0.35)' },
  { id:10, title:'Catálogo General MEGAPUNTO',            dept:'Todo en un Lugar',     src:img10, clr:'#fbbf24', glow:'rgba(251,191,36,0.3)'  },
];

const VALUE_PROPS = [
  { Icon: Truck,       label: 'Envíos Nacionales',  sub: 'Cobertura en todo Colombia',  clr: '#a78bfa' },
  { Icon: ShieldCheck, label: 'Garantía Directa',   sub: 'Productos 100% originales',   clr: '#f97316' },
  { Icon: CreditCard,  label: 'Pagos Seguros',      sub: 'PSE · Tarjetas · Efectivo',   clr: '#34d399' },
  { Icon: Headphones,  label: 'Soporte Continuo',   sub: 'Atención 3046408290',          clr: '#38bdf8' },
];

export default function Main({ onOpenLogin, onOpenRegister }) {
  const { currentUser } = useAuth();
  const [idx,       setIdx]       = useState(0);
  const [playing,   setPlaying]   = useState(true);
  const [fading,    setFading]    = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => advance(1), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx]);

  const advance = (dir) => {
    setFading(true);
    setTimeout(() => {
      setIdx(p => (p + dir + slides.length) % slides.length);
      setFading(false);
    }, 280);
  };

  const s = slides[idx];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── HERO BANNER ──────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-2xl p-6 sm:p-10 animate-fadeInScale"
        style={{
          background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, var(--bg-card) 45%, var(--bg-main) 70%, var(--bg-grad-radial-2) 100%)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--mp-glow-orange) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--mp-glow-purple) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-px opacity-20 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, var(--mp-glow-orange), transparent)' }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-300"
              style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <Zap className="w-3 h-3" />
              Almacenes MEGAPUNTO Colombia
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[color:var(--text-main)] leading-none tracking-tight">
              Tu Mundo en un<br />
              <span className="text-shimmer">Solo Lugar</span>
            </h1>

            <p className="text-sm text-[color:var(--text-muted)] leading-relaxed max-w-lg">
              Plataforma integral de comercio departamental: electrodomésticos, tecnología, vehículos, ropa, calzado y supermercado con garantía oficial.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                ))}
              </div>
              <span className="text-xs text-[color:var(--text-muted)]">+50.000 clientes satisfechos</span>
            </div>
          </div>

          {/* CTA Buttons — only show when NOT logged in */}
          {!currentUser && (
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 font-extrabold text-[13px] text-white rounded-xl cursor-pointer min-w-[160px] text-center btn-glow-orange"
              >
                Crear mi Cuenta
              </button>
              <button
                onClick={onOpenLogin}
                className="px-6 py-3 font-bold text-[13px] text-[color:var(--text-main)] rounded-xl cursor-pointer min-w-[160px] text-center transition-all duration-200"
                style={{
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-grad-radial-1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; }}
              >
                Iniciar Sesión
              </button>
            </div>
          )}

          {/* Logged-in welcome banner */}
          {currentUser && (
            <div
              className="flex flex-col items-start sm:items-end gap-1 shrink-0 px-4 py-3 rounded-xl border animate-fadeIn"
              style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">Sesión Activa</span>
              <p className="text-sm font-black text-[color:var(--text-main)]">
                ¡Hola, {currentUser.nombre || currentUser.email.split('@')[0]}!
              </p>
              <Link
                to="/productos"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 text-xs font-bold text-white rounded-lg btn-glow-orange"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Catálogo
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── INTERACTIVE CAROUSEL ──────────────────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden group animate-fadeInUp"
        style={{
          animationDelay: '0.1s',
          animationFillMode: 'both',
          border: '1px solid var(--border-card)',
          boxShadow: `0 0 60px ${s.glow}, var(--shadow-card)`,
          transition: 'box-shadow 1s ease',
        }}
      >
        {/* Image */}
        <div className="relative h-[320px] sm:h-[420px] md:h-[480px] w-full overflow-hidden bg-[color:var(--bg-main)]">
          <img
            key={s.id}
            src={s.src}
            alt={s.title}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.04]"
            style={{ opacity: fading ? 0.4 : 1, transition: 'opacity 0.28s ease, transform 0.7s ease' }}
          />

          {/* Overlay layers */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 45%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--bg-card) 0%, transparent 60%)' }} />

          {/* Top controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span
              className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full text-white"
              style={{
                background: `${s.clr}28`,
                border: `1px solid ${s.clr}50`,
                color: s.clr,
                boxShadow: `0 0 16px ${s.glow}`,
              }}
            >
              {s.dept}
            </span>
            <button
              onClick={() => setPlaying(v => !v)}
              className="p-2 rounded-lg text-[color:var(--text-main)] cursor-pointer transition-all duration-200"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(12px)' }}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

          {/* Arrows */}
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => advance(dir)}
              className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 z-10"
              style={{
                [dir === -1 ? 'left' : 'right']: '12px',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-glass)',
                boxShadow: 'var(--shadow-card)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-grad-radial-1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; }}
              aria-label={dir === -1 ? 'Anterior' : 'Siguiente'}
            >
              {dir === -1 ? <ChevronLeft className="w-4 h-4 text-[color:var(--text-main)] stroke-[2.5]" /> : <ChevronRight className="w-4 h-4 text-[color:var(--text-main)] stroke-[2.5]" />}
            </button>
          ))}

          {/* Caption */}
          <div
            className="absolute bottom-6 left-5 sm:left-8 right-5 sm:right-8 z-10 transition-all duration-500"
            style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)' }}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5 block" style={{ color: s.clr }}>
              {idx + 1} / {slides.length}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-[color:var(--text-main)] max-w-xl leading-tight drop-shadow-2xl">
              {s.title}
            </h3>
            <div className="mt-3">
              <Link
                to="/productos"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white rounded-xl btn-glow-orange"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Explorar Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom dot nav */}
        <div
          className="px-5 py-3 flex items-center justify-between gap-4"
          style={{ background: 'rgba(8,5,26,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span className="text-[11px] font-semibold text-[color:var(--text-muted)] hidden sm:block truncate max-w-xs">{s.title}</span>
          <div className="flex items-center gap-1.5 ml-auto">
            {slides.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => { setFading(true); setTimeout(() => { setIdx(i); setFading(false); }, 200); }}
                className="rounded-full cursor-pointer transition-all duration-300"
                style={{
                  width: i === idx ? '24px' : '6px',
                  height: '6px',
                  background: i === idx ? sl.clr : 'var(--bg-glass)',
                  boxShadow: i === idx ? `0 0 10px ${sl.glow}` : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUE PROPS ──────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeInUp" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        {VALUE_PROPS.map(({ Icon, label, sub, clr }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-center gap-3 card-hover cursor-default"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
            }}
          >
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{ background: `${clr}18`, border: `1px solid ${clr}30` }}
            >
              <Icon className="w-4.5 h-4.5 stroke-[2]" style={{ color: clr }} />
            </div>
            <div className="min-w-0">
              <h4 className="text-[13px] font-extrabold text-[color:var(--text-main)] leading-snug truncate">{label}</h4>
              <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5 leading-snug truncate">{sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── DEPARTMENT THUMBNAILS ─────────────────────────── */}
      <section className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[color:var(--text-main)] flex items-center gap-2.5">
            <span className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, #f97316, #5b21b6)' }} />
            Departamentos Destacados
          </h2>
          <Link
            to="/productos"
            className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
          >
            Catálogo completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {slides.slice(0, 5).map((dept) => (
            <Link
              key={dept.id}
              to="/productos"
              className="rounded-xl overflow-hidden text-center group card-hover"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
              }}
            >
              <div className="h-24 w-full overflow-hidden">
                <img
                  src={dept.src}
                  alt={dept.dept}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-2.5">
                <span
                  className="text-[11px] font-extrabold transition-colors duration-200 truncate block"
                  style={{ color: dept.clr }}
                >
                  {dept.dept}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
