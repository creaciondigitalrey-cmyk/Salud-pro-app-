import { ProfessionId } from "./professions";
export interface Service { id: string; nombre: string; descripcion: string; precio: number; duracion: string; unidad?: string; activo: boolean; }
export interface CatalogItem { id: string; titulo: string; descripcion: string; fotoAntesUrl?: string; fotoDespuesUrl?: string; precio?: number; duracion?: string; tags: string[]; activo: boolean; iaGenerated?: boolean; iaGeneratedAt?: number; }
export interface Testimonial { id: string; nombre: string; rating: number; comentario: string; fecha?: string; }
export interface Certification { id: string; titulo: string; institucion: string; año: string; }
export interface PaymentMethod { tipo: "pago-movil" | "banco" | "paypal" | "zelle" | "efectivo" | "otro"; datos: { banco?: string; cedula?: string; telefono?: string; cuenta?: string; titular?: string; email?: string; referencia?: string; }; activo: boolean; }
export interface ScheduleSlot { dia: string; inicio: string; fin: string; activo: boolean; }
export type PlanType = "trial" | "pro" | "premium";
export interface Professional {
  id: string; nombre: string; profesion: ProfessionId; especialidad: string; bio: string; fotoUrl?: string; slug: string;
  whatsapp: string; telefono: string; email: string; instagram?: string; facebook?: string;
  direccion: string; ciudad: string; estado?: string; municipio?: string; parroquia?: string; zonaServicio?: string; mapsUrl?: string;
  colorAccent?: string; horarioTexto: string; schedule: ScheduleSlot[];
  servicios: Service[]; catalogo: CatalogItem[]; mostrarServiciosProfesionales: boolean;
  testimonios: Testimonial[]; certificaciones: Certification[]; metodosPago: PaymentMethod[];
  plan: PlanType; trialInicio?: number; trialFin?: number; planActivoHasta?: number; suscripcionSuspendida?: boolean;
  activo: boolean; verificado: boolean; createdAt?: number; updatedAt?: number;
}
export const CATALOG_LIMITS: Record<PlanType, number> = { trial: 5, pro: 20, premium: Infinity };
