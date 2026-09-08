import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Package,
  ChevronRight,
  CheckCircle,
  CreditCard,
  Building2,
  Smartphone,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

// Step indicator component
function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: 'Carrito' },
    { n: 2, label: 'Envío' },
    { n: 3, label: 'Pago' },
    { n: 4, label: '¡Listo!' }
  ];
  return (
    <div className="flex items-center justify-center gap-0 py-4 px-4">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all duration-300 ${
                step > s.n
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : step === s.n
                  ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/40'
                  : 'bg-transparent border-slate-600 text-slate-500'
              }`}
            >
              {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
            </div>
            <span className={`text-[9px] font-bold mt-1 ${step >= s.n ? 'text-orange-400' : 'text-slate-600'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-10 sm:w-16 mb-4 transition-all duration-500 ${
                step > s.n + 1 ? 'bg-emerald-500' : step > s.n ? 'bg-orange-500/60' : 'bg-slate-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const PAYMENT_METHODS = [
  { id: 'pse',     label: 'PSE - Débito Bancario',       icon: Building2,   desc: 'Pago directo desde tu cuenta bancaria' },
  { id: 'card',    label: 'Tarjeta Crédito / Débito',    icon: CreditCard,  desc: 'Visa, Mastercard, American Express' },
  { id: 'nequi',   label: 'Nequi',                       icon: Smartphone,  desc: 'Paga con tu billetera Nequi' },
  { id: 'contra',  label: 'Contra Entrega',              icon: Truck,       desc: 'Paga al recibir (solo áreas disponibles)' },
];

export default function CartModal() {
  const {
    items, removeFromCart, updateQty, clearCart,
    totalPrice, isCartOpen, setIsCartOpen
  } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  const [shipping, setShipping] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    departamento: '', ciudad: '', direccion: '', barrio: '',
    codigoPostal: '', referencias: ''
  });

  const [card, setCard] = useState({
    numero: '', nombre: '', expiry: '', cvv: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isCartOpen) return null;

  const formatCOP = (n) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const shippingCost = totalPrice >= 150000 ? 0 : 12900;
  const totalFinal = totalPrice + shippingCost;

  const validateShipping = () => {
    const e = {};
    if (!shipping.nombre.trim())     e.nombre      = 'Requerido';
    if (!shipping.apellido.trim())   e.apellido    = 'Requerido';
    if (!shipping.email.includes('@')) e.email      = 'Correo inválido';
    if (!shipping.telefono.trim())   e.telefono    = 'Requerido';
    if (!shipping.ciudad.trim())     e.ciudad      = 'Requerido';
    if (!shipping.direccion.trim())  e.direccion   = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      setErrors({ pago: 'Selecciona un método de pago' });
      return false;
    }
    if (paymentMethod === 'card') {
      const e = {};
      if (card.numero.replace(/\s/g, '').length < 16) e.cardNumero = 'Número inválido';
      if (!card.nombre.trim()) e.cardNombre = 'Requerido';
      if (!card.expiry.trim()) e.cardExpiry = 'Requerido';
      if (card.cvv.length < 3) e.cardCvv = 'CVV inválido';
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validatePayment()) return;
    setOrderPlaced(true);
    clearCart();
    setStep(4);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setStep(1);
    setOrderPlaced(false);
    setErrors({});
    setPaymentMethod('');
  };

  const formatCardNum = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const FieldError = ({ name }) =>
    errors[name] ? <span className="text-[10px] text-rose-400 mt-0.5 block">{errors[name]}</span> : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-end sm:justify-center p-0 sm:p-4 animate-fadeIn"
      style={{ background: 'rgba(4,2,16,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full sm:w-[540px] max-h-screen overflow-hidden rounded-none sm:rounded-3xl flex flex-col animate-slideRight"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-card)',
          maxHeight: '96vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{
            borderColor: 'var(--border-glass)',
            background: 'linear-gradient(135deg, var(--bg-grad-radial-1) 0%, transparent 100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base text-[color:var(--text-main)]">Mi Carrito</h2>
              <p className="text-[10px] text-slate-400">{items.length} producto(s) seleccionado(s)</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!orderPlaced && <StepIndicator step={step} />}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* ── STEP 1: CART REVIEW ── */}
          {step === 1 && (
            <div className="p-4 space-y-3">
              {items.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-orange-400 opacity-50" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-500">Agrega productos desde el catálogo para verlos aquí.</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors mt-2 cursor-pointer"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 p-3 rounded-2xl border transition-all"
                    style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[color:var(--text-main)] truncate">{item.nombre}</h4>
                      <p className="text-[10px] text-orange-400 font-semibold">{item.categoria}</p>
                      <p className="text-sm font-black text-[color:var(--text-main)] mt-1">{formatCOP(item.precio)}</p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-1 rounded-lg hover:bg-rose-500/15 text-rose-400 cursor-pointer transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-glass)' }}>
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black text-[color:var(--text-main)]">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── STEP 2: SHIPPING FORM ── */}
          {step === 2 && (
            <div className="p-4 space-y-4">
              <h3 className="font-black text-sm text-[color:var(--text-main)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" /> Datos de Envío y Entrega
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'nombre',   label: 'Nombre *',      icon: User,   type: 'text',  col: 1 },
                  { key: 'apellido', label: 'Apellido *',    icon: User,   type: 'text',  col: 1 },
                  { key: 'email',    label: 'Correo *',      icon: Mail,   type: 'email', col: 2 },
                  { key: 'telefono', label: 'Teléfono / WhatsApp *', icon: Phone, type: 'tel', col: 1 },
                ].map(({ key, label, icon: Icon, type, col }) => (
                  <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type={type}
                        value={shipping[key]}
                        onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl outline-none"
                        style={{
                          background: 'var(--bg-input)',
                          border: `1px solid ${errors[key] ? '#f43f5e' : 'var(--border-input)'}`,
                          color: 'var(--text-main)'
                        }}
                      />
                    </div>
                    <FieldError name={key} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'departamento', label: 'Departamento',         col: 1 },
                  { key: 'ciudad',       label: 'Ciudad / Municipio *', col: 1 },
                  { key: 'direccion',    label: 'Dirección de Entrega * (Calle / Carrera / Km)', col: 2 },
                  { key: 'barrio',       label: 'Barrio / Vereda',      col: 1 },
                  { key: 'codigoPostal', label: 'Código Postal',        col: 1 },
                  { key: 'referencias', label: 'Referencias Adicionales (color puerta, conjunto, torre)', col: 2 },
                ].map(({ key, label, col }) => (
                  <div key={key} className={col === 2 ? 'col-span-2' : ''}>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">{label}</label>
                    {key === 'referencias' ? (
                      <textarea
                        rows={2}
                        value={shipping[key]}
                        onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-xl outline-none resize-none"
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-input)',
                          color: 'var(--text-main)'
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={shipping[key]}
                        onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 text-xs rounded-xl outline-none"
                        style={{
                          background: 'var(--bg-input)',
                          border: `1px solid ${errors[key] ? '#f43f5e' : 'var(--border-input)'}`,
                          color: 'var(--text-main)'
                        }}
                      />
                    )}
                    <FieldError name={key} />
                  </div>
                ))}
              </div>

              {/* Shipping Cost Info */}
              <div
                className="p-3 rounded-2xl border text-xs flex items-center gap-2"
                style={{
                  background: shippingCost === 0 ? 'rgba(52,211,153,0.08)' : 'rgba(249,115,22,0.08)',
                  borderColor: shippingCost === 0 ? 'rgba(52,211,153,0.25)' : 'rgba(249,115,22,0.25)'
                }}
              >
                <Truck className={`w-4 h-4 ${shippingCost === 0 ? 'text-emerald-400' : 'text-orange-400'}`} />
                {shippingCost === 0
                  ? <span className="text-emerald-400 font-bold">¡Envío GRATIS! Tu pedido supera los $150.000 COP.</span>
                  : <span className="text-orange-400 font-bold">Costo de envío: {formatCOP(shippingCost)}. (Envío gratis desde $150.000)</span>
                }
              </div>
            </div>
          )}

          {/* ── STEP 3: PAYMENT METHOD ── */}
          {step === 3 && (
            <div className="p-4 space-y-4">
              <h3 className="font-black text-sm text-[color:var(--text-main)] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-400" /> Método de Pago
              </h3>
              <FieldError name="pago" />

              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => { setPaymentMethod(id); setErrors({}); }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      paymentMethod === id
                        ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                        : 'hover:border-orange-500/40'
                    }`}
                    style={{
                      background: paymentMethod === id ? 'rgba(249,115,22,0.10)' : 'var(--bg-glass)',
                      borderColor: paymentMethod === id ? '#f97316' : 'var(--border-glass)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${paymentMethod === id ? 'text-orange-400' : 'text-slate-400'}`} />
                      <span className={`text-[11px] font-black ${paymentMethod === id ? 'text-orange-400' : 'text-[color:var(--text-main)]'}`}>
                        {label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{desc}</p>
                  </button>
                ))}
              </div>

              {/* Card Details if Card selected */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 rounded-2xl border" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Datos de Tarjeta (Encriptado SSL)
                  </h4>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={card.numero}
                      onChange={e => setCard(p => ({ ...p, numero: formatCardNum(e.target.value) }))}
                      className="w-full px-3 py-2.5 text-xs rounded-xl outline-none tracking-widest font-mono"
                      style={{
                        background: 'var(--bg-input)',
                        border: `1px solid ${errors.cardNumero ? '#f43f5e' : 'var(--border-input)'}`,
                        color: 'var(--text-main)'
                      }}
                    />
                    <FieldError name="cardNumero" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      placeholder="COMO APARECE EN LA TARJETA"
                      value={card.nombre}
                      onChange={e => setCard(p => ({ ...p, nombre: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2.5 text-xs rounded-xl outline-none uppercase tracking-widest"
                      style={{
                        background: 'var(--bg-input)',
                        border: `1px solid ${errors.cardNombre ? '#f43f5e' : 'var(--border-input)'}`,
                        color: 'var(--text-main)'
                      }}
                    />
                    <FieldError name="cardNombre" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={card.expiry}
                        onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                        className="w-full px-3 py-2.5 text-xs rounded-xl outline-none font-mono"
                        style={{
                          background: 'var(--bg-input)',
                          border: `1px solid ${errors.cardExpiry ? '#f43f5e' : 'var(--border-input)'}`,
                          color: 'var(--text-main)'
                        }}
                      />
                      <FieldError name="cardExpiry" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={card.cvv}
                        onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                        className="w-full px-3 py-2.5 text-xs rounded-xl outline-none font-mono"
                        style={{
                          background: 'var(--bg-input)',
                          border: `1px solid ${errors.cardCvv ? '#f43f5e' : 'var(--border-input)'}`,
                          color: 'var(--text-main)'
                        }}
                      />
                      <FieldError name="cardCvv" />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="p-4 rounded-2xl border space-y-2" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <h4 className="text-xs font-black text-[color:var(--text-main)]">Resumen del Pedido</h4>
                {items.map(i => (
                  <div key={i._id} className="flex justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[200px]">{i.nombre} ×{i.qty}</span>
                    <span className="font-bold text-[color:var(--text-main)] ml-2 shrink-0">{formatCOP(i.precio * i.qty)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between text-xs" style={{ borderColor: 'var(--border-glass)' }}>
                  <span className="text-slate-400">Envío</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400 font-bold' : 'text-[color:var(--text-main)] font-bold'}>
                    {shippingCost === 0 ? 'GRATIS' : formatCOP(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-[color:var(--text-main)]">
                  <span>Total a Pagar</span>
                  <span className="text-orange-400">{formatCOP(totalFinal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <div className="p-8 text-center space-y-5 animate-fadeInScale">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-[color:var(--text-main)]">¡Pedido Confirmado!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Hemos registrado tu pedido con éxito. Recibirás una confirmación en tu correo y el seguimiento del envío dentro de las próximas 24 horas hábiles.
              </p>
              <div className="p-4 rounded-2xl border text-left space-y-1" style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <p className="text-[10px] text-slate-400 font-bold">ENTREGA A:</p>
                <p className="text-sm font-bold text-[color:var(--text-main)]">{shipping.nombre} {shipping.apellido}</p>
                <p className="text-xs text-slate-400">{shipping.direccion}, {shipping.ciudad}</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  Método: {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label || 'Confirmado'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-2xl text-sm font-black text-white bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer"
              >
                Seguir Comprando
              </button>
            </div>
          )}
        </div>

        {/* ── FOOTER: Summary + Actions ── */}
        {step < 4 && (
          <div
            className="border-t p-4 shrink-0 space-y-3"
            style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}
          >
            {items.length > 0 && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  {step === 3 ? 'Total Final' : 'Subtotal'}
                </span>
                <span className="text-lg font-black text-orange-400">
                  {formatCOP(step === 3 ? totalFinal : totalPrice)}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={() => { setStep(s => s - 1); setErrors({}); }}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold border cursor-pointer transition-all hover:bg-white/5"
                  style={{ borderColor: 'var(--border-glass)', color: 'var(--text-muted)' }}
                >
                  Volver
                </button>
              )}

              <button
                onClick={() => {
                  if (step === 1 && items.length > 0) setStep(2);
                  else if (step === 2) {
                    if (validateShipping()) setStep(3);
                  } else if (step === 3) {
                    handlePlaceOrder();
                  }
                }}
                disabled={step === 1 && items.length === 0}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-extrabold text-white flex items-center justify-center gap-2 cursor-pointer transition-all btn-glow-orange ${
                  step === 1 && items.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                {step === 1 && 'Continuar con el Envío'}
                {step === 2 && 'Continuar al Pago'}
                {step === 3 && (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Confirmar Pedido
                  </>
                )}
                {step < 3 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
