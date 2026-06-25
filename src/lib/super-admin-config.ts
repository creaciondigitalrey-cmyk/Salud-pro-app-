export const SUPER_ADMIN_EMAILS = ["creaciondigitalrey@gmail.com", "reinaldo@saludpro.com"];
export function isSuperAdminEmail(email: string | null | undefined): boolean { return email ? SUPER_ADMIN_EMAILS.includes(email.toLowerCase()) : false; }
export interface PlanConfig { id: "trial" | "pro" | "premium"; nombre: string; precio: number; duracion: string; limiteFotos: number; caracteristicas: string[]; color: string; }
export const PLANES: PlanConfig[] = [
  { id: "trial", nombre: "Trial", precio: 0, duracion: "15 días", limiteFotos: 5, caracteristicas: ["Portafolio completo","5 fotos en catálogo","Soporte por WhatsApp"], color: "#0D9488" },
  { id: "pro", nombre: "Pro", precio: 15, duracion: "mes", limiteFotos: 20, caracteristicas: ["Todo lo del Trial","20 fotos en catálogo","QR descargable","Estadísticas"], color: "#D4AF37" },
  { id: "premium", nombre: "Premium", precio: 25, duracion: "mes", limiteFotos: Infinity, caracteristicas: ["Todo lo del Pro","Fotos ilimitadas","Dominio propio","API access"], color: "#06B6D4" },
];
export interface PlatformConfig { whatsappSoporte: string; emailSoporte: string; duracionTrialDias: number; precioPro: number; precioPremium: number; registroAutomaticoHabilitado: boolean; marcaDesarrollador: string; subMarcaDesarrollador: string; }
export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = { whatsappSoporte: "584225507708", emailSoporte: "creaciondigitalrey@gmail.com", duracionTrialDias: 15, precioPro: 15, precioPremium: 25, registroAutomaticoHabilitado: true, marcaDesarrollador: "Reinaldo Morales", subMarcaDesarrollador: "Soluciones Digitales & IA" };
export type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";
export interface Solicitud { id: string; nombre: string; profesion: string; email: string; whatsapp: string; ciudad: string; plan: string; mensaje?: string; estado: EstadoSolicitud; createdAt: number; }
