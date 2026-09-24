import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Smartphone,
  Bike,
  Refrigerator,
  Laptop,
  Shirt,
  Footprints,
  Heart,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  Award,
  Users,
  Building2,
  Headphones,
  Check,
  Copy,
  ThumbsUp,
  MapPin,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

// Local images
import imgNevera from '../Images/nevera.jpg';
import imgEstufa from '../Images/estufa.jpg';
import imgLavadora from '../Images/lavadora.jpg';
import imgPC from '../Images/pc.jpg';
import imgMoto from '../Images/moto.jpg';
import imgRopa from '../Images/IMG3.jfif';
import imgCelular from '../Images/IMG8.jfif';

const curatedSpotlight = [
  {
    _id: 'spot-1',
    title: 'Nevera Samsung No Frost 400L Inverter Digital',
    category: 'Electrodomésticos',
    price: 2850000,
    oldPrice: 3200000,
    priceFormatted: '$2.850.000 COP',
    rating: 4.9,
    reviews: 58,
    image: imgNevera,
    badge: 'MÁS VENDIDO'
  },
  {
    _id: 'spot-2',
    title: 'iPhone 15 Pro Max 256GB Titanio Natural',
    category: 'Celulares',
    price: 5490000,
    oldPrice: 5890000,
    priceFormatted: '$5.490.000 COP',
    rating: 5.0,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    badge: 'OFERTA FLASH'
  },
  {
    _id: 'spot-3',
    title: 'Motocicleta Yamaha MT-03 ABS 2026',
    category: 'Motos',
    price: 27500000,
    oldPrice: 28900000,
    priceFormatted: '$27.500.000 COP',
    rating: 5.0,
    reviews: 65,
    image: imgMoto,
    badge: 'LANZAMIENTO'
  },
  {
    _id: 'spot-4',
    title: 'Celular Xiaomi Redmi Note 13 Pro 256GB 5G',
    category: 'Celulares',
    price: 1290000,
    oldPrice: 1450000,
    priceFormatted: '$1.290.000 COP',
    rating: 4.9,
    reviews: 142,
    image: imgCelular,
    badge: 'RECOMENDADO'
  }
];

const categories = [
  { id: 'celulares', label: 'Celulares & Smartphones', sub: 'iPhone, Xiaomi, Samsung', icon: Smartphone, color: '#ea580c' },
  { id: 'motos', label: 'Motocicletas & Repuestos', sub: 'Deportivas y repuestos', icon: Bike, color: '#7c3aed' },
  { id: 'electro', label: 'Electrodomésticos Hogar', sub: 'Neveras, estufas, lavado', icon: Refrigerator, color: '#0284c7' },
  { id: 'computo', label: 'Computadores & Gaming', sub: 'Laptops y torres gamer', icon: Laptop, color: '#10b981' },
  { id: 'moda', label: 'Moda & Prendas', sub: 'Última colección', icon: Shirt, color: '#f43f5e' },
  { id: 'calzado', label: 'Calzado Deportivo', sub: 'Tenis y zapatillas', icon: Footprints, color: '#f59e0b' }
];

const testimonials = [
  {
    id: 1,
    name: 'Carlos Andrés Restrepo',
    city: 'Medellín, Antioquia',
    comment: 'Compré la nevera Samsung para mi hogar. Llegó al día siguiente en perfecto estado, con la factura DIAN en PDF y la garantía sellada. Excelente servicio.',
    rating: 5,
    product: 'Nevera Samsung 400L'
  },
  {
    id: 2,
    name: 'Valentina Morales',
    city: 'Bogotá D.C.',
    comment: 'El iPhone 15 Pro Max 100% original, nuevo en caja sellada con garantía directa Apple. El proceso de pago por PSE fue súper rápido y seguro.',
    rating: 5,
    product: 'iPhone 15 Pro Max'
  },
  {
    id: 3,
    name: 'Mateo Gómez Arango',
    city: 'Cali, Valle del Cauca',
    comment: 'Excelente asesoría por el WhatsApp de MegaPunto para elegir mi Yamaha MT-03. Me guiaron en los trámites de matrícula y el envío a Cali fue impecable.',
    rating: 5,
    product: 'Yamaha MT-03 ABS'
  }
];

