import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phoneNumber = '573046408290';
  const defaultText = '¡Hola MEGAPUNTO! Quisiera recibir asesoría personalizada sobre sus productos y servicios.';

  const handleSend = (e) => {
    e?.preventDefault();
    const textToSend = encodeURIComponent(customMsg.trim() || defaultText);
    const url = `https://wa.me/${phoneNumber}?text=${textToSend}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
      {/* Interactive Chat Popup Box */}
      {isOpen && (
        <div
          className="mb-3 w-80 sm:w-88 rounded-3xl overflow-hidden shadow-2xl animate-fadeInScale border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            backdropFilter: 'blur(24px)'
          }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between text-white"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-300 border-2 border-emerald-800 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Asesoría MEGAPUNTO</h4>
                <p className="text-[11px] text-emerald-100 font-medium">En línea · Respuesta rápida</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3">
            <div
              className="p-3.5 rounded-2xl text-xs leading-relaxed"
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)'
              }}
            >
              <p className="font-semibold text-emerald-400 mb-1">👋 ¡Hola! Bienvenido a MEGAPUNTO</p>
              <p className="opacity-90">
                ¿Buscas ofertas en electrodomésticos, tecnología, motos o moda? Escríbenos directamente a WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Escribe tu consulta aquí..."
                rows="2"
                className="w-full p-2.5 text-xs rounded-xl outline-none transition-all resize-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-main)'
                }}
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Iniciar Chat en WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-108 active:scale-95 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 8px 30px rgba(37, 211, 102, 0.45)'
        }}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white fill-current transition-transform group-hover:rotate-12 duration-300" />
        <span className="hidden sm:inline-block pr-2 text-white font-extrabold text-xs tracking-wide">
          ¿Necesitas ayuda?
        </span>

        {/* Pulse radar ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />
      </button>
    </div>
  );
}
