"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { getSolicitudesPendientes } from "@/lib/solicitudes-service";
import { getPublishedProfessionals } from "@/lib/professionals-service";
import { Users, DollarSign, Clock, Bell, UserPlus, CreditCard, FileSpreadsheet, Loader2, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ total: 0, trial: 0, pro: 0, premium: 0, mrr: 0, solicitudes: 0, activos: 0, suspendidos: 0, verificados: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!user) return;
      try {
        const [sols, profs] = await Promise.allSettled([
          getSolicitudesPendientes(),
          getPublishedProfessionals(),
        ]);
        const s = sols.status === "fulfilled" ? sols.value : [];
        const p = profs.status === "fulfilled" ? profs.value : [];
        setMetrics({
          total: p.length,
          trial: p.filter((x: any) => x.plan === "trial").length,
          pro: p.filter((x: any) => x.plan === "pro").length,
          premium: p.filter((x: any) => x.plan === "premium").length,
          mrr: p.filter((x: any) => x.plan === "pro").length * 15 + p.filter((x: any) => x.plan === "premium").length * 25,
          solicitudes: s.length,
          activos: p.filter((x: any) => x.activo).length,
          suspendidos: p.filter((x: any) => x.suscripcionSuspendida).length,
          verificados: p.filter((x: any) => x.verificado).length,
        });
        setRecent(
          [...p]
            .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
            .slice(0, 5)
        );
      } catch (e) {
        console.error("[dashboard] error:", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user]);

  if (loading)
    return (
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando métricas...</p>
        </div>
      </div>
    );

  const planCards = [
    { label: "Profesionales", value: metrics.total, icon: Users, color: "#0D9488", bg: "#0D948810", border: "#0D948830", href: "/super-admin/profesionales" },
    { label: "En Trial", value: metrics.trial, icon: Clock, color: "#06B6D4", bg: "#06B6D410", border: "#06B6D430", href: "/super-admin/profesionales" },
    { label: "Plan Pro", value: metrics.pro, icon: TrendingUp, color: "#D4AF37", bg: "#D4AF3710", border: "#D4AF3730", href: "/super-admin/profesionales" },
    { label: "Premium", value: metrics.premium, icon: CheckCircle2, color: "#8B5CF6", bg: "#8B5CF610", border: "#8B5CF630", href: "/super-admin/profesionales" },
    { label: "MRR Estimado", value: `$${metrics.mrr}`, icon: DollarSign, color: "#10B981", bg: "#10B98110", border: "#10B98130", href: "/super-admin/pagos" },
    { label: "Solicitudes", value: metrics.solicitudes, icon: Bell, color: "#EC4899", bg: "#EC489910", border: "#EC489930", href: "/super-admin/solicitudes" },
    { label: "Activos", value: metrics.activos, icon: CheckCircle2, color: "#22C55E", bg: "#22C55E10", border: "#22C55E30", href: "/super-admin/profesionales" },
    { label: "Suspendidos", value: metrics.suspendidos, icon: AlertTriangle, color: "#F59E0B", bg: "#F59E0B10", border: "#F59E0B30", href: "/super-admin/pagos" },
  ];

  const quickActions = [
    { label: "Crear Profesional", desc: "Alta de nuevo cliente", href: "/super-admin/nuevo", icon: UserPlus, color: "#D4AF37" },
    { label: "Ver Solicitudes", desc: `${metrics.solicitudes} pendientes`, href: "/super-admin/solicitudes", icon: Bell, color: "#EC4899" },
    { label: "Gestión Pagos", desc: "MRR $" + metrics.mrr, href: "/super-admin/pagos", icon: CreditCard, color: "#10B981" },
    { label: "Reportes", desc: "Exportar Excel", href: "/super-admin/reportes", icon: FileSpreadsheet, color: "#06B6D4" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
            Dashboard <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sp-gold/20 text-sp-gold">Super Admin</span>
          </h1>
          <p className="text-sp-text2 text-sm">Bienvenido, {user?.email}</p>
        </div>
        <Link
          href="/super-admin/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sp-bg text-sm hover-lift"
          style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}
        >
          <UserPlus size={16} /> Crear profesional
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {planCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link key={i} href={c.href} className="hover-lift">
              <div className="p-5 rounded-2xl h-full" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <Icon size={20} color={c.color} />
                <p className="text-2xl font-bold text-white mt-2">{c.value}</p>
                <p className="text-xs text-sp-text2 uppercase tracking-wide">{c.label}</p>
              </div>
            </Link>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">Profesionales recientes</h2>
            <Link href="/super-admin/profesionales" className="text-xs text-sp-gold hover:underline">Ver todos →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-sp-text2 mb-2" />
              <p className="text-sp-text2 text-sm">No hay profesionales todavía.</p>
              <Link href="/super-admin/nuevo" className="inline-flex items-center gap-1 text-sp-gold text-sm mt-2">
                <UserPlus size={14} /> Crear el primero
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/super-admin/profesional/${p.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${p.colorAccent || "#0D9488"}20`, border: `1px solid ${p.colorAccent || "#0D9488"}40` }}
                  >
                    <span className="font-display text-xs font-bold" style={{ color: p.colorAccent || "#0D9488" }}>
                      {(p.nombre || "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.nombre}</p>
                    <p className="text-xs text-sp-text2 truncate">{p.email}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-1 rounded-full font-bold uppercase"
                    style={{
                      background: p.plan === "premium" ? "#06B6D420" : p.plan === "pro" ? "#D4AF3720" : "#0D948820",
                      color: p.plan === "premium" ? "#06B6D4" : p.plan === "pro" ? "#D4AF37" : "#0D9488",
                    }}
                  >
                    {p.plan}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            {quickActions.map((a, i) => {
              const Icon = a.icon;
              return (
                <Link
                  key={i}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}20`, border: `1px solid ${a.color}40` }}
                  >
                    <Icon size={16} color={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{a.label}</p>
                    <p className="text-xs text-sp-text2">{a.desc}</p>
                  </div>
                  <span className="text-sp-text2 group-hover:text-white">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
