"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { SaludProLogo } from "@/components/saludpro/logo";
import { LayoutDashboard, User, Briefcase, CreditCard, QrCode, Image, LogOut, ExternalLink, Loader2 } from "lucide-react";
const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Mi Perfil", icon: User },
  { href: "/admin/services", label: "Servicios", icon: Briefcase },
  { href: "/admin/servicios-profesionales", label: "Catálogo", icon: Image },
  { href: "/admin/payments", label: "Pagos", icon: CreditCard },
  { href: "/admin/qr", label: "Mi QR", icon: QrCode },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isLoginPage = pathname === "/admin/login";
  useEffect(() => { if (!loading && !user && !isLoginPage) router.replace("/admin/login"); }, [user, loading, router, isLoginPage]);
  if (isLoginPage) return <>{children}</>;
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sp-teal" /></div>;
  if (!user) return null;
  const handleLogout = async () => { await logout(); router.replace("/admin/login"); };
  return (
    <div className="min-h-screen flex">
      <aside className="fixed inset-y-0 left-0 w-64 hidden md:flex flex-col z-30" style={{ background: "rgba(6,21,32,0.9)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="p-6 border-b border-white/5"><Link href="/admin" className="flex items-center gap-3"><SaludProLogo size={40} /><div><p className="font-display text-sm font-bold text-white"><span className="text-white">Salud</span><span className="text-gradient-teal">Pro</span></p><p className="text-[10px] text-sp-text2">Panel</p></div></Link></div>
        <nav className="flex-1 p-4 space-y-1">{navItems.map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "text-white" : "text-sp-text2 hover:text-white hover:bg-white/5"}`} style={isActive ? { background: "linear-gradient(135deg, rgba(13,148,136,0.2) 0%, rgba(6,182,212,0.15) 100%)", border: "1px solid rgba(13,148,136,0.3)" } : { border: "1px solid transparent" }}><Icon size={18} />{item.label}</Link>; })}</nav>
        <div className="p-4 border-t border-white/5 space-y-1"><Link href="/c/maria-gonzalez" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-sp-text2 hover:text-white hover:bg-white/5"><ExternalLink size={18} />Ver portafolio</Link><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10"><LogOut size={18} />Cerrar Sesión</button></div>
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(6,21,32,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}><Link href="/admin" className="flex items-center gap-2"><SaludProLogo size={32} /><span className="font-display font-bold text-white">SaludPro</span></Link><button onClick={handleLogout} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><LogOut size={18} /></button></div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex" style={{ background: "rgba(6,21,32,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>{navItems.map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] ${isActive ? "text-sp-teal-light" : "text-sp-text2"}`}><Icon size={20} />{item.label}</Link>; })}</div>
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-6 md:p-10 overflow-x-hidden">{children}</motion.div></main>
    </div>
  );
}
