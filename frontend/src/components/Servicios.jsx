import React from 'react';
import { Truck, ShieldCheck, CreditCard, Gift, Clock, RefreshCw, Sparkles } from 'lucide-react';

const servicesList = [
  {
    id: 1,
    icon: Truck,
    title: 'Envío Nacional Gratis',
    description: 'En compras superiores a $150.000 COP a todas las ciudades y municipios de Colombia.'
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Garantía Extendida MEGAPUNTO',
    description: 'Protección directa de 1 a 3 años para tu celular, motocicleta, computador o electrodoméstico.'
  },
  {
    id: 3,
    icon: CreditCard,
    title: 'Financiación & Pagos Seguros',
    description: 'Paga con tarjeta de crédito, PSE, Nequi, Daviplata o solicita Crédito Fácil MEGAPUNTO en minutos.'
  },
  {
    id: 4,
    icon: Gift,
    title: 'Puntos MEGAPUNTO Rewards',
    description: 'Acumula puntos en cada compra y canjéalos por descuentos reales y regalos de temporada.'
  },
  {
    id: 5,
    icon: RefreshCw,
    title: 'Devoluciones Sin Complicaciones',
    description: 'Hasta 30 días para cambios o devoluciones con atención rápida en nuestras sedes físicas.'
  },
  {
    id: 6,
    icon: Clock,
    title: 'Soporte y Asesoría Inmediata',
    description: 'Equipo de atención al cliente disponible vía WhatsApp y correo para resolver tus consultas.'
  }
];

export default function Servicios() {
  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Beneficios Exclusivos
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[color:var(--text-main)]">
            Servicios y Respaldo MEGAPUNTO
          </h2>
          <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
            Diseñados para brindarte la mejor experiencia de compra en Colombia con confianza, seguridad y garantía.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {servicesList.map((service) => {
            const IconComp = service.icon;
            return (
              <div
                key={service.id}
                className="p-6 rounded-3xl stat-card group cursor-default transition-all duration-300 space-y-4"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-card)',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(91,33,182,0.15)', border: '1px solid rgba(91,33,182,0.3)' }}
                >
                  <IconComp className="w-7 h-7 text-purple-400 group-hover:text-orange-400 transition-colors duration-300 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[color:var(--text-main)] group-hover:text-orange-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mt-1.5">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}