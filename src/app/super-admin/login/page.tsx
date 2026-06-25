"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { SaludProLogo } from "@/components/saludpro/logo";
import { isSuperAdminEmail } from "@/lib/super-admin-config";
import { Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from "lucide-react";
export default function SuperAdminLoginPage() {
  const router = useRouter(); const { user, loading, login, isConfigured } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (!loading && user) { router.replace(isSuperAdminEmail(user.email) ? "/super-admin" : "/admin"); } }, [user, loading, router]);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(""); setSubmitting(true); try { if (!isSuperAdminEmail(email)) { setError("Sin permisos de Super Admin"); setSubmitting(false); return; } await login(email, password); router.replace("/super-admin"); } catch (err: any) { const code = err?.code || ""; setError(code.includes("invalid-credential") ? "Email o contraseña incorrectos" : err?.message || "Error"); } finally { setSubmitting(false); } };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.15) 0%, transparent 50%)" }} />
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 shadow-glow-gold">
          <div className="flex justify-center mb-6"><div className="relative"><SaludProLogo size={80} /><div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)" }}><Shield size={16} color="#061520" /></div></div></div>
          <h1 className="font-display text-2xl font-bold text-center text-white mb-1">Super Admin</h1>
          <p className="text-center text-sp-text2 text-sm mb-2">Panel del Administrador Global</p>
          <p className="text-center text-sp-gold text-xs mb-8 uppercase">Acceso restringido</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-xs font-medium text-sp-text2 mb-1.5 uppercase">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={!isConfigured || submitting} placeholder="creaciondigitalrey@gmail.com" className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-sp-gold/50" style={{ background: "rgba(6,21,32,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} /></div>
            <div><label className="block text-xs font-medium text-sp-text2 mb-1.5 uppercase">Contraseña</label><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!isConfigured || submitting} placeholder="••••••••" className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-sp-gold/50" style={{ background: "rgba(6,21,32,0.6)", border: "1px solid rgba(255,255,255,0.1)" }} /><button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-text2 hover:text-white" tabIndex={-1}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl text-sm flex items-center gap-2 text-red-400" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}><AlertCircle size={16} />{error}</motion.div>}
            <button type="submit" disabled={submitting || !isConfigured} className="w-full py-3.5 rounded-xl font-semibold text-sp-bg transition-all hover:scale-[1.02] disabled:opacity-40" style={{ background: "linear-gradient(135deg, #D4AF37, #F4D88A)", boxShadow: "0 8px 30px rgba(212,175,55,0.4)" }}>{submitting ? "Ingresando..." : "Acceder"}</button>
          </form>
          <a href="/" className="mt-6 flex items-center justify-center gap-2 text-xs text-sp-text2 hover:text-white"><ArrowLeft size={14} />Volver a SaludPro</a>
        </div>
      </motion.div>
    </div>
  );
}
