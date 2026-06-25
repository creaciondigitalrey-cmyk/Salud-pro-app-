"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { SaludProLogo } from "@/components/saludpro/logo";
import { Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
export default function AdminLoginPage() {
  const router = useRouter(); const { user, loading, login, isConfigured } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (!loading && user) router.replace("/admin"); }, [user, loading, router]);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(""); setSubmitting(true); try { await login(email, password); router.replace("/admin"); } catch (err: any) { const code = err?.code || ""; setError(code.includes("invalid-credential") || code.includes("wrong-password") ? "Email o contraseña incorrectos" : code.includes("user-not-found") ? "No existe cuenta con ese email" : err?.message || "Error"); } finally { setSubmitting(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at top, rgba(13,148,136,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(6,182,212,0.1) 0%, transparent 50%)" }} />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-glow-teal">
          <div className="flex justify-center mb-6"><SaludProLogo size={80} /></div>
          <h1 className="font-display text-2xl font-bold text-center text-white mb-1">Panel Administrativo</h1>
          <p className="text-center text-sp-text2 text-sm mb-8">SaludPro · Profesionales de la Salud</p>
          {!isConfigured && <div className="mb-6 p-4 rounded-xl text-sm flex items-start gap-2" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}><AlertCircle size={18} className="flex-shrink-0 mt-0.5" /><div><p className="font-semibold">Firebase no configurado</p><p className="text-xs text-sp-text2">Estamos configurando Firebase.</p></div></div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-sp-text2 mb-1.5 uppercase tracking-wider">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!isConfigured || submitting} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-sp-teal/50" style={{ background: "rgba(6,21,32,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} /></div>
            <div><label className="block text-xs font-medium text-sp-text2 mb-1.5 uppercase tracking-wider">Contraseña</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!isConfigured || submitting} placeholder="••••••••" className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-sp-teal/50" style={{ background: "rgba(6,21,32,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} /><button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text2 hover:text-white" tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl text-sm flex items-center gap-2 text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}><AlertCircle size={16} />{error}</motion.div>}
            <button type="submit" disabled={submitting || !isConfigured} className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-40" style={{ background: "linear-gradient(135deg, #0D9488 0%, #06B6D4 100%)", boxShadow: "0 8px 30px rgba(13,148,136,0.4)" }}>{submitting ? "Ingresando..." : "Iniciar Sesión"}</button>
          </form>
          <a href="/" className="mt-6 flex items-center justify-center gap-2 text-xs text-sp-text2 hover:text-white"><ArrowLeft size={14} />Volver a SaludPro</a>
        </div>
      </motion.div>
    </div>
  );
}
