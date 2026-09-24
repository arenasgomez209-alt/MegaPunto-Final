import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  FileText,
  MessageSquare,
  User,
  Download,
  Plus,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Mail,
  Phone,
  Shield,
  Send,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { salesAPI, invoicesAPI, pqrAPI } from '../services/api.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Toast from '../components/Toast.jsx';
import Badge from '../components/Badge.jsx';

export default function ClientePanel() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('resumen'); // 'resumen' | 'compras' | 'facturas' | 'pqr' | 'perfil'

  const [notification, setNotification] = useState(null);
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatCOP = (num) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num || 0);

  // ────────────────── DATA STATES ──────────────────
  const [sales, setSales] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pqrs, setPqrs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [downloadingInv, setDownloadingInv] = useState(null);

  // PQR Form state
  const [isPqrModalOpen, setIsPqrModalOpen] = useState(false);
  const [newPqr, setNewPqr] = useState({
    tipo: 'Petición',
    asunto: '',
    descripcion: ''
  });
  const [submittingPqr, setSubmittingPqr] = useState(false);

  const fetchClientData = async () => {
    setLoadingData(true);
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    try {
      const [salesRes, invoicesRes, pqrRes] = await Promise.all([
        salesAPI.getByClient(userId),
        invoicesAPI.getByClient(userId),
        pqrAPI.getByClient(userId)
      ]);

      if (salesRes.ok && salesRes.data?.sales) setSales(salesRes.data.sales);
      if (invoicesRes.ok && invoicesRes.data?.invoices) setInvoices(invoicesRes.data.invoices);
      if (pqrRes.ok && pqrRes.data?.pqrs) setPqrs(pqrRes.data.pqrs);
    } catch (err) {
      console.error('Error fetching client dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [currentUser]);

  const handleDownloadInvoice = async (inv) => {
    setDownloadingInv(inv.id || inv._id);
    const ok = await invoicesAPI.downloadPdf(inv.id || inv._id, inv.numero_factura);
    setDownloadingInv(null);
    if (ok) showToast(`Factura ${inv.numero_factura} descargada con éxito.`);
    else showToast('Error al descargar la factura en PDF.', 'error');
  };

  const handleSubmitPqr = async (e) => {
    e.preventDefault();
    if (!newPqr.asunto.trim() || !newPqr.descripcion.trim()) {
      showToast('Por favor completa todos los campos de la PQR.', 'error');
      return;
    }

    setSubmittingPqr(true);
    const res = await pqrAPI.create(newPqr, currentUser);
    setSubmittingPqr(false);

    if (res.ok && res.data?.success) {
      showToast(res.data.message || 'PQR radicada exitosamente.');
      setNewPqr({ tipo: 'Petición', asunto: '', descripcion: '' });
      setIsPqrModalOpen(false);
      fetchClientData();
    } else {
      showToast('Error al radicar PQR.', 'error');
    }
  };

  const sidebarTabs = [
    { id: 'resumen', label: 'Mi Resumen', icon: ShoppingBag },
    { id: 'compras', label: 'Mis Pedidos & Compras', icon: Truck, badge: sales.length || undefined },
    { id: 'facturas', label: 'Mis Facturas (PDF)', icon: FileText, badge: invoices.length || undefined },
    { id: 'pqr', label: 'Mis PQR & Soporte', icon: MessageSquare, badge: pqrs.length || undefined },
    { id: 'perfil', label: 'Datos de Mi Cuenta', icon: User }
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={sidebarTabs}
      title={`Bienvenido, ${currentUser?.nombre || 'Cliente'}`}
      subtitle="Portal de autogestión de compras, facturación electrónica y atención PQR"
      roleName="Cliente"
    >
      {notification && <Toast message={notification.msg} type={notification.type} />}

      {/* ── TAB 1: RESUMEN ── */}
      {activeTab === 'resumen' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Welcome Card */}
          <div className="p-6 rounded-2xl border relative overflow-hidden"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                  Panel de Autogestión Comercial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[color:var(--text-main)] mt-1">
                  Hola, {currentUser?.nombre} {currentUser?.apellido}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Desde aquí puedes hacer seguimiento a tus compras, descargar tus facturas con validez DIAN y radicar peticiones.
                </p>
              </div>

              <Button
                variant="orange"
                size="sm"
                icon={Plus}
                onClick={() => { setActiveTab('pqr'); setIsPqrModalOpen(true); }}
              >
                Radicar Nueva PQR
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border flex items-center justify-between"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Compras Realizadas</span>
                <span className="text-2xl font-black text-orange-400 mt-1 block">{sales.length}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border flex items-center justify-between"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Facturas Disponibles</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{invoices.length}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl border flex items-center justify-between"
                 style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">PQRs Radicadas</span>
                <span className="text-2xl font-black text-sky-400 mt-1 block">{pqrs.length}</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="p-5 rounded-2xl border space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-[color:var(--text-main)] uppercase tracking-wider">
                Tus Pedidos Más Recientes
              </h3>
              <button onClick={() => setActiveTab('compras')} className="text-xs text-orange-400 hover:underline cursor-pointer font-bold">
                Ver todos
              </button>
            </div>

            {sales.slice(0, 3).map((s) => (
              <div key={s._id || s.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                   style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-orange-400">{s.numero_venta}</span>
                    <Badge color="emerald">{s.estado || 'Completada'}</Badge>
                  </div>
                  <h4 className="text-xs font-bold text-[color:var(--text-main)] mt-1">
                    {s.items?.map(it => `${it.nombre} (x${it.cantidad})`).join(', ') || 'Productos adquiridos'}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Fecha: {s.fecha?.slice(0, 10)}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400 block">{formatCOP(s.total)}</span>
                  <span className="text-[10px] text-slate-400 uppercase">{s.metodo_pago}</span>
                </div>
              </div>
            ))}

            {sales.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-4">Aún no has registrado compras en MEGAPUNTO.</p>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: COMPRAS ── */}
      {activeTab === 'compras' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-black text-[color:var(--text-main)]">Historial de Compras y Pedidos</h3>
            <p className="text-xs text-slate-400">Detalle de todos los productos y servicios adquiridos</p>
          </div>

          <div className="space-y-3">
            {sales.map((s) => (
              <div key={s._id || s.id} className="p-5 rounded-2xl border space-y-3"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-orange-400">{s.numero_venta}</span>
                    <Badge color="emerald">{s.estado}</Badge>
                    <span className="text-xs text-slate-400">{s.fecha?.slice(0, 10)} {s.fecha?.slice(11, 16)}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400">{formatCOP(s.total)}</span>
                </div>

                <div className="space-y-2">
                  {s.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded-xl border"
                         style={{ background: 'var(--bg-glass)', borderColor: 'var(--border-glass)' }}>
                      <div>
                        <span className="font-bold text-[color:var(--text-main)]">{it.nombre}</span>
                        <span className="text-[10px] text-slate-400 block">Cantidad: {it.cantidad} × {formatCOP(it.precio_unitario)}</span>
                      </div>
                      <span className="font-bold text-orange-400">{formatCOP(it.total || (it.precio_unitario * it.cantidad))}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 text-slate-400">
                  <span>Entrega en: <strong className="text-white">{s.direccion_envio || currentUser?.direccion || 'Medellín'}</strong></span>
                  <span>Método: <strong className="text-white uppercase">{s.metodo_pago}</strong></span>
                </div>
              </div>
            ))}

            {sales.length === 0 && (
              <div className="p-12 text-center text-slate-400 border rounded-2xl" style={{ borderColor: 'var(--border-card)' }}>
                No tienes pedidos registrados actualmente.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: FACTURAS ── */}
      {activeTab === 'facturas' && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="text-base font-black text-[color:var(--text-main)]">Mis Facturas de Venta Electrónicas</h3>
            <p className="text-xs text-slate-400">Descarga tus facturas en formato PDF con validez oficial</p>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-glass)', background: 'var(--bg-glass)' }}>
                  <th className="p-3.5 font-bold text-slate-400">Nº Factura</th>
                  <th className="p-3.5 font-bold text-slate-400">Fecha</th>
                  <th className="p-3.5 font-bold text-slate-400">Subtotal</th>
                  <th className="p-3.5 font-bold text-slate-400">IVA (19%)</th>
                  <th className="p-3.5 font-bold text-slate-400">Total</th>
                  <th className="p-3.5 font-bold text-slate-400 text-right">Descargar</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: 'var(--border-glass)' }}>
                {invoices.map((inv) => (
                  <tr key={inv._id || inv.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono font-bold text-emerald-400">{inv.numero_factura}</td>
                    <td className="p-3.5 text-slate-300">{inv.fecha_emision?.slice(0, 10)}</td>
                    <td className="p-3.5 text-slate-400">{formatCOP(inv.subtotal)}</td>
                    <td className="p-3.5 text-slate-400">{formatCOP(inv.impuestos)}</td>
                    <td className="p-3.5 font-black text-orange-400">{formatCOP(inv.total)}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="emerald"
                        size="xs"
                        icon={Download}
                        disabled={downloadingInv === (inv.id || inv._id)}
                        onClick={() => handleDownloadInvoice(inv)}
                      >
                        {downloadingInv === (inv.id || inv._id) ? 'Generando...' : 'Descargar PDF'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No tienes facturas emitidas por el momento.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: MIS PQR ── */}
      {activeTab === 'pqr' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[color:var(--text-main)]">Gestión de PQR (Peticiones, Quejas y Reclamos)</h3>
              <p className="text-xs text-slate-400">Radica y consulta el estado de tus solicitudes con respuesta oficial</p>
            </div>
            <Button
              variant="orange"
              size="sm"
              icon={Plus}
              onClick={() => setIsPqrModalOpen(true)}
            >
              Radicar Nueva PQR
            </Button>
          </div>

          {/* List of customer's PQRs */}
          <div className="space-y-4">
            {pqrs.map((p) => (
              <div key={p._id || p.id} className="p-5 rounded-2xl border space-y-3"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10">
                      {p.radicado}
                    </span>
                    <Badge color="orange">{p.tipo}</Badge>
                    <h4 className="text-sm font-bold text-[color:var(--text-main)]">{p.asunto}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color={p.estado === 'Respondida' ? 'emerald' : p.estado === 'En Proceso' ? 'sky' : 'rose'}>
                      {p.estado}
                    </Badge>
                    <span className="text-[11px] text-slate-400">{p.fecha_creacion?.slice(0, 10)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  {p.descripcion}
                </p>

                {p.respuesta ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                    <span className="font-bold text-emerald-400 block mb-1">
                      Respuesta Oficial (por {p.atendido_por || 'Soporte MEGAPUNTO'}):
                    </span>
                    <p>{p.respuesta}</p>
                    <span className="text-[10px] text-emerald-300 block mt-1">Fecha: {p.fecha_respuesta?.slice(0, 10)}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    ⏳ Tu solicitud se encuentra en revisión por nuestro equipo de atención. Recibirás respuesta aquí pronto.
                  </p>
                )}
              </div>
            ))}

            {pqrs.length === 0 && (
              <div className="p-12 text-center text-slate-400 border rounded-2xl space-y-3" style={{ borderColor: 'var(--border-card)' }}>
                <MessageSquare className="w-10 h-10 text-orange-400 mx-auto opacity-40" />
                <p>No has radicado ninguna PQR actualmente.</p>
                <Button variant="orange" size="xs" onClick={() => setIsPqrModalOpen(true)}>
                  Crear mi primera PQR
                </Button>
              </div>
            )}
          </div>

          {/* Modal to Create PQR */}
          {isPqrModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                 onClick={() => setIsPqrModalOpen(false)}>
              <div className="w-full max-w-lg rounded-3xl border p-6 space-y-4"
                   style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                   onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-base font-black text-[color:var(--text-main)]">Radicar Nueva PQR</h3>
                  <button onClick={() => setIsPqrModalOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer">
                    <span className="text-lg">✕</span>
                  </button>
                </div>

                <form onSubmit={handleSubmitPqr} className="space-y-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Tipo de Solicitud:</label>
                    <select
                      value={newPqr.tipo}
                      onChange={(e) => setNewPqr(p => ({ ...p, tipo: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border outline-none"
                      style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                    >
                      <option value="Petición">Petición (Información / Soporte)</option>
                      <option value="Queja">Queja (Inconformidad con el servicio)</option>
                      <option value="Reclamo">Reclamo (Producto averiado o garantía)</option>
                      <option value="Sugerencia">Sugerencia (Mejora)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Asunto o Motivo:</label>
                    <Input
                      placeholder="Ej: Garantía para nevera, duda sobre factura..."
                      value={newPqr.asunto}
                      onChange={(e) => setNewPqr(p => ({ ...p, asunto: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Descripción Detallada:</label>
                    <textarea
                      rows={4}
                      value={newPqr.descripcion}
                      onChange={(e) => setNewPqr(p => ({ ...p, descripcion: e.target.value }))}
                      placeholder="Describe claramente los hechos, número de pedido o producto involucrado..."
                      className="w-full p-3 rounded-xl border outline-none text-xs"
                      style={{ background: 'var(--bg-input)', borderColor: 'var(--border-input)', color: 'var(--text-main)' }}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setIsPqrModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button variant="orange" size="sm" type="submit" icon={Send} disabled={submittingPqr}>
                      {submittingPqr ? 'Radicando...' : 'Radicar Solicitud'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: PERFIL ── */}
      {activeTab === 'perfil' && (
        <div className="space-y-4 animate-fadeIn max-w-xl">
          <div>
            <h3 className="text-base font-black text-[color:var(--text-main)]">Información de la Cuenta</h3>
            <p className="text-xs text-slate-400">Datos registrados en MEGAPUNTO para facturación y envíos</p>
          </div>

          <div className="p-5 rounded-2xl border space-y-3 text-xs"
               style={{ background: 'var(--bg-card)', borderColor: 'var(--border-card)' }}>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block font-bold">Nombre Completo</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.nombre} {currentUser?.apellido}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block font-bold">Documento de Identidad</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.tipoDocumento || 'CC'}: {currentUser?.numeroDocumento || 'No especificado'}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block font-bold">Correo Electrónico</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block font-bold">Teléfono</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.telefono || 'No registrado'}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block font-bold">Dirección de Despacho</span>
              <span className="text-sm font-bold text-[color:var(--text-main)]">{currentUser?.direccion || 'Medellín, Colombia'}</span>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
