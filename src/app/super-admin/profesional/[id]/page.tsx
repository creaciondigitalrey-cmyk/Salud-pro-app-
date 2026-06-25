"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProfession, ProfessionId, PROFESSION_LIST } from "@/lib/professions";
import { PLANES } from "@/lib/super-admin-config";
import { getEstados, getMunicipios, getParroquias } from "@/lib/venezuela-geo";
import { useToast } from "@/components/saludpro/toast";
import { ArrowLeft, Loader2, Check, Briefcase, CreditCard, ExternalLink, Trash2, Save, User, MapPin, Phone, Eye, MessageCircle } from "lucide-react";

export default function EditarProfesionalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast, confirm } = useToast();
  const [prof, setProf] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      if (!params.id) return;
      try {
        const res = await fetch(`/api/professional?id=${params.id}`);
        if (res.ok) {
          const d = await res.json();
          if (d.ok) {
            setProf(d.professional);
            setForm({
              nombre: d.professional.nombre || "",
              email: d.professional.email || "",
              whatsapp: d.professional.whatsapp || "",
              telefono: d.professional.telefono || "",
              profesion: d.professional.profesion || "enfermera",
              especialidad: d.professional.especialidad || "",
              bio: d.professional.bio || "",
              slug: d.professional.slug || "",
              ciudad: d.professional.ciudad || "",
              estado: d.professional.estado || "",
              municipio: d.professional.municipio || "",
              parroquia: d.professional.parroquia || "",
              direccion: d.professional.direccion || "",
              plan: d.professional.plan || "trial",
              horarioTexto: d.professional.horarioTexto || "",
              activo: d.professional.activo ?? true,
              verificado: d.professional.verificado ?? false,
              suscripcionSuspendida: d.professional.suscripcionSuspendida ?? false,
            });
          }
        }
      } catch (e) {
        console.error("[editar] error:", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [params.id]);

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/update-professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, data: form }),
      });
      const d = await res.json();
      if (!d.ok) throw new Error(d.error || "Error");
      showToast("Cambios guardados", "success");
      setProf({ ...prof, ...form });
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!prof) return;
    const ok = await confirm(`¿ELIMINAR definitivamente a ${prof.nombre}? Esta acción no se puede deshacer.`);
    if (!ok) return;
    const ok2 = await confirm(`Confirma una vez más: eliminar a ${prof.nombre}.`);
    if (!ok2) return;
    try {
      const res = await fetch("/api/update-professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, data: { activo: false, suscripcionSuspendida: true, deletedAt: new Date() } }),
      });
      showToast("Profesional desactivado", "info");
      router.push("/super-admin/profesionales");
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  const copyCreds = () => {
    const txt = `Nombre: ${form.nombre}\nEmail: ${form.email}\nURL: ${window.location.origin}/c/${form.slug}\nLogin: ${window.location.origin}/admin/login`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    showToast("Datos copiados", "success");
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando...</p>
        </div>
      </div>
    );

  if (!prof)
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-sp-text2">No encontrado.</p>
          <a href="/super-admin/profesionales" className="text-sp-gold mt-4 inline-block">← Volver</a>
        </div>
      </div>
    );

  const config = getProfession(form.profesion as ProfessionId);
  const accent = prof.colorAccent || config.accent;
  const estados = getEstados();
  const municipios = form.estado ? getMunicipios(form.estado) : [];
  const parroquias = form.estado && form.municipio ? getParroquias(form.estado, form.municipio) : [];
  const planConfig = PLANES.find((p) => p.id === form.plan);

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-2">
        <a href="/super-admin/profesionales" className="text-sp-text2 hover:text-white"><ArrowLeft size={20} /></a>
        <h1 className="font-display text-3xl font-bold text-white">Editar profesional</h1>
      </div>

      {/* Header card */}
      <div className="flex items-center gap-4 mb-6 mt-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${accent}30`, border: `1px solid ${accent}40` }}>
          {prof.fotoUrl ? <img src={prof.fotoUrl} alt="" className="w-full h-full object-cover rounded-2xl" /> : <span className="font-display text-2xl font-bold" style={{ color: accent }}>{(form.nombre || "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold text-white">{form.nombre}</h2>
          <p className="text-sm text-sp-text2">{config.label} · {form.email}</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {form.slug && <a href={`/c/${form.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-sp-teal-light flex items-center gap-1"><ExternalLink size={10} /> Ver portafolio</a>}
            <button onClick={copyCreds} className="text-xs text-sp-gold flex items-center gap-1">{copied ? <Check size={10} /> : <Phone size={10} />} Copiar datos</button>
          </div>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase" style={{ background: `${planConfig?.color}20`, color: planConfig?.color }}>{planConfig?.nombre}</span>
      </div>

      {/* Datos personales */}
      <div className="glass rounded-2xl p-6 mb-4">
        <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><User size={18} /> Datos personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Nombre completo"><input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className="input-sp" /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input-sp" /></Field>
          <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="input-sp" /></Field>
          <Field label="Teléfono (fijo)"><input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className="input-sp" /></Field>
          <Field label="Profesión">
            <select value={form.profesion} onChange={(e) => set("profesion", e.target.value)} className="input-sp">
              {PROFESSION_LIST.map((p) => <option key={p.id} value={p.id} className="bg-sp-bg">{p.emoji} {p.label}</option>)}
            </select>
          </Field>
          <Field label="Especialidad"><input value={form.especialidad} onChange={(e) => set("especialidad", e.target.value)} className="input-sp" /></Field>
        </div>
        <div className="mt-3">
          <Field label="Bio"><textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className="input-sp resize-none" /></Field>
        </div>
      </div>

      {/* Ubicación */}
      <div className="glass rounded-2xl p-6 mb-4">
        <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><MapPin size={18} /> Ubicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Estado">
            <select value={form.estado} onChange={(e) => { set("estado", e.target.value); set("municipio", ""); set("parroquia", ""); }} className="input-sp">
              <option value="" className="bg-sp-bg">Selecciona...</option>
              {estados.map((e) => <option key={e} value={e} className="bg-sp-bg">{e}</option>)}
            </select>
          </Field>
          <Field label="Municipio">
            <select value={form.municipio} onChange={(e) => { set("municipio", e.target.value); set("parroquia", ""); }} disabled={!form.estado} className="input-sp disabled:opacity-50">
              <option value="" className="bg-sp-bg">Selecciona...</option>
              {municipios.map((m) => <option key={m} value={m} className="bg-sp-bg">{m}</option>)}
            </select>
          </Field>
          <Field label="Parroquia">
            <select value={form.parroquia} onChange={(e) => set("parroquia", e.target.value)} disabled={!form.municipio} className="input-sp disabled:opacity-50">
              <option value="" className="bg-sp-bg">Selecciona...</option>
              {parroquias.map((p) => <option key={p} value={p} className="bg-sp-bg">{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <Field label="Ciudad / Localidad"><input value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} className="input-sp" /></Field>
          <Field label="Dirección"><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className="input-sp" /></Field>
        </div>
        <div className="mt-3">
          <Field label="URL del portafolio (slug)">
            <div className="flex items-center gap-2">
              <span className="text-sp-text2 text-sm">/c/</span>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="input-sp flex-1 font-mono" />
            </div>
          </Field>
        </div>
      </div>

      {/* Plan y estado */}
      <div className="glass rounded-2xl p-6 mb-4">
        <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><CreditCard size={18} /> Plan y Estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Plan">
            <select value={form.plan} onChange={(e) => set("plan", e.target.value)} className="input-sp">
              {PLANES.map((p) => <option key={p.id} value={p.id} className="bg-sp-bg">{p.nombre} (${p.precio})</option>)}
            </select>
          </Field>
          <Field label="Horario"><input value={form.horarioTexto} onChange={(e) => set("horarioTexto", e.target.value)} className="input-sp" /></Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => set("activo", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
            <span className="text-sm text-white">Cuenta activa</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
            <input type="checkbox" checked={form.verificado} onChange={(e) => set("verificado", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
            <span className="text-sm text-white">Verificado ✓</span>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
            <input type="checkbox" checked={form.suscripcionSuspendida} onChange={(e) => set("suscripcionSuspendida", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
            <span className="text-sm text-white">Suspendido</span>
          </label>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col md:flex-row gap-3">
        <button onClick={handleSave} disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar cambios
        </button>
        <button onClick={() => router.push("/super-admin/profesionales")} className="px-4 py-3 rounded-xl text-sm font-medium text-sp-text2 hover:text-white border border-white/10">
          Cancelar
        </button>
        <button onClick={handleDelete} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10">
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-sp-text2 mb-1 block">{label}</label>
      {children}
    </div>
  );
}
