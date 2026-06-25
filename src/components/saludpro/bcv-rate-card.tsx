"use client";
import { motion } from "framer-motion";
import { useBCV } from "@/lib/bcv-context";
import { TrendingUp, RefreshCw } from "lucide-react";
export function BCVRateCard({ accent = "#0D9488" }: { accent?: string }) {
  const { rate, date, loading, source } = useBCV();
  if (loading) return <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass" style={{ border: `1px solid ${accent}30` }}><RefreshCw size={14} className="animate-spin text-sp-text2" /><span className="text-xs text-sp-text2">Cargando tasa BCV...</span></motion.div>;
  if (!rate) return null;
  const formattedRate = new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(rate);
  const formattedDate = date ? new Date(date).toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" }) : "";
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-strong" style={{ border: `1px solid ${accent}40`, boxShadow: `0 4px 20px ${accent}20` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}><TrendingUp size={16} color={accent} /></div>
      <div className="flex flex-col"><div className="flex items-baseline gap-1.5"><span className="text-[10px] text-sp-text2 uppercase tracking-wider font-medium">USD BCV</span><span className="font-display text-lg font-bold text-white">Bs. {formattedRate}</span></div><div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-sp-health-green animate-pulse" /><span className="text-[9px] text-sp-text2/70">{source} · {formattedDate}</span></div></div>
    </motion.div>
  );
}
