"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getPublishedProfessionals } from "@/lib/professionals-service";
import { getProfession, ProfessionId, PROFESSION_LIST } from "@/lib/professions";
import { useToast } from "@/components/saludpro/toast";
import { Users, Search, Loader2, ExternalLink, UserPlus, Filter, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function ProfesionalesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profs, setProfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProfesion, setFilterProfesion] = useState("");
  const [filterPlan, setFilterPlan] = useState("");

  useEffect(() => {
    const cargar = async () => {
      if (!user) return;
      try {
        const list = await getPublishedProfessionals();
        setProfs(list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0)));
      } catch (e: any) {
        showToast("Error: " + e.message, "error");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [user, showToast]);

  const filtered = useMemo(() => {
    return profs.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const match = (p.nombre || "").toLowerCase().includes(q) || (p.email || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q) || (p.ciudad || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterProfesion && p.profesion !== filterProfesion) return false;
      if (filterPlan && p.plan !== filterPlan) return false;
      return true;
    });
  }, [profs, search, filterProfesion, filterPlan]);

  if (loading)
    return (
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-sp-gold mb-4" />
          <p className="text-sp-text2 text-sm">Cargando profesionales...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto overflow-x-hidden">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <a href="/super-admin" className="text-sp-text2 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </a>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Profesionales</h1>
            <p className="text-sp-text2 text-sm">{filtered.length} de {profs.length} mostrados</p>
          </div>
        </div>
        <Link href="/super-admin/nuevo" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sp-bg text-sm" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}>
          <UserPlus size={16} /> Nuevo
        </Link>
      </div>

      <div className="glass rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email, ciudad o slug..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-text2 pointer-events-none" />
            <select value={filterProfesion} onChange={(e) => setFilterProfesion(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white appearance-none">
              <option value="" className="bg-sp-bg">Todas las profesiones</option>
              {PROFESSION_LIST.map((p) => <option key={p.id} value={p.id} className="bg-sp-bg">{p.emoji} {p.label}</option>)}
            </select>
          </div>
          <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none">
            <option value="" className="bg-sp-bg">Todos los planes</option>
            <option value="trial" className="bg-sp-bg">Trial</option>
            <option value="pro" className="bg-sp-bg">Pro</option>
            <option value="premium" className="bg-sp-bg">Premium</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Users size={40} className="mx-auto text-sp-text2 mb-3" />
          <h3 className="font-display text-lg text-white mb-1">{profs.length === 0 ? "Aún no hay profesionales" : "Sin resultados"}</h3>
          <p className="text-sp-text2 text-sm mb-4">{profs.length === 0 ? "Crea el primer profesional." : "Prueba con otros filtros."}</p>
          {profs.length === 0 && (
            <Link href="/super-admin/nuevo" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10">
              <UserPlus size={14} /> Crear profesional
            </Link>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase text-sp-text2">
                  <th className="text-left p-3 font-medium">Profesional</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Profesión</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Ubicación</th>
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Estado</th>
                  <th className="text-right p-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const config = getProfession(p.profesion as ProfessionId);
                  const accent = p.colorAccent || config.accent;
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
                            {p.fotoUrl ? <img src={p.fotoUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <span className="font-display text-xs font-bold" style={{ color: accent }}>{(p.nombre || "").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{p.nombre}</p>
                            <p className="text-xs text-sp-text2 truncate">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-sp-text2">{config.emoji} {config.label}</span>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-sp-text2 text-xs">
                        {p.ciudad || p.estado || "—"}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase" style={{ background: p.plan === "premium" ? "#06B6D420" : p.plan === "pro" ? "#D4AF3720" : "#0D948820", color: p.plan === "premium" ? "#06B6D4" : p.plan === "pro" ? "#D4AF37" : "#0D9488" }}>
                          {p.plan}
                        </span>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {p.suscripcionSuspendida ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-400"><AlertTriangle size={12} /> Suspendido</span>
                        ) : p.activo ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle2 size={12} /> Activo</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-sp-text2"><Clock size={12} /> Inactivo</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          {p.slug && (
                            <a href={`/c/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-sp-text2 hover:text-sp-teal-light hover:bg-white/5" title="Ver portafolio">
                              <ExternalLink size={14} />
                            </a>
                          )}
                          <Link href={`/super-admin/profesional/${p.id}`} className="px-3 py-1.5 rounded-lg text-xs font-medium text-sp-gold border border-sp-gold/30 hover:bg-sp-gold/10">
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
