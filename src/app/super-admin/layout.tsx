"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { isSuperAdminEmail } from "@/lib/super-admin-config";
import { SaludProLogo } from "@/components/saludpro/logo";
import { LayoutDashboard, Users, UserPlus, CreditCard, Settings, LogOut, ExternalLink, Loader2, Mail, Bell, FileSpreadsheet, Shield } from "lucide-react";
const navItems = [{ href: "/super-admin", label: "Dashboard", icon: LayoutDashboard }, { href: "/super-admin/solicitudes", label: "Solicitudes", icon: Bell }, { href: "/super-admin/profesionales", label: "Profesionales", icon: Users }, { href: "/super-admin/nuevo", label: "Crear", icon: UserPlus }, { href: "/super-admin/pagos", label: "Pagos", icon: CreditCard }, { href: "/super-admin/configuracion", label: "Config", icon: Settings }];
export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname(); const { user, loading, logout } = useAuth();
  const isLoginPage = pathname === "/super-admin/login";
  useEffect(() => { if (!loading && !user && !isLoginPage) router.replace("/super-admin/login"); if (!loading && user && !isSuperAdminEmail(user.email) && !isLoginPage) router.replace("/admin"); }, [user, loading, router, isLoginPage]);
  if (isLoginPage) return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sp-gold" /></div>;
  if (!user || !isSuperAdminEmail(user.email)) return null;
  const handleLogout = async () => { await logout(); router.replace("/super-admin/login"); };
  return (
    <div className="min-h-screen flex">
      <aside className="fixed inset-y-0 left-0 w-64 hidden md:flex flex-col z-30" style={{ background: "rgba(6,21,32,0.9)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="p-6 border-b border-white/5"><Link href="/super-admin" className="flex items-center gap-3"><SaludProLogo size={40} /><div><p className="font-display text-sm font-bold text-white">Salud<span className="text-gradient-gold">Pro</span></p><p className="text-[10px] text-sp-gold uppercase flex items-center gap-1"><Shield size={10} /> Super Admin</p></div></Link></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">{navItems.map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${isActive ? "text-white" : "text-sp-text2 hover:text-white hover:bg-white/5"}`} style={isActive ? { background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(13,148,136,0.15))", border: "1px solid rgba(212,175,55,0.3)" } : { border: "1px solid transparent" }}><Icon size={18} /><span className="flex-1">{item.label}</span></Link>; })}</nav>
        <div className="p-4 border-t border-white/5 space-y-1"><Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-sp-text2 hover:text-white"><ExternalLink size={18} />Ver sitio</Link><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10"><LogOut size={18} />Cerrar Sesión</button></div>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(6,21,32,0.95)", backdropFilter: "blur(20px)" }}><Link href="/super-admin" className="flex items-center gap-2"><SaludProLogo size={32} /><span className="font-display font-bold text-white">Super Admin</span></Link><button onClick={handleLogout} className="p-2 rounded-lg text-red-400"><LogOut size={18} /></button></div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex" style={{ background: "rgba(6,21,32,0.95)", backdropFilter: "blur(20px)" }}>{navItems.slice(0,5).map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex-1 min-w-[60px] flex flex-col items-center gap-1 py-3 text-[9px] ${isActive ? "text-sp-gold" : "text-sp-text2"}`}><Icon size={18} />{item.label}</Link>; })}</div>
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 md:p-10 overflow-x-hidden">{children}</motion.div></main>
    </div>
  );
}
