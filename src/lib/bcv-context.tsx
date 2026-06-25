"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
interface BCVContextType { rate: number | null; date: string | null; loading: boolean; source: string; convert: (usd: number) => string; }
const BCVContext = createContext<BCVContextType>({ rate: null, date: null, loading: true, source: "", convert: () => "" });
let cachedBCV: { rate: number; date: string; source: string; lastUpdate: number } | null = null;
const BCV_CACHE_DURATION = 60 * 60 * 1000;
export function BCVProvider({ children }: { children: ReactNode }) {
  const [rate, setRate] = useState<number | null>(cachedBCV?.rate || null);
  const [date, setDate] = useState<string | null>(cachedBCV?.date || null);
  const [loading, setLoading] = useState(!cachedBCV);
  const [source, setSource] = useState(cachedBCV?.source || "");
  useEffect(() => {
    if (cachedBCV && Date.now() - cachedBCV.lastUpdate < BCV_CACHE_DURATION) { setRate(cachedBCV.rate); setDate(cachedBCV.date); setSource(cachedBCV.source); setLoading(false); return; }
    const timer = setTimeout(async () => {
      try { const res = await fetch("/api/bcv"); const data = await res.json(); if (data.ok) { cachedBCV = { rate: data.rate, date: data.date, source: data.source || "BCV", lastUpdate: Date.now() }; setRate(data.rate); setDate(data.date); setSource(data.source || "BCV"); } } catch (e) { console.warn("[BCV] No se pudo obtener la tasa:", e); } finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const convert = (usd: number): string => { if (!rate) return "—"; const bs = usd * rate; return new Intl.NumberFormat("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(bs); };
  return <BCVContext.Provider value={{ rate, date, loading, source, convert }}>{children}</BCVContext.Provider>;
}
export const useBCV = () => useContext(BCVContext);
