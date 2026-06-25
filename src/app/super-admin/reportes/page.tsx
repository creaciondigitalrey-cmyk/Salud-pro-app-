"use client";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { getPublishedProfessionals } from "@/lib/professionals-service";
import { getSolicitudesPendientes } from "@/lib/solicitudes-service";
import { getProfession, ProfessionId, PROFESSION_LIST } from "@/lib/professions";
import { PLANES } from "@/lib/super-admin-config";
import { useToast } from "@/components/saludpro/toast";
import { FileSpreadsheet, Loader2, Download, Users, Clock, DollarSign, TrendingUp, FileText, Calendar } from "lucide-react";

export default function ReportesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profs, setProfs] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!user) return;
      try {
        const [p, s] = await Promise.allSettled([getPublishedProfessionals(), getSolicitudesPendientes()]);
        setProfs(p.status === "fulfilled" ? p.value : []);
        setSolicitudes(s.status === "fulfilled" ? s.value : []);
      } catch (e: any) {
        showToast("Error: " + e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user, showToast]);

  const stats = useMemo(() => {
    const now = Date.now();
    const last30 = profs.filter((p) => p.createdAt && (now - p.createdAt) < 30 * 86400000).length;
    const last7 = profs.filter((p) => p.createdAt && (now - p.createdAt) < 7 * 86400000).length;
    const mrr = profs.filter((p) => p.plan === "pro").length * 15 + profs.filter((p) => p.plan === "premium").length * 25;
    const byProfesion = PROFESSION_LIST.map((p) => ({ label: p.label, count: profs.filter((x) => x.profesion === p.id).length, emoji: p.emoji })).sort((a, b) => b.count - a.count).filter((x) => x.count > 0);
    const byPlan = PLANES.map((p) => ({ label: p.nombre, count: profs.filter((x) => x.plan === p.id).length, color: p.color }));
    return { total: profs.length, last30, last7, mrr, byProfesion, byPlan, solicitudes: solicitudes.length };
  }, [profs, solicitudes]);

  const exportCSV = (tipo: "profesionales" | "solicitudes") => {
    const data = tipo === "profesionales" ? profs : solicitudes;
    if (data.length === 0) { showToast("No hay datos para exportar", "error"); return; }
    const headers = tipo === "profesionales"
      ? ["Nombre", "Email", "WhatsApp", "Profesión", "Plan", "Ciudad", "Estado", "Activo", "Suspendido", "Creado"]
      : ["Nombre", "Email", "WhatsApp", "Profesión", "Plan", "Ciudad", "Mensaje", "Creado"];
    const rows = data.map((p: any) => tipo === "profesionales"
      ? [p.nombre, p.email, p.whatsapp, getProfession(p.profesion as ProfessionId).label, p.plan, p.ciudad || "", p.estado || "", p.activo ? "Sí" : "No", p.suscripcionSuspendida ? "Sí" : "No", p.createdAt ? new Date(p.createdAt).toLocaleString() : ""]
      : [p.nombre, p.email, p.whatsapp, getProfession(p.profesion as ProfessionId).label, p.plan, p.ciudad || "", p.mensaje || "", p.createdAt ? new Date(p.createdAt).toLocaleString() : ""]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saludpro-${tipo}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exportado: ${data.length} registros`, "success");
  };

  if (loading)
    return (
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Generando reportes...</p>
        </div>
      </div>
    );

  const cards = [
    { label: "Total profesionales", value: stats.total, icon: Users, color: "#0D9488" },
    { label: "Nuevos últimos 30 días", value: stats.last30, icon: TrendingUp, color: "#10B981" },
    { label: "Nuevos últimos 7 días", value: stats.last7, icon: Calendar, color: "#06B6D4" },
    { label: "MRR estimado", value: `$${stats.mrr}`, icon: DollarSign, color: "#D4AF37" },
  ];

  return (
    <div className="max-w-5xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-6">
        <a href="/super-admin" className="text-sp-text2 hover:text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </a>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Reportes</h1>
          <p className="text-sp-text2 text-sm">Estadísticas y exportación de datos</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass rounded-2xl p-4">
              <Icon size={18} color={c.color} />
              <p className="text-2xl font-bold text-white mt-1">{c.value}</p>
              <p className="text-[10px] text-sp-text2 uppercase">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Por profesión */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Por profesión</h2>
          {stats.byProfesion.length === 0 ? (
            <p className="text-sm text-sp-text2 text-center py-4">Sin datos</p>
          ) : (
            <div className="space-y-2">
              {stats.byProfesion.map((p) => (
                <div key={p.label} className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-sm text-white flex-1">{p.label}</span>
                  <div className="w-32 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(p.count / stats.total) * 100}%`, background: "linear-gradient(90deg, #D4AF37, #F4D88A)" }} />
                  </div>
                  <span className="text-sm text-white w-8 text-right">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Por plan */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Distribución por plan</h2>
          <div className="space-y-3">
            {stats.byPlan.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white">{p.label}</span>
                  <span className="text-sm text-white">{p.count} ({stats.total > 0 ? Math.round((p.count / stats.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${stats.total > 0 ? (p.count / stats.total) * 100 : 0}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exportar */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileSpreadsheet size={18} /> Exportar datos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={() => exportCSV("profesionales")} disabled={profs.length === 0} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-left">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#10B98120" }}>
              <FileSpreadsheet size={18} color="#10B981" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Profesionales.csv</p>
              <p className="text-xs text-sp-text2">{profs.length} registros</p>
            </div>
            <Download size={14} className="text-sp-text2" />
          </button>
          <button onClick={() => exportCSV("solicitudes")} disabled={solicitudes.length === 0} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-left">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#EC489920" }}>
              <FileText size={18} color="#EC4899" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Solicitudes.csv</p>
              <p className="text-xs text-sp-text2">{solicitudes.length} registros</p>
            </div>
            <Download size={14} className="text-sp-text2" />
          </button>
        </div>
        <p className="text-xs text-sp-text2 mt-3">Los archivos CSV se abren en Excel, Google Sheets o Numbers.</p>
      </div>
    </div>
  );
}