export default function Index({ onOpenLogin, onOpenRegister }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [wishlist, setWishlist] = useState({});
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [addedToast, setAddedToast] = useState(null);

  // Countdown timer for Deal of the Day (Hours : Minutes : Seconds)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id,
      title: product.title,
      nombre: product.title,
      price: product.price,
      precio: product.price,
      image: product.image,
      imagen: product.image,
      stock: 10
    });
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 3500);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('MEGA20');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 min-h-screen">

      {/* Floating Add to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold truncate max-w-xs sm:max-w-md">
            ¡Agregado al carrito: <span className="text-orange-400 font-bold">{addedToast}</span>!
          </p>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-lg shadow-sm hover:scale-105 transition-transform"
          >
            Ver Carrito
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. HERO BENTO GRID (Ancho Extendido y Proporcionado)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Bloque 1: Tarjeta Grande Principal Oscura / Moderna (Col 8) */}
          <div className="lg:col-span-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800/80 shadow-2xl flex flex-col justify-between min-h-[470px] group">
            {/* Ambient Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Tu Mundo en un Solo Lugar · MegaPunto Colombia
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Encuentra eso que{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                  hace la diferencia.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                Almacenes MegaPunto es la tienda multidepartamento líder en Colombia. Conectamos tecnología de última generación, electrodomésticos para el hogar y movilidad sobre ruedas con respaldo y garantía directa.
              </p>

              {/* Botones de Acción */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/productos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ir al Catálogo de Productos
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/quienes_s"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-purple-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Conoce Nuestra Historia
                </Link>
              </div>
            </div>

            {/* Social Proof + Badge */}
            <div className="relative z-10 pt-8 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">CR</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">VM</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">MG</div>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">Más de 5,000 clientes felices en Colombia</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    Calificación promedio 4.9 <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> · Garantía oficial
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Envíos asegurados a más de 900 municipios</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha (Col 4): 2 Tarjetas Bento */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Bloque 2: Tarjeta Naranja - Oferta del Día con Contador */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-orange-500/20 relative overflow-hidden flex flex-col justify-between flex-1 group">
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                    <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
                    Oferta del Día
                  </span>
                  <span className="text-xs font-bold text-orange-100">Hasta 35% OFF</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black leading-snug">
                  Smartphones 5G & Accesorios
                </h3>
                <p className="text-xs text-orange-100 font-medium leading-relaxed">
                  Precios especiales por tiempo limitado en telefonía y tecnología de vanguardia.
                </p>

                {/* Contador Regresivo en Vivo */}
                <div className="pt-2 flex items-center gap-2">
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2 text-center border border-white/20">
                    <span className="block text-lg font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-orange-100 font-bold">Horas</span>
                  </div>
                  <span className="font-black text-white text-lg">:</span>
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2 text-center border border-white/20">
                    <span className="block text-lg font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-orange-100 font-bold">Min</span>
                  </div>
                  <span className="font-black text-white text-lg">:</span>
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2 text-center border border-white/20">
                    <span className="block text-lg font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="block text-[9px] uppercase tracking-wider text-orange-100 font-bold">Seg</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 relative z-10">
                <Link
                  to="/productos"
                  className="w-full py-2.5 px-4 bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  Ver ofertas en el catálogo
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Bloque 3: Tarjeta Blanca Nítida - Lanzamiento */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-md shadow-slate-100 flex flex-col justify-between flex-1 hover:border-purple-300 transition-all group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    <Award className="w-3 h-3 text-purple-600" />
                    Lanzamiento Exclusivo
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Disponible</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                  Yamaha MT-03 ABS 2026
                </h3>
                <p className="text-xs leading-relaxed font-normal" style={{color:'#383252'}}>
                  Bicilíndrica hiper naked de 321cc, frenos ABS doble canal, iluminación full LED y tablero digital.
                </p>

                <div className="pt-1">
                  <span className="text-xs block font-medium" style={{color:'#524b6e'}}>Precio oficial:</span>
                  <span className="text-lg font-black" style={{color:'#0f0b21'}}>$27.500.000 COP</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleAddToCart(curatedSpotlight[2])}
                  className="w-full py-2 px-4 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Apartar Motocicleta en Línea
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. BARRA DE GARANTÍAS Y CONFIANZA (Trust Bar)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Envíos a Todo el País</h4>
              <p className="text-xs font-normal" style={{color:'#524b6e'}}>Gratis desde $150.000 COP</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Garantía Directa</h4>
              <p className="text-xs font-normal" style={{color:'#524b6e'}}>1 a 3 años oficiales</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Pagos 100% Seguros</h4>
              <p className="text-xs font-normal" style={{color:'#524b6e'}}>PSE, Bancolombia, Nequi</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Devoluciones Fáciles</h4>
              <p className="text-xs font-normal" style={{color:'#524b6e'}}>Hasta 30 días garantizados</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. EXPLORA NUESTROS DEPARTAMENTOS (Accesos Directos)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">Departamentos Oficiales</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explora lo que tenemos para ti</h2>
          </div>
          <Link
            to="/productos"
            className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 hover:underline"
          >
            Ver catálogo completo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to="/productos"
                className="bg-white border border-slate-200/80 p-5 rounded-2xl hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between h-36"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${cat.color}15`, color: cat.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {cat.label}
                  </h3>
                  <span className="text-[11px] font-normal block mt-0.5" style={{color:'#524b6e'}}>
                    {cat.sub}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SECCIÓN QUIÉNES SOMOS / NUESTRA HISTORIA Y COMPROMISO
          (Contenido propio del Inicio solicitado por el usuario)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                <Building2 className="w-3.5 h-3.5" />
                Nuestra Historia y Pasión
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                Más de 15 años conectando a las familias colombianas con lo mejor del mundo
              </h2>

              <p className="text-sm leading-relaxed font-normal" style={{color:'#383252'}}>
                Almacenes <strong>MEGAPUNTO</strong> nació en Medellín con una misión clara: democratizar el acceso a la tecnología de punta, el confort en el hogar y la movilidad segura sobre dos ruedas. Hoy nos enorgullece ser un referente de confianza en todo el territorio nacional.
              </p>

              <p className="text-sm leading-relaxed font-normal" style={{color:'#383252'}}>
                Trabajamos de la mano con marcas líderes globales como Samsung, Apple, Yamaha, Haceb y LG, garantizando que cada compra cuente con factura legal DIAN, respaldo técnico inmediato y la tranquilidad que tu familia merece.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/quienes_s"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all"
                >
                  Conoce más sobre Nosotros
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/servicios"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-purple-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Servicios Técnicos & Garantías
                </Link>
              </div>
            </div>

            {/* Métricas de Impacto */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center">
                <span className="block text-3xl sm:text-4xl font-black text-orange-600">+50.000</span>
                <span className="text-xs font-bold block mt-1" style={{color:'#0f0b21'}}>Clientes Satisfechos</span>
                <span className="text-[11px] mt-0.5 block" style={{color:'#524b6e'}}>En toda Colombia</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center">
                <span className="block text-3xl sm:text-4xl font-black text-purple-600">100%</span>
                <span className="text-xs font-bold block mt-1" style={{color:'#0f0b21'}}>Garantía Directa</span>
                <span className="text-[11px] mt-0.5 block" style={{color:'#524b6e'}}>Productos originales</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center">
                <span className="block text-3xl sm:text-4xl font-black text-emerald-600">900+</span>
                <span className="text-xs font-bold block mt-1" style={{color:'#0f0b21'}}>Municipios</span>
                <span className="text-[11px] mt-0.5 block" style={{color:'#524b6e'}}>Cobertura de entrega</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center">
                <span className="block text-3xl sm:text-4xl font-black text-amber-500">4.9 ★</span>
                <span className="text-xs font-bold block mt-1" style={{color:'#0f0b21'}}>Reputación</span>
                <span className="text-[11px] mt-0.5 block" style={{color:'#524b6e'}}>Opiniones verificadas</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. VITRINA DE OFERTAS ESTRELLA (Curaduría Destacada del Mes)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">Vitrina Exclusiva</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Los Más Deseados de la Semana</h2>
          </div>
          <Link
            to="/productos"
            className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 hover:underline"
          >
            Explorar todas las ofertas del catálogo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {curatedSpotlight.map(prod => (
            <div
              key={prod._id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Imagen del Producto - Fondo Negro Premium */}
                <div className="relative h-48 w-full rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3" style={{background:'#0b0f19'}}>
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500 text-white shadow-md">
                    {prod.badge}
                  </span>
                  <button
                    onClick={() => toggleWishlist(prod._id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:text-rose-400 shadow-xs cursor-pointer transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist[prod._id] ? 'fill-rose-400 text-rose-400' : ''}`} />
                  </button>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 block">
                  {prod.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 mt-1">
                  {prod.title}
                </h3>

                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold" style={{color:'#0f0b21'}}>{prod.rating}</span>
                  <span className="text-[10px]" style={{color:'#524b6e'}}>({prod.reviews} reseñas)</span>
                </div>
              </div>

              {/* Precio y Botón Agregar al Carrito */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] line-through block font-medium" style={{color:'#524b6e'}}>
                    ${prod.oldPrice?.toLocaleString('es-CO')}
                  </span>
                  <span className="text-base font-black" style={{color:'#0f0b21'}}>
                    {prod.priceFormatted}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(prod)}
                  className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA hacia la página de Productos */}
        <div className="mt-8 text-center bg-gradient-to-r from-purple-50 via-indigo-50 to-orange-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm sm:text-base font-bold" style={{color:'#0f0b21'}}>¿Buscas algo más específico?</h4>
            <p className="text-xs" style={{color:'#383252'}}>Tenemos más de 120 referencias en nuestra sección dedicada con filtros por marca, precio y especificaciones.</p>
          </div>
          <Link
            to="/productos"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all hover:scale-105"
          >
            Ver Todas las Referencias en Productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ¿POR QUÉ ELEGIR MEGAPUNTO? (Pilares de Confianza)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">Respaldo Integral</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">¿Por qué Comprar en MegaPunto?</h2>
          <p className="text-xs mt-1" style={{color:'#383252'}}>Brindamos una experiencia de compra protegida, transparente y con beneficios reales para ti.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Asesoría Humana Inmediata</h3>
            <p className="text-xs mt-2 leading-relaxed" style={{color:'#383252'}}>
              Atención directa por WhatsApp con especialistas en tecnología, motocicletas y electrodomésticos para resolver tus dudas antes de comprar.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Facturación Legal DIAN</h3>
            <p className="text-xs mt-2 leading-relaxed" style={{color:'#383252'}}>
              Todas nuestras ventas generan factura electrónica con código QR y validez tributaria, descargable en PDF desde tu panel personal.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Crédito Fácil en Minutos</h3>
            <p className="text-xs mt-2 leading-relaxed" style={{color:'#383252'}}>
              Opciones de financiación inmediata con PSE, Addi, Sistecrédito y tarjetas bancarias con aprobación en segundos.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Centro de Soporte Técnico</h3>
            <p className="text-xs mt-2 leading-relaxed" style={{color:'#383252'}}>
              Taller certificado y red de centros autorizados para mantenimiento, diagnósticos y repuestos originales de fábrica.
            </p>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. BANNER PROMOCIONAL CUPÓN (Púrpura Vibrante)
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-purple-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <Sparkles className="w-3 h-3" />
              BENEFICIO EXCLUSIVO MEGAPUNTO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              Tu próximo favorito <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                tiene 20% de descuento.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              Usa el código en el carrito de compras para disfrutar de un descuento inmediato en referencias seleccionadas superiores a $200.000 COP.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center font-mono font-black text-xl tracking-widest text-amber-300">
              MEGA20
            </div>
            <button
              onClick={handleCopyCoupon}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              {copiedCoupon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedCoupon ? '¡Copiado!' : 'Copiar Cupón'}
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TESTIMONIOS DE CLIENTES REALES
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-16">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">Experiencias Verificadas</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Lo que Dicen Nuestros Clientes</h2>
          <p className="text-xs mt-1" style={{color:'#383252'}}>Conoce las historias de quienes ya disfrutan de sus compras con MegaPunto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed italic" style={{color:'#383252'}}>
                  "{t.comment}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold" style={{color:'#0f0b21'}}>{t.name}</h4>
                  <span className="text-[10px] flex items-center gap-1" style={{color:'#524b6e'}}>
                    <MapPin className="w-3 h-3 text-orange-500" />
                    {t.city}
                  </span>
                </div>
                <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-bold">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
