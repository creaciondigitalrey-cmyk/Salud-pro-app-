"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPublishedProfessionals } from "@/lib/professionals-service";
import { PLANES } from "@/lib/super-admin-config";
import { useToast } from "@/components/saludpro/toast";
import { CreditCard, DollarSign, Clock, CheckCircle2, AlertTriangle, Loader2, Search, X, Check } from "lucide-react";

export default function PagosPage() {
  const { user } = useAuth();
  const { showToast, confirm } = useToast();
  const [profs, setProfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "trial" | "pro" | "premium" | "vencidos">("all");

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

  const filtered = useMemo(() => {
    const now = Date.now();
    return profs.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!(p.nombre || "").toLowerCase().includes(q) && !(p.email || "").toLowerCase().includes(q)) return false;
      }
      if (filter === "all") return true;
      if (filter === "vencidos") return p.trialFin && p.trialFin < now;
      return p.plan === filter;
    });
  }, [profs, search, filter]);

  const stats = useMemo(() => {
    const now = Date.now();
    const mrr = profs.filter((p) => p.plan === "pro").length * 15 + profs.filter((p) => p.plan === "premium").length * 25;
    const vencidos = profs.filter((p) => p.trialFin && p.trialFin < now).length;
    const trialsActivos = profs.filter((p) => p.plan === "trial" && p.trialFin && p.trialFin > now).length;
    return { total: profs.length, mrr, vencidos, trialsActivos };
  }, [profs]);

  const handleToggleSuspend = async (p: any) => {
    const newState = !p.suscripcionSuspendida;
    const ok = await confirm(`${newState ? "Suspender" : "Activar"} cuenta de ${p.nombre}?`);
    if (!ok) return;
    try {
      const res = await fetch("/api/update-professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, data: { suscripcionSuspendida: newState } }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setProfs((prev) => prev.map((x) => x.id === p.id ? { ...x, suscripcionSuspendida: newState } : x));
      showToast(newState ? "Cuenta suspendida" : "Cuenta activada", "success");
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  const handleCambiarPlan = async (p: any, nuevoPlan: "trial" | "pro" | "premium") => {
    if (nuevoPlan === p.plan) return;
    const ok = await confirm(`Cambiar ${p.nombre} de plan ${p.plan} → ${nuevoPlan}?`);
    if (!ok) return;
    try {
      const now = Date.now();
      const data: any = { plan: nuevoPlan };
      if (nuevoPlan === "trial") { data.trialInicio = now; data.trialFin = now + 15 * 86400000; }
      else { data.planActivoHasta = now + 30 * 86400000; }
      const res = await fetch("/api/update-professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, data }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setProfs((prev) => prev.map((x) => x.id === p.id ? { ...x, ...data } : x));
      showToast(`Plan cambiado a ${nuevoPlan}`, "success");
    } catch (e: any) {
      showToast("Error: " + e.message, "error");
    }
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando pagos...</p>
        </div>
      </div>
    );

  const statCards = [
    { label: "MRR Estimado", value: `$${stats.mrr}`, icon: DollarSign, color: "#10B981" },
    { label: "Trials activos", value: stats.trialsActivos, icon: Clock, color: "#06B6D4" },
    { label: "Vencidos", value: stats.vencidos, icon: AlertTriangle, color: "#F59E0B" },
    { label: "Total profesionales", value: stats.total, icon: CreditCard, color: "#D4AF37" },
  ];

  return (
    <div className="max-w-6xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <a href="/super-admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Pagos y Suscripciones</h1>
          <p className="text-sp-text2 text-sm">Gestiona planes, suspende o activa cuentas</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass rounded-2xl p-4">
              <Icon size={18} color={s.color} />
              <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              <p className="text-[10px] text-sp-text2 uppercase">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="glass rounded-2xl p-3 mb-4 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[{ k: "all", l: "Todos" }, { k: "trial", l: "Trial" }, { k: "pro", l: "Pro" }, { k: "premium", l: "Premium" }, { k: "vencidos", l: "Vencidos" }].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k as any)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f.k ? "text-sp-bg" : "text-sp-text2 hover:text-white border border-white/10"}`} style={filter === f.k ? { background: "linear-gradient(135deg, #D4AF37, #F4D88A)" } : {}}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <CreditCard size={40} className="mx-auto text-sp-text2 mb-2" />
          <p className="text-sp-text2 text-sm">Sin resultados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => {
            const now = Date.now();
            const vencido = p.trialFin && p.trialFin < now;
            const diasRestantes = p.trialFin ? Math.ceil((p.trialFin - now) / 86400000) : null;
            const planConfig = PLANES.find((pl) => pl.id === p.plan);
            return (
              <div key={p.id} className="glass rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${planConfig?.color || "#0D9488"}20`, border: `1px solid ${planConfig?.color || "#0D9488"}40` }}>
                      <span className="font-display text-xs font-bold" style={{ color: planConfig?.color || "#0D9488" }}>{(p.nombre || "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{p.nombre}</p>
                      <p className="text-xs text-sp-text2 truncate">{p.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {p.suscripcionSuspendida && (
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-red-500/20 text-red-400">Suspendido</span>
                    )}
                    {vencido && !p.suscripcionSuspendida && (
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-amber-500/20 text-amber-400">Trial vencido</span>
                    )}
                    {diasRestantes !== null && diasRestantes > 0 && !p.suscripcionSuspendida && (
                      <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-cyan-500/20 text-cyan-400">{diasRestantes}d left</span>
                    )}
                    <select
                      value={p.plan}
                      onChange={(e) => handleCambiarPlan(p, e.target.value as any)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {PLANES.map((pl) => <option key={pl.id} value={pl.id} className="bg-sp-bg">{pl.nombre}</option>)}
                    </select>
                    <button
                      onClick={() => handleToggleSuspend(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${p.suscripcionSuspendida ? "text-green-400 border-green-500/30 hover:bg-green-500/10" : "text-amber-400 border-amber-500/30 hover:bg-amber-500/10"}`}
                    >
                      {p.suscripcionSuspendida ? "Activar" : "Suspender"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
