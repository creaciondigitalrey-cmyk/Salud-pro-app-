"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPublishedProfessionals } from "@/lib/professionals-service";
import { useToast } from "@/components/saludpro/toast";
import { Mail, Send, Loader2, Check, Users, Eye, X } from "lucide-react";

export default function EmailMasivoPage() {
  const { user } = useAuth();
  const { showToast, confirm } = useToast();
  const [profs, setProfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [filter, setFilter] = useState<"all" | "trial" | "pro" | "premium">("all");

  useEffect(() => {
    const cargar = async () => {
      if (!user) return;
      try {
        const list = await getPublishedProfessionals();
        setProfs(list);
      } catch (e: any) {
        showToast("Error: " + e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user, showToast]);

  const filtered = profs.filter((p) => filter === "all" || p.plan === filter);

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleSend = async () => {
    if (selected.size === 0) { showToast("Selecciona al menos un destinatario", "error"); return; }
    if (!asunto.trim() || !mensaje.trim()) { showToast("Completa asunto y mensaje", "error"); return; }
    const ok = await confirm(`¿Enviar email a ${selected.size} profesional(es)?`);
    if (!ok) return;
    setSending(true);
    // Demo: simular envío
    setTimeout(() => {
      setSending(false);
      showToast(`Email enviado a ${selected.size} destinatarios (demo)`, "success");
      setAsunto(""); setMensaje(""); setSelected(new Set());
    }, 1500);
  };

  const preview = mensaje.replace(/\{nombre\}/g, "Dr. Juan Pérez").replace(/\{plan\}/g, "Pro");

  if (loading)
    return (
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <a href="/super-admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Email Masivo</h1>
          <p className="text-sp-text2 text-sm">Comunica novedades a tus profesionales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compositor */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2"><Users size={18} /> Destinatarios</h2>
            <div className="flex gap-1 mb-3 flex-wrap">
              {[{ k: "all", l: "Todos" }, { k: "trial", l: "Trial" }, { k: "pro", l: "Pro" }, { k: "premium", l: "Premium" }].map((f) => (
                <button key={f.k} onClick={() => setFilter(f.k as any)} className={`px-3 py-1 rounded-lg text-xs font-medium ${filter === f.k ? "text-sp-bg" : "text-sp-text2 border border-white/10"}`} style={filter === f.k ? { background: "linear-gradient(135deg, #D4AF37, #F4D88A)" } : {}}>
                  {f.l}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-sp-text2">{filtered.length} profesionales · {selected.size} seleccionados</span>
              <button onClick={toggleAll} className="text-xs text-sp-gold hover:underline">{selected.size === filtered.length ? "Quitar todos" : "Seleccionar todos"}</button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {filtered.map((p) => (
                <label key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="w-4 h-4 accent-sp-gold" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.nombre}</p>
                    <p className="text-xs text-sp-text2 truncate">{p.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full uppercase" style={{ background: p.plan === "premium" ? "#06B6D420" : p.plan === "pro" ? "#D4AF3720" : "#0D948820", color: p.plan === "premium" ? "#06B6D4" : p.plan === "pro" ? "#D4AF37" : "#0D9488" }}>{p.plan}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2"><Mail size={18} /> Mensaje</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Asunto *</label>
                <input value={asunto} onChange={(e) => setAsunto(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" placeholder="Novedades de SaludPro" />
              </div>
              <div>
                <label className="text-xs text-sp-text2 mb-1 block">Mensaje *</label>
                <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={8} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none" placeholder="Hola {nombre},&#10;&#10;..." />
                <p className="text-[10px] text-sp-text2 mt-1">Variables: <code className="text-sp-gold">{"{nombre}"}</code>, <code className="text-sp-gold">{"{plan}"}</code></p>
              </div>
              <button onClick={handleSend} disabled={sending || selected.size === 0} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", color: "#061520" }}>
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Enviar a {selected.size} destinatario(s)
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="glass rounded-2xl p-5 lg:sticky lg:top-4 h-fit">
          <h2 className="font-display text-lg font-semibold text-white mb-3 flex items-center gap-2"><Eye size={18} /> Vista previa</h2>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <div className="p-3 border-b border-white/10 bg-white/5">
              <p className="text-xs text-sp-text2">Para: <span className="text-white">Dr. Juan Pérez</span></p>
              <p className="text-xs text-sp-text2">Asunto: <span className="text-white">{asunto || "(sin asunto)"}</span></p>
            </div>
            <div className="p-4 bg-white/2 min-h-[200px]">
              <pre className="text-sm text-white whitespace-pre-wrap font-sans">{preview || "(escribe tu mensaje para ver la vista previa)"}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
