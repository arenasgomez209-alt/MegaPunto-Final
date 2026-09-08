import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Headphones,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { contactAPI } from '../services/api.js';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: '¿Cuáles son los tiempos de entrega para envíos nacionales?',
      a: 'Para ciudades principales como Medellín, Bogotá y Cali, el tiempo de entrega es de 24 a 48 horas hábiles. Para el resto del territorio nacional, entre 3 y 5 días hábiles.'
    },
    {
      q: '¿Cómo funciona la garantía de los productos en MEGAPUNTO?',
      a: 'Todos nuestros productos cuentan con garantía directa de 1 a 2 años con los centros autorizados de cada marca (Samsung, LG, Xiaomi, Yamaha, Haceb, etc.).'
    },
    {
      q: '¿Cuáles son los métodos de pago aceptados?',
      a: 'Aceptamos transferencias PSE, tarjetas de crédito y débito (Visa, Mastercard, American Express), Bancolombia, Nequi, Daviplata y pago contra entrega en áreas seleccionadas.'
    },
    {
      q: '¿Puedo solicitar factura electrónica con NIT para mi empresa?',
      a: 'Sí, al momento de registrar tu compra o crear tu cuenta puedes seleccionar tipo de documento NIT y te enviaremos la factura electrónica DIAN al correo registrado.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      setErrorMsg('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    setLoading(true);
    const res = await contactAPI.send(formData);
    setLoading(false);

    if (res.ok && res.data.success) {
      setSubmitted(true);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    } else {
      setErrorMsg(res.data?.message || 'No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 inline-flex items-center gap-1.5 shadow-sm">
          <Headphones className="w-3.5 h-3.5" /> Centro de Atención & Soporte Oficial
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[color:var(--text-main)] tracking-tight">
          Estamos Aquí para Ayudarte
        </h1>
        <p className="text-xs sm:text-sm text-[color:var(--text-muted)] leading-relaxed">
          ¿Tienes preguntas sobre un pedido, garantías, cotizaciones empresariales o métodos de pago? Escríbenos y un asesor responderá de inmediato.
        </p>
      </div>

      {/* Main Grid: Form + Direct Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Column */}
        <div
          className="lg:col-span-7 p-5 sm:p-7 rounded-2xl border shadow-2xl flex flex-col justify-between"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-fadeInScale">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[color:var(--text-main)]">¡Mensaje Enviado con Éxito!</h3>
              <p className="text-xs text-[color:var(--text-muted)] max-w-md mx-auto leading-relaxed">
                Tu solicitud ha sido guardada en nuestra base de datos. Un asesor del equipo de atención al cliente te responderá en el menor tiempo posible.
              </p>
              <div className="pt-4">
                <Button variant="primary" onClick={() => setSubmitted(false)}>
                  Enviar Otra Consulta
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b pb-3 mb-2" style={{ borderColor: 'var(--border-glass)' }}>
                <h3 className="text-lg font-black text-[color:var(--text-main)]">Formulario de Contacto</h3>
                <p className="text-xs text-[color:var(--text-muted)]">Los mensajes se registran directamente en el sistema de gestión.</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre Completo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  icon={Mail}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Teléfono / Celular (opcional)"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="3001234567"
                  icon={Phone}
                />
                <Input
                  label="Asunto de la Consulta"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  placeholder="Garantías, compras o entregas"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[color:var(--text-main)] opacity-90">
                  Mensaje o Solicitud <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="4"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Escribe detalladamente tu consulta, número de pedido si aplica o producto de interés..."
                  required
                  className="w-full p-3.5 text-xs outline-none rounded-2xl transition-all resize-none"
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-input)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="orange"
                  size="lg"
                  fullWidth
                  disabled={loading}
                  icon={Send}
                >
                  {loading ? 'Enviando a Base de Datos...' : 'Enviar Mensaje Ahora'}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Direct Information Channels */}
        <div className="lg:col-span-5 space-y-5">
          {/* Direct Support Card */}
          <div
            className="p-5 sm:p-6 rounded-2xl border shadow-xl space-y-4"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-card)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <h3 className="text-base font-black text-[color:var(--text-main)] flex items-center gap-2">
              <Headphones className="w-5 h-5 text-orange-400" /> Líneas Directas de Atención
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href="https://wa.me/573046408290?text=Hola%20MEGAPUNTO,%20deseo%20asesor%C3%ADa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl border flex items-center gap-3.5 transition-all hover:translate-x-1 group"
                style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[color:var(--text-main)] block">Línea WhatsApp Nacional</span>
                  <span className="text-emerald-400 font-extrabold">+57 304 640 8290</span>
                </div>
              </a>

              <div
                className="p-4 rounded-2xl border flex items-center gap-3.5"
                style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-base shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[color:var(--text-main)] block">Correo Institucional</span>
                  <span className="text-slate-400">contacto@megapunto.com.co</span>
                </div>
              </div>

              <div
                className="p-4 rounded-2xl border flex items-center gap-3.5"
                style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold text-base shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-[color:var(--text-main)] block">Horario de Atención</span>
                  <span className="text-slate-400">Lunes a Sábado: 8:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sede Locations */}
          <div
            className="p-5 rounded-2xl border shadow-xl space-y-3"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-card)'
            }}
          >
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" /> Sedes y Bodegas Principales
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <strong className="text-orange-400 block">Sede Medellín</strong>
                <span className="text-[11px] text-slate-400">Centro Comercial Almacenes</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <strong className="text-purple-400 block">Sede Bogotá D.C.</strong>
                <span className="text-[11px] text-slate-400">Bodega de Despachos Norte</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordions Section */}
      <div
        className="p-5 sm:p-7 rounded-2xl border shadow-xl space-y-5"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--border-card)'
        }}
      >
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
            Preguntas Frecuentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[color:var(--text-main)]">
            Dudas Habituales de Nuestros Clientes
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border overflow-hidden transition-colors"
                style={{
                  background: 'var(--bg-glass)',
                  borderColor: 'var(--border-glass)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[color:var(--text-main)] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[color:var(--text-muted)] leading-relaxed border-t border-white/5 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
