import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ChevronDown,
  HelpCircle,
  ShoppingBag,
  FileQuestion
} from 'lucide-react';
import { chatbotAPI } from '../services/api.js';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      remitente: 'bot',
      texto: '¡Hola! 👋 Soy **PuntoBot**, tu asistente virtual con Inteligencia Artificial de MEGAPUNTO. ¿Cómo te puedo ayudar hoy? Puedo recomendarte productos, informarte sobre métodos de pago, envíos o guiarte para radicar una PQR.',
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    '¿Cómo radicar una PQR?',
    '¿Tienen envío gratis?',
    'Ver celulares en oferta',
    'Neveras Samsung y Estufas Haceb'
  ]);
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: Date.now(),
      remitente: 'user',
      texto: text,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({
        remitente: m.remitente,
        texto: m.texto
      }));

      const res = await chatbotAPI.sendMessage({
        mensaje: text,
        session_id: sessionId,
        historial: historyPayload
      });

      if (res.ok && res.data) {
        if (res.data.session_id) setSessionId(res.data.session_id);

        const botReply = {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: res.data.respuesta || 'Lo siento, no pude procesar tu mensaje.',
          fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);

        if (res.data.sugerencias && res.data.sugerencias.length > 0) {
          setSuggestions(res.data.sugerencias);
        }
      } else {
        throw new Error('Error al recibir respuesta');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          remitente: 'bot',
          texto: 'Disculpa, tuve un inconveniente temporal para comunicarme con el servidor. ¿Podrías intentar nuevamente?',
          fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        remitente: 'bot',
        texto: '¡Conversación reiniciada! ¿En qué más puedo orientarte hoy?',
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #ea580c, #7c3aed)',
            boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.5)'
          }}
          title="Abrir Chatbot con IA MEGAPUNTO"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Asistente IA MEGAPUNTO
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl animate-fadeInScale"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-card)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Header */}
          <div
            className="p-4 border-b flex items-center justify-between shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(124, 58, 237, 0.15))',
              borderColor: 'var(--border-glass)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #9333ea)' }}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="font-black text-sm text-[color:var(--text-main)] flex items-center gap-1.5">
                  PuntoBot <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">IA</span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-semibold">En línea · Asesor MEGAPUNTO</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reiniciar conversación"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" style={{ background: 'var(--bg-main)' }}>
            {messages.map((m) => {
              const isBot = m.remitente === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      isBot
                        ? 'border text-[color:var(--text-main)] rounded-tl-sm'
                        : 'bg-orange-600 text-white rounded-tr-sm font-medium'
                    }`}
                    style={
                      isBot
                        ? { background: 'var(--bg-card)', borderColor: 'var(--border-card)' }
                        : {}
                    }
                  >
                    <p className="whitespace-pre-line">{m.texto}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 ${
                        isBot ? 'text-slate-400' : 'text-orange-200'
                      }`}
                    >
                      {m.fecha}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs animate-pulse">
                <div className="w-7 h-7 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions.length > 0 && (
            <div className="px-3 py-2 border-t overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar shrink-0"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border-glass)' }}>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(sug)}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold border hover:border-orange-500 hover:text-orange-400 transition-colors shrink-0 cursor-pointer"
                  style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t shrink-0 flex items-center gap-2"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--border-glass)' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta o pide asesoría..."
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                color: 'var(--text-main)'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white transition-all cursor-pointer shadow-md shadow-orange-600/30"
              title="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
