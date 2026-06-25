"use client";
import { useState } from "react";
import { useProfessionalData } from "@/lib/use-professional-data";
import { getProfession } from "@/lib/professions";
import { useToast } from "@/components/saludpro/toast";
import { Plus, Edit2, Trash2, Loader2, Save, X, Sparkles, DollarSign, Clock, Check } from "lucide-react";
import { Service } from "@/lib/types";

export default function ServiciosPage() {
  const { professional, loading, saving, guardar } = useProfessionalData();
  const { showToast, confirm } = useToast();
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  if (loading) return <Loader />;
  if (!professional) return <NoProfile />;

  const config = getProfession(professional.profesion);
  const accent = professional.colorAccent || config.accent;
  const servicios = professional.servicios || [];

  const handleSave = async (servicio: Service) => {
    let nuevos: Service[];
    if (editing) {
      nuevos = servicios.map((s) => (s.id === servicio.id ? servicio : s));
    } else {
      nuevos = [...servicios, { ...servicio, id: `srv-${Date.now()}` }];
    }
    const ok = await guardar({ servicios: nuevos });
    if (ok) {
      showToast(editing ? "Servicio actualizado" : "Servicio creado", "success");
      setEditing(null);
      setCreating(false);
    } else {
      showToast("Error al guardar", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm("¿Eliminar este servicio?");
    if (!ok) return;
    const nuevos = servicios.filter((s) => s.id !== id);
    if (await guardar({ servicios: nuevos })) {
      showToast("Servicio eliminado", "info");
    }
  };

  const handleToggle = async (id: string) => {
    const nuevos = servicios.map((s) => s.id === id ? { ...s, activo: !s.activo } : s);
    if (await guardar({ servicios: nuevos })) {
      showToast("Estado actualizado", "success");
    }
  };

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sp-text2 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </a>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Mis Servicios</h1>
            <p className="text-sp-text2 text-sm">{servicios.length} servicio(s) · {servicios.filter(s => s.activo).length} activos</p>
          </div>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sp-bg text-sm"
          style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {servicios.length === 0 && !creating && (
        <div className="glass rounded-2xl p-12 text-center">
          <Plus size={40} className="mx-auto text-sp-text2 mb-3" />
          <h3 className="font-display text-lg text-white mb-1">No tienes servicios aún</h3>
          <p className="text-sp-text2 text-sm mb-4">Agrega tu primer servicio para que aparezca en tu portafolio.</p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10"
          >
            <Plus size={14} /> Crear servicio
          </button>
        </div>
      )}

      <div className="space-y-3">
        {servicios.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg font-bold text-white">{s.nombre}</h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer"
                    style={{
                      background: s.activo ? "#10B98120" : "#6B728020",
                      color: s.activo ? "#10B981" : "#9CA3AF",
                    }}
                    onClick={() => handleToggle(s.id)}
                  >
                    {s.activo ? "Activo" : "Pausado"}
                  </span>
                </div>
                <p className="text-sm text-sp-text2 mb-2">{s.descripcion}</p>
                <div className="flex items-center gap-4 text-xs text-sp-text2">
                  <span className="flex items-center gap-1"><DollarSign size={11} />${s.precio} {s.unidad || "USD"}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{s.duracion}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(s); setCreating(false); }} className="p-2 rounded-lg text-sp-text2 hover:text-white hover:bg-white/5">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <ServicioModal
          servicio={editing}
          accent={accent}
          profesion={config.label}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function ServicioModal({ servicio, accent, profesion, onClose, onSave, saving }: {
  servicio: Service | null;
  accent: string;
  profesion: string;
  onClose: () => void;
  onSave: (s: Service) => void;
  saving: boolean;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState<Service>(
    servicio || {
      id: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      duracion: "30 min",
      unidad: "USD",
      activo: true,
    }
  );
  const [improving, setImproving] = useState(false);

  const set = (k: keyof Service, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleImprove = async () => {
    if (!form.nombre.trim()) {
      showToast("Escribe un título primero", "error");
      return;
    }
    setImproving(true);
    try {
      const res = await fetch("/api/ai-improve-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: form.nombre, descripcion: form.descripcion, profesion }),
      });
      const data = await res.json();
      if (data.ok) {
        set("descripcion", data.descripcion);
        showToast("Descripción mejorada con IA", "success");
      } else if (data.iaDisabled) {
        showToast("IA no configurada todavía — funciona igual sin ella", "info");
      } else {
        showToast("Error: " + data.error, "error");
      }
    } catch (e: any) {
      showToast("Error de red", "error");
    } finally {
      setImproving(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) { showToast("Nombre requerido", "error"); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(6,21,32,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" style={{ background: "rgba(14,42,58,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-white">{servicio ? "Editar servicio" : "Nuevo servicio"}</h3>
          <button onClick={onClose} className="text-sp-text2 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-sp-text2 mb-1 block">Nombre *</label>
            <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className="input-sp" placeholder="Ej: Inyección intramuscular a domicilio" autoFocus />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-sp-text2">Descripción</label>
              <button
                type="button"
                onClick={handleImprove}
                disabled={improving}
                className="inline-flex items-center gap-1 text-[10px] text-sp-gold hover:text-white px-2 py-0.5 rounded-full border border-sp-gold/30 hover:bg-sp-gold/10 disabled:opacity-50"
              >
                {improving ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                {improving ? "Mejorando..." : "Mejorar con IA"}
              </button>
            </div>
            <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} rows={3} className="input-sp resize-none" placeholder="Describe el servicio, beneficios y condiciones..." />
            <p className="text-[10px] text-sp-text2 mt-1">✨ La IA mejora tu texto para hacerlo más profesional y atractivo. Gratis.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Precio</label>
              <input type="number" min="0" step="0.01" value={form.precio} onChange={(e) => set("precio", Number(e.target.value))} className="input-sp" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Moneda</label>
              <select value={form.unidad || "USD"} onChange={(e) => set("unidad", e.target.value)} className="input-sp">
                <option value="USD" className="bg-sp-bg">USD</option>
                <option value="Bs" className="bg-sp-bg">Bs</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Duración</label>
              <input value={form.duracion} onChange={(e) => set("duracion", e.target.value)} className="input-sp" placeholder="30 min" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5">
            <input type="checkbox" checked={form.activo} onChange={(e) => set("activo", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
            <span className="text-sm text-white">Activo (visible en el portafolio)</span>
          </label>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-sp-text2 hover:text-white border border-white/10">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-sp-bg inline-flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Loader() {
  return <div className="max-w-4xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" /><p className="text-sp-text2 text-sm">Cargando...</p></div></div>;
}
function NoProfile() {
  return <div className="max-w-4xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><p className="text-sp-text2 text-sm">No se encontró tu perfil.</p></div></div>;
}
