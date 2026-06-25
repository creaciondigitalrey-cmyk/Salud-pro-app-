"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
export function Reveal({ children, delay = 0, y = 40, className = "", once = true }: { children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  return <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, margin: "-80px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
export function Eyebrow({ children, color = "teal" }: { children: ReactNode; color?: "teal" | "gold" | "cyan" | "green" }) {
  const colorMap = { teal: "text-sp-teal-light border-sp-teal/30 bg-sp-teal/5", gold: "text-sp-gold border-sp-gold/30 bg-sp-gold/5", cyan: "text-sp-cyan border-sp-cyan/30 bg-sp-cyan/5", green: "text-sp-health-green border-sp-health-green/30 bg-sp-health-green/5" };
  return <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase border ${colorMap[color]}`}><span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />{children}</span>;
}
