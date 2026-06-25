"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getSolicitudesPendientes, aprobarSolicitud, rechazarSolicitud, eliminarSolicitud, crearSolicitud, Solicitud } from "@/lib/solicitudes-service";
import { getProfession, ProfessionId, PROFESSION_LIST } from "@/lib/professions";
import { PLANES } from "@/lib/super-admin-config";
import { useToast } from "@/components/saludpro/toast";
import { Bell, Check, X, Trash2, Loader2, Plus, Mail, Phone, MapPin, Clock, Sparkles } from "lucide-react";

export default function SolicitudesPage() {
  const { user } = useAuth();
  const { showToast, confirm } = useToast();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const cargar = useCallback(async () => {
    if (!user) return;
    try {
      const s = await getSolicitudesPendientes();
      setSolicitudes(s.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    } catch (e) {
      console.error("[solicitudes] error:", e);
      showToast("Error al cargar solicitudes", "error");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleAprobar = async (s: Solicitud) => {
    const ok = await confirm(`¿Aprobar solicitud de ${s.nombre}? Se creará el profesional.`);
    if (!ok) return;
    try {
      await aprobarSolicitud(s);
      showToast(`Solicitud de ${s.nombre} aprobada`, "success");
      cargar();
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleRechazar = async (s: Solicitud) => {
    const ok = await confirm(`¿Rechazar solicitud de ${s.nombre}?`);
    if (!ok) return;
    try {
      await rechazarSolicitud(s);
      showToast("Solicitud rechazada", "info");
      cargar();
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleEliminar = async (s: Solicitud) => {
    const ok = await confirm(`¿Eliminar definitivamente la solicitud de ${s.nombre}?`);
    if (!ok) return;
    try {
      await eliminarSolicitud(s.id);
      showToast("Solicitud eliminada", "info");
      cargar();
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  if (loading)
    return (
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando solicitudes...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <a href="/super-admin" className="text-sp-text2 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </a>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Solicitudes</h1>
            <p className="text-sp-text2 text-sm">{solicitudes.length} pendiente(s) de aprobación</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sp-bg text-sm"
          style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
        >
          <Plus size={16} /> Nueva solicitud
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Bell size={40} className="mx-auto text-sp-text2 mb-3" />
          <h3 className="font-display text-lg text-white mb-1">No hay solicitudes pendientes</h3>
          <p className="text-sp-text2 text-sm mb-4">Cuando alguien envíe una solicitud desde el formulario público aparecerá aquí.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10"
          >
            <Plus size={14} /> Crear solicitud de prueba
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitudes.map((s) => {
            const config = getProfession(s.profesion as ProfessionId);
            const plan = PLANES.find((p) => p.id === s.plan);
            return (
              <div key={s.id} className="glass rounded-2xl p-5 hover:border-sp-gold/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                    style={{ background: `${config.accent}20`, border: `1px solid ${config.accent}40` }}
                  >
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">{s.nombre}</h3>
                        <p className="text-xs text-sp-text2">{config.label}</p>
                      </div>
                      <span
                        className="text-[10px] px-2 py-1 rounded-full font-bold uppercase"
                        style={{ background: `${plan?.color || "#0D9488"}20`, color: plan?.color || "#0D9488" }}
                      >
                        {plan?.nombre || s.plan}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sp-text2 mb-3">
                      <div className="flex items-center gap-2"><Mail size={12} /> {s.email}</div>
                      <div className="flex items-center gap-2"><Phone size={12} /> {s.whatsapp}</div>
                      <div className="flex items-center gap-2"><MapPin size={12} /> {s.ciudad || "Sin ciudad"}</div>
                      <div className="flex items-center gap-2"><Clock size={12} /> {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</div>
                    </div>
                    {s.mensaje && (
                      <p className="text-sm text-sp-text2 italic border-l-2 border-sp-gold/30 pl-3 mb-3">"{s.mensaje}"</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAprobar(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
                      >
                        <Check size={14} /> Aprobar y crear
                      </button>
                      <button
                        onClick={() => handleRechazar(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <X size={14} /> Rechazar
                      </button>
                      <button
                        onClick={() => handleEliminar(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateSolicitudModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); cargar(); }}
        />
      )}
    </div>
  );
}

function CreateSolicitudModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { showToast } = useToast();
  const [form, setForm] = useState({ nombre: "", profesion: "enfermera", email: "", whatsapp: "", ciudad: "", plan: "trial", mensaje: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.whatsapp) {
      showToast("Completa nombre, email y WhatsApp", "error");
      return;
    }
    setSaving(true);
    try {
      await crearSolicitud(form as any);
      showToast("Solicitud creada", "success");
      onCreated();
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(6,21,32,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ background: "rgba(14,42,58,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2"><Sparkles size={18} className="text-sp-gold" /> Nueva solicitud</h3>
          <button onClick={onClose} className="text-sp-text2 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-sp-text2 mb-1 block">Nombre completo *</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Dr. Juan Pérez" />
          </div>
          <div>
            <label className="text-xs text-sp-text2 mb-1 block">Profesión *</label>
            <select value={form.profesion} onChange={(e) => setForm({ ...form, profesion: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
              {PROFESSION_LIST.map((p) => <option key={p.id} value={p.id} className="bg-sp-bg">{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">WhatsApp *</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="58412..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Ciudad</label>
              <input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Caracas" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Plan</label>
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                {PLANES.map((p) => <option key={p.id} value={p.id} className="bg-sp-bg">{p.nombre} (${p.precio})</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-sp-text2 mb-1 block">Mensaje (opcional)</label>
            <textarea value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none" placeholder="Comentarios adicionales..." />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-sp-text2 hover:text-white border border-white/10">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-sp-bg inline-flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Crear solicitud
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
