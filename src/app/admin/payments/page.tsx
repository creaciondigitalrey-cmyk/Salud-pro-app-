"use client";
import { useProfessionalData } from "@/lib/use-professional-data";
import { getProfession } from "@/lib/professions";
import { Loader2 } from "lucide-react";
export default function Page() {
  const { professional, loading } = useProfessionalData();
  if (loading) return <div className="max-w-4xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><Loader2 size={32} className="mx-auto animate-spin text-sp-teal mb-4" /><p className="text-sp-text2 text-sm">Cargando...</p></div></div>;
  if (!professional) return <div className="max-w-4xl mx-auto"><div className="glass rounded-2xl p-12 text-center"><p className="text-sp-text2 text-sm">No se encontró tu perfil.</p></div></div>;
  const config = getProfession(professional.profesion);
  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-3 mb-2"><a href="/admin" className="text-sp-text2 hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg></a><h1 className="font-display text-3xl font-bold text-white">payments</h1></div>
      <p className="text-sp-text2 text-sm mb-6">Profesional: {professional.nombre}</p>
      <div className="glass rounded-2xl p-6"><p className="text-sp-text2 text-sm">Esta sección está siendo cargada con tus datos reales de Firestore. Datos del profesional: {professional.servicios.length} servicios, {professional.metodosPago.length} métodos de pago.</p></div>
    </div>
  );
}
