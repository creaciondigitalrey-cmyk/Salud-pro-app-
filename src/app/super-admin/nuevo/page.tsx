"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROFESSION_LIST, getProfession, ProfessionId } from "@/lib/professions";
import { PLANES } from "@/lib/super-admin-config";
import { getEstados, getMunicipios, getParroquias } from "@/lib/venezuela-geo";
import { useToast } from "@/components/saludpro/toast";
import { ArrowLeft, ArrowRight, Check, Loader2, User, Mail, Phone, MapPin, CreditCard, Sparkles, Send, Eye, Copy, MessageCircle } from "lucide-react";

interface FormData {
  profesion: ProfessionId;
  nombre: string;
  email: string;
  whatsapp: string;
  ciudad: string;
  estado: string;
  municipio: string;
  parroquia: string;
  bio: string;
  plan: "trial" | "pro" | "premium";
  slug: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

export default function NuevoProfesionalPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState("");

  const [form, setForm] = useState<FormData>({
    profesion: "enfermera",
    nombre: "",
    email: "",
    whatsapp: "",
    ciudad: "",
    estado: "",
    municipio: "",
    parroquia: "",
    bio: "",
    plan: "trial",
    slug: "",
    sendEmail: true,
    sendWhatsApp: true,
  });

  const set = (k: keyof FormData, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const generateSlug = (nombre: string) => nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const validateStep = (): string | null => {
    switch (step) {
      case 1:
        if (!form.profesion) return "Selecciona una profesión";
        return null;
      case 2:
        if (!form.nombre.trim()) return "El nombre es obligatorio";
        if (!form.email.trim()) return "El email es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email inválido";
        if (!form.whatsapp.trim()) return "El WhatsApp es obligatorio";
        return null;
      case 3:
        if (!form.plan) return "Selecciona un plan";
        return null;
      case 4:
        if (!form.slug.trim()) return "El slug es obligatorio";
        if (!/^[a-z0-9-]+$/.test(form.slug)) return "Slug: solo minúsculas, números y guiones";
        return null;
      default:
        return null;
    }
  };

  const next = () => {
    const err = validateStep();
    if (err) { showToast(err, "error"); return; }
    if (step === 2 && !form.slug) set("slug", generateSlug(form.nombre));
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Error al crear");
      setResult(data);
      setStep(6);
      showToast(`Profesional creado: ${form.nombre}`, "success");
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const config = getProfession(form.profesion);
  const estados = getEstados();
  const municipios = form.estado ? getMunicipios(form.estado) : [];
  const parroquias = form.estado && form.municipio ? getParroquias(form.estado, form.municipio) : [];

  const steps = [
    { num: 1, label: "Profesión", icon: Sparkles },
    { num: 2, label: "Datos", icon: User },
    { num: 3, label: "Plan", icon: CreditCard },
    { num: 4, label: "URL", icon: MapPin },
    { num: 5, label: "Confirmar", icon: Check },
  ];

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <a href="/super-admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Crear profesional</h1>
          <p className="text-sp-text2 text-sm">Paso {Math.min(step, 5)} de 5</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num || step === 6;
          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: isDone ? "linear-gradient(135deg, #10B981, #059669)" : isActive ? "linear-gradient(135deg, #D4AF37, #F4D88A)" : "rgba(255,255,255,0.05)",
                    color: isDone || isActive ? "#061520" : "#8B9CAD",
                    border: isActive ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {isDone ? <Check size={18} /> : <Icon size={16} />}
                </div>
                <span className={`text-[10px] ${isActive ? "text-sp-gold font-bold" : "text-sp-text2"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-2 rounded-full" style={{ background: step > s.num ? "#10B981" : "rgba(255,255,255,0.1)" }} />}
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-6">
        {/* STEP 1 - Profesión */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Selecciona la profesión</h2>
            <p className="text-sp-text2 text-sm mb-4">Esto define los servicios por defecto y la paleta de colores.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROFESSION_LIST.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("profesion", p.id)}
                  className={`p-4 rounded-xl text-left transition-all ${form.profesion === p.id ? "ring-2" : "hover:bg-white/5"}`}
                  style={{
                    background: form.profesion === p.id ? `${p.accent}15` : "rgba(255,255,255,0.03)",
                    borderColor: form.profesion === p.id ? p.accent : "rgba(255,255,255,0.05)",
                    border: "1px solid",
                    boxShadow: form.profesion === p.id ? `0 0 0 2px ${p.accent}` : "none",
                  }}
                >
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <p className="font-medium text-white text-sm">{p.label}</p>
                  <p className="text-[10px] text-sp-text2 mt-1 line-clamp-1">{p.descripcion}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 - Datos personales */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">Datos personales</h2>
              <p className="text-sp-text2 text-sm">Información básica del profesional.</p>
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Nombre completo *</label>
              <input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white" placeholder="Dr. Juan Pérez" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text2" />
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white" placeholder="email@ejemplo.com" />
                </div>
              </div>
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">WhatsApp *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text2" />
                  <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white" placeholder="58412..." />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Estado</label>
                <select value={form.estado} onChange={(e) => { set("estado", e.target.value); set("municipio", ""); set("parroquia", ""); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white">
                  <option value="" className="bg-sp-bg">Selecciona...</option>
                  {estados.map((e) => <option key={e} value={e} className="bg-sp-bg">{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Municipio</label>
                <select value={form.municipio} onChange={(e) => { set("municipio", e.target.value); set("parroquia", ""); }} disabled={!form.estado} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white disabled:opacity-50">
                  <option value="" className="bg-sp-bg">Selecciona...</option>
                  {municipios.map((m) => <option key={m} value={m} className="bg-sp-bg">{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Parroquia</label>
                <select value={form.parroquia} onChange={(e) => set("parroquia", e.target.value)} disabled={!form.municipio} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white disabled:opacity-50">
                  <option value="" className="bg-sp-bg">Selecciona...</option>
                  {parroquias.map((p) => <option key={p} value={p} className="bg-sp-bg">{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Ciudad / Localidad</label>
              <input value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white" placeholder="Ej: Urb. Los Rosales" />
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Bio (opcional)</label>
              <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white resize-none" placeholder="Breve descripción profesional..." />
            </div>
          </div>
        )}

        {/* STEP 3 - Plan */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Selecciona el plan</h2>
            <p className="text-sp-text2 text-sm mb-4">El plan define los límites del portafolio.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PLANES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => set("plan", p.id)}
                  className={`p-5 rounded-xl text-left transition-all ${form.plan === p.id ? "ring-2" : ""}`}
                  style={{
                    background: form.plan === p.id ? `${p.color}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${form.plan === p.id ? p.color : "rgba(255,255,255,0.05)"}`,
                    boxShadow: form.plan === p.id ? `0 0 0 2px ${p.color}` : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg font-bold text-white">{p.nombre}</h3>
                    {form.plan === p.id && <Check size={18} style={{ color: p.color }} />}
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">${p.precio}<span className="text-xs text-sp-text2 font-normal">/{p.duracion}</span></p>
                  <ul className="text-xs text-sp-text2 space-y-1 mt-3">
                    {p.caracteristicas.map((c, i) => <li key={i} className="flex items-start gap-1.5"><Check size={12} className="mt-0.5 flex-shrink-0" style={{ color: p.color }} /> {c}</li>)}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 - URL */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">URL del portafolio</h2>
              <p className="text-sp-text2 text-sm">Esta será la dirección pública del profesional.</p>
            </div>
            <div>
              <label className="text-xs text-sp-text2 mb-1 block">Slug *</label>
              <div className="flex items-center gap-2">
                <span className="text-sp-text2 text-sm">/c/</span>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono" placeholder="juan-perez" />
              </div>
              <p className="text-xs text-sp-text2 mt-2">URL final: <span className="text-sp-gold font-mono">/c/{form.slug || "..."}</span></p>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-sp-text2 block">Credenciales automáticas</label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <input type="checkbox" id="sendEmail" checked={form.sendEmail} onChange={(e) => set("sendEmail", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
                <label htmlFor="sendEmail" className="text-sm text-white flex-1 cursor-pointer">Enviar email de bienvenida con enlace para cambiar contraseña</label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <input type="checkbox" id="sendWhatsApp" checked={form.sendWhatsApp} onChange={(e) => set("sendWhatsApp", e.target.checked)} className="w-4 h-4 accent-sp-gold" />
                <label htmlFor="sendWhatsApp" className="text-sm text-white flex-1 cursor-pointer">Enviar credenciales por WhatsApp</label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 - Confirmar */}
        {step === 5 && (
          <div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Confirma los datos</h2>
            <p className="text-sp-text2 text-sm mb-4">Revisa antes de crear el profesional.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `${config.accent}15`, border: `1px solid ${config.accent}40` }}>
                <div className="text-3xl">{config.emoji}</div>
                <div>
                  <p className="text-white font-medium">{config.label}</p>
                  <p className="text-xs text-sp-text2">{config.descripcion}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <Row label="Nombre" value={form.nombre} />
                <Row label="Email" value={form.email} />
                <Row label="WhatsApp" value={form.whatsapp} />
                <Row label="Plan" value={PLANES.find((p) => p.id === form.plan)?.nombre || form.plan} />
                <Row label="Ubicación" value={[form.estado, form.municipio, form.parroquia].filter(Boolean).join(", ") || "—"} />
                <Row label="URL" value={`/c/${form.slug}`} mono />
              </div>
              {form.bio && <div className="p-3 rounded-lg bg-white/5 border border-white/10"><p className="text-xs text-sp-text2 mb-1">Bio:</p><p className="text-sm text-white">{form.bio}</p></div>}
              <div className="flex gap-3 text-xs text-sp-text2 pt-2">
                <span className={form.sendEmail ? "text-green-400" : ""}>{form.sendEmail ? "✓" : "✗"} Email de bienvenida</span>
                <span className={form.sendWhatsApp ? "text-green-400" : ""}>{form.sendWhatsApp ? "✓" : "✗"} WhatsApp</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 - Resultado */}
        {step === 6 && result && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
              <Check size={32} className="text-green-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">¡Profesional creado!</h2>
            <p className="text-sp-text2 text-sm mb-6">{form.nombre} ya tiene su portafolio activo.</p>
            <div className="max-w-md mx-auto space-y-2 text-left">
              <ResultRow label="Email" value={form.email} copied={copied === "email"} onCopy={() => copyToClipboard(form.email, "email")} />
              <ResultRow label="Contraseña" value={result.password} copied={copied === "pwd"} onCopy={() => copyToClipboard(result.password, "pwd")} />
              <ResultRow label="URL portafolio" value={`${window.location.origin}/c/${form.slug}`} copied={copied === "url"} onCopy={() => copyToClipboard(`${window.location.origin}/c/${form.slug}`, "url")} />
              <ResultRow label="Login" value={`${window.location.origin}/admin/login`} copied={copied === "login"} onCopy={() => copyToClipboard(`${window.location.origin}/admin/login`, "login")} />
            </div>
            {result.whatsappUrl && (
              <a href={result.whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#25D366" }}>
                <MessageCircle size={16} /> Enviar credenciales por WhatsApp
              </a>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <a href={`/c/${form.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10">
                <Eye size={14} /> Ver portafolio
              </a>
              <button onClick={() => router.push("/super-admin/profesionales")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
                Ir a profesionales
              </button>
            </div>
          </div>
        )}

        {/* NAV */}
        {step < 6 && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
            <button onClick={back} disabled={step === 1} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-sp-text2 hover:text-white border border-white/10 disabled:opacity-30">
              <ArrowLeft size={16} /> Atrás
            </button>
            <div className="flex-1" />
            {step < 5 ? (
              <button onClick={next} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-sp-bg" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
                Siguiente <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Crear profesional
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <p className="text-[10px] uppercase text-sp-text2 mb-0.5">{label}</p>
      <p className={`text-sm text-white truncate ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
    </div>
  );
}

function ResultRow({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase text-sp-text2">{label}</p>
        <p className="text-sm text-white font-mono truncate">{value}</p>
      </div>
      <button onClick={onCopy} className="p-2 rounded-lg text-sp-text2 hover:text-white hover:bg-white/5">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
