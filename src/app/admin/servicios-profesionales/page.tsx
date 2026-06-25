"use client";
import { useState } from "react";
import { useProfessionalData } from "@/lib/use-professional-data";
import { getProfession } from "@/lib/professions";
import { useToast } from "@/components/saludpro/toast";
import { uploadProfessionalImage } from "@/lib/professionals-service";
import { Plus, Edit2, Trash2, Loader2, Save, X, Sparkles, Upload, ImageIcon, DollarSign, Tag, Check, Wand2 } from "lucide-react";
import { CatalogItem } from "@/lib/types";

export default function CatalogoPage() {
  const { professional, loading, saving, guardar } = useProfessionalData();
  const { showToast, confirm } = useToast();
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [creating, setCreating] = useState(false);

  if (loading) return <Loader />;
  if (!professional) return <NoProfile />;

  const config = getProfession(professional.profesion);
  const accent = professional.colorAccent || config.accent;
  const catalogo = professional.catalogo || [];

  const handleSave = async (item: CatalogItem) => {
    let nuevos: CatalogItem[];
    if (editing) {
      nuevos = catalogo.map((c) => (c.id === item.id ? item : c));
    } else {
      nuevos = [...catalogo, { ...item, id: `cat-${Date.now()}` }];
    }
    const ok = await guardar({ catalogo: nuevos });
    if (ok) {
      showToast(editing ? "Item actualizado" : "Item creado", "success");
      setEditing(null);
      setCreating(false);
    } else {
      showToast("Error al guardar", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm("¿Eliminar este item del catálogo?");
    if (!ok) return;
    const nuevos = catalogo.filter((c) => c.id !== id);
    if (await guardar({ catalogo: nuevos })) {
      showToast("Item eliminado", "info");
    }
  };

  const handleToggle = async (id: string) => {
    const nuevos = catalogo.map((c) => c.id === id ? { ...c, activo: !c.activo } : c);
    if (await guardar({ catalogo: nuevos })) {
      showToast("Estado actualizado", "success");
    }
  };

  return (
    <div className="max-w-5xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sp-text2 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </a>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Mi Catálogo</h1>
            <p className="text-sp-text2 text-sm">{catalogo.length} item(s) · {catalogo.filter(c => c.activo).length} visibles</p>
          </div>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sp-bg text-sm"
          style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
        >
          <Plus size={16} /> Nuevo item
        </button>
      </div>

      {catalogo.length === 0 && !creating && (
        <div className="glass rounded-2xl p-12 text-center">
          <ImageIcon size={40} className="mx-auto text-sp-text2 mb-3" />
          <h3 className="font-display text-lg text-white mb-1">Tu catálogo está vacío</h3>
          <p className="text-sp-text2 text-sm mb-4">Muestra tu trabajo con fotos profesional. Cada item aparece como una tarjeta en tu portafolio.</p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10"
          >
            <Plus size={14} /> Crear primer item
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {catalogo.map((c) => (
          <div key={c.id} className="glass rounded-2xl overflow-hidden hover-lift">
            <div className="aspect-video relative" style={{ background: `${accent}10` }}>
              {c.fotoDespuesUrl || c.fotoAntesUrl ? (
                <img src={c.fotoDespuesUrl || c.fotoAntesUrl} alt={c.titulo} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={32} className="text-sp-text2/30" />
                </div>
              )}
              <span
                className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full font-bold uppercase cursor-pointer"
                style={{
                  background: c.activo ? "rgba(16,185,129,0.9)" : "rgba(107,114,128,0.9)",
                  color: "white",
                }}
                onClick={() => handleToggle(c.id)}
              >
                {c.activo ? "Activo" : "Pausado"}
              </span>
              {c.iaGenerated && (
                <span
                  className="absolute bottom-2 left-2 text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-0.5"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", color: "#061520" }}
                >
                  <Sparkles size={8} /> IA
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-bold text-white mb-1">{c.titulo}</h3>
              <p className="text-xs text-sp-text2 line-clamp-2 mb-2">{c.descripcion}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {c.precio && <span className="text-xs text-sp-gold font-semibold">${c.precio}</span>}
                  {c.duracion && <span className="text-xs text-sp-text2">{c.duracion}</span>}
                  {c.tags.slice(0, 2).map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-sp-text2">#{t}</span>)}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(c); setCreating(false); }} className="p-1.5 rounded-lg text-sp-text2 hover:text-white hover:bg-white/5">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <CatalogoModal
          item={editing}
          accent={accent}
          profesion={professional.profesion}
          profesionLabel={config.label}
          profesionalId={professional.id}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function CatalogoModal({ item, accent, profesion, profesionLabel, profesionalId, onClose, onSave, saving }: {
  item: CatalogItem | null;
  accent: string;
  profesion: string;
  profesionLabel: string;
  profesionalId: string;
  onClose: () => void;
  onSave: (c: CatalogItem) => void;
  saving: boolean;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState<CatalogItem>(
    item || {
      id: "",
      titulo: "",
      descripcion: "",
      fotoAntesUrl: undefined,
      fotoDespuesUrl: undefined,
      precio: undefined,
      duracion: undefined,
      tags: [],
      activo: true,
    }
  );
  const [improving, setImproving] = useState(false);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = (k: keyof CatalogItem, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleImprove = async () => {
    if (!form.titulo.trim()) {
      showToast("Escribe un título primero", "error");
      return;
    }
    setImproving(true);
    try {
      const res = await fetch("/api/ai-improve-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: form.titulo, descripcion: form.descripcion, profesion: profesionLabel }),
      });
      const data = await res.json();
      if (data.ok) {
        set("descripcion", data.descripcion);
        showToast("Descripción mejorada con IA", "success");
      } else if (data.iaDisabled) {
        showToast("IA: " + data.error, "info");
      } else {
        showToast("Error: " + data.error, "error");
      }
    } catch {
      showToast("Error de red", "error");
    } finally {
      setImproving(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!form.titulo.trim()) {
      showToast("Escribe un título primero para generar la imagen", "error");
      return;
    }
    setGeneratingImg(true);
    showToast("Generando imagen con IA... esto puede tomar 10-15 segundos", "info");
    try {
      const res = await fetch("/api/ai-generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: form.titulo, descripcion: form.descripcion, profesion, profesionalId }),
      });
      const data = await res.json();
      if (data.ok) {
        set("fotoDespuesUrl", data.imagen);
        set("iaGenerated", true);
        set("iaGeneratedAt", Date.now());
        showToast("¡Imagen generada con IA! Guárdala para verla en tu portafolio.", "success");
      } else if (data.iaDisabled) {
        showToast("IA: " + data.error, "info");
      } else if (data.cuotaAgotada) {
        showToast("Cuota IA agotada: " + data.error, "error");
      } else {
        showToast("Error: " + data.error, "error");
      }
    } catch {
      showToast("Error de red", "error");
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>, tipo: "antes" | "despues") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFoto(true);
    try {
      const url = await uploadProfessionalImage(file);
      if (tipo === "antes") set("fotoAntesUrl", url);
      else set("fotoDespuesUrl", url);
      showToast("Foto subida", "success");
    } catch (err: any) {
      showToast("Error: " + err.message, "error");
    } finally {
      setUploadingFoto(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => set("tags", form.tags.filter((x) => x !== t));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) { showToast("Título requerido", "error"); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(6,21,32,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto" style={{ background: "rgba(14,42,58,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-white">{item ? "Editar item" : "Nuevo item del catálogo"}</h3>
          <button onClick={onClose} className="text-sp-text2 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-sp-text2 mb-1 block">Título *</label>
            <input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} className="input-sp" placeholder="Ej: Inyección intramuscular" autoFocus />
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
            <textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} rows={3} className="input-sp resize-none" placeholder="Describe el servicio, qué incluye, condiciones..." />
            <p className="text-[10px] text-sp-text2 mt-1">✨ La IA mejora tu texto gratis para hacerlo más profesional.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-sp-text2 flex items-center gap-1"><Upload size={10} /> Foto principal</label>
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={generatingImg}
                  className="inline-flex items-center gap-1 text-[10px] text-sp-gold hover:text-white px-2 py-0.5 rounded-full border border-sp-gold/30 hover:bg-sp-gold/10 disabled:opacity-50"
                >
                  {generatingImg ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                  {generatingImg ? "Generando..." : "Generar con IA"}
                </button>
              </div>
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => handleUploadFoto(e, "despues")} className="hidden" id="upload-despues" disabled={uploadingFoto || generatingImg} />
                <label htmlFor="upload-despues" className="block aspect-video rounded-lg cursor-pointer flex items-center justify-center relative" style={{ background: `${accent}10`, border: `1px dashed ${accent}40` }}>
                  {form.fotoDespuesUrl ? (
                    <>
                      <img src={form.fotoDespuesUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                      {form.iaGenerated && (
                        <span className="absolute top-1 right-1 text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", color: "#061520" }}>
                          ✨ IA
                        </span>
                      )}
                    </>
                  ) : uploadingFoto ? (
                    <Loader2 size={20} className="animate-spin text-sp-gold" />
                  ) : generatingImg ? (
                    <div className="text-center px-2">
                      <Loader2 size={20} className="animate-spin text-sp-gold mx-auto mb-1" />
                      <p className="text-[9px] text-sp-text2">Generando con IA...</p>
                    </div>
                  ) : (
                    <Upload size={20} className="text-sp-text2" />
                  )}
                </label>
              </div>
              <p className="text-[10px] text-sp-text2 mt-1">Sube foto o genera con IA según tu plan.</p>
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block flex items-center gap-1"><Upload size={10} /> Foto "antes" (opcional)</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => handleUploadFoto(e, "antes")} className="hidden" id="upload-antes" disabled={uploadingFoto} />
                <label htmlFor="upload-antes" className="block aspect-video rounded-lg cursor-pointer flex items-center justify-center" style={{ background: `${accent}10`, border: `1px dashed ${accent}40` }}>
                  {form.fotoAntesUrl ? (
                    <img src={form.fotoAntesUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : uploadingFoto ? (
                    <Loader2 size={20} className="animate-spin text-sp-gold" />
                  ) : (
                    <Upload size={20} className="text-sp-text2" />
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-sp-text2 mb-1 block flex items-center gap-1"><DollarSign size={10} /> Precio (opcional)</label>
              <input type="number" min="0" step="0.01" value={form.precio ?? ""} onChange={(e) => set("precio", e.target.value ? Number(e.target.value) : undefined)} className="input-sp" placeholder="15" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Duración (opcional)</label>
              <input value={form.duracion ?? ""} onChange={(e) => set("duracion", e.target.value || undefined)} className="input-sp" placeholder="30 min" />
            </div>
          </div>

          <div>
            <label className="text-xs text-sp-text2 mb-1 block flex items-center gap-1"><Tag size={10} /> Etiquetas</label>
            <div className="flex gap-2 mb-1">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="input-sp flex-1" placeholder="domicilio, urgencias..." />
              <button type="button" onClick={addTag} className="px-3 rounded-lg text-sm text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}><Plus size={14} /></button>
            </div>
            <div className="flex flex-wrap gap-1">
              {form.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 text-sp-text2 flex items-center gap-1">
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="text-sp-text2 hover:text-red-400"><X size={10} /></button>
                </span>
              ))}
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
  return <div className="max-w-5xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" /><p className="text-sp-text2 text-sm">Cargando catálogo...</p></div></div>;
}
function NoProfile() {
  return <div className="max-w-5xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><p className="text-sp-text2 text-sm">No se encontró tu perfil.</p></div></div>;
}
