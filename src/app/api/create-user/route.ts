import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminConfigured } from '@/lib/firebase-admin';
import { getProfession, ProfessionId } from '@/lib/professions';
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs"; import path from "path";
export const runtime = 'nodejs'; export const maxDuration = 30;
function genPwd(l=10): string { const c='abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKMNPQRSTUVWXYZ'; let p=''; for(let i=0;i<l;i++) p+=c[Math.floor(Math.random()*c.length)]; return p; }
let adminDb: Firestore | null = null;
try { const sa=path.join(process.cwd(),"firebase-service-account.json"); if(fs.existsSync(sa)){ const s=JSON.parse(fs.readFileSync(sa,"utf8")); const a:App=getApps().find(x=>x.name==="admin-db")||initializeApp({credential:cert(s)},"admin-db"); adminDb=getFirestore(a);} } catch(e){}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, ciudad, estado, municipio, parroquia, profesion, plan, slug, bio, password: customPwd, sendEmail, sendWhatsApp } = body;
    if (!nombre || !email || !profesion) return NextResponse.json({ ok: false, error: "Faltan campos" }, { status: 400 });
    if (!isAdminConfigured || !adminAuth) return NextResponse.json({ ok: false, error: "Admin no configurado" }, { status: 500 });
    const password = customPwd && customPwd.length >= 6 ? customPwd : genPwd(10);
    let uid: string;
    try { const u = await adminAuth.createUser({ email, password, displayName: nombre }); uid = u.uid; } catch (e: any) { if (e.code === 'auth/email-already-exists') return NextResponse.json({ ok: false, error: "Email ya existe" }, { status: 400 }); throw e; }
    const config = getProfession(profesion as ProfessionId);
    const finalSlug = slug || nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = { nombre, profesion, especialidad: config.label, bio: bio || `${config.singular}. ${config.descripcion}`, slug: finalSlug, whatsapp: whatsapp||"", telefono: whatsapp||"", email, direccion:"", ciudad:ciudad||"", estado:estado||"", municipio:municipio||"", parroquia:parroquia||"", horarioTexto:"Lunes a Viernes, 8AM-5PM", schedule:[{dia:"Lun",inicio:"08:00",fin:"17:00",activo:true},{dia:"Mar",inicio:"08:00",fin:"17:00",activo:true},{dia:"Mié",inicio:"08:00",fin:"17:00",activo:true},{dia:"Jue",inicio:"08:00",fin:"17:00",activo:true},{dia:"Vie",inicio:"08:00",fin:"17:00",activo:true},{dia:"Sáb",inicio:"08:00",fin:"13:00",activo:false},{dia:"Dom",inicio:"00:00",fin:"00:00",activo:false}], servicios: config.serviciosDefault.map((s,i)=>({id:`srv-${i+1}`,nombre:s.nombre,descripcion:s.descripcion,precio:s.precio,duracion:s.duracion,unidad:"USD",activo:true})), catalogo: (config.catalogoDefault || []).map((c,i)=>({id:`cat-${i+1}`,titulo:c.titulo,descripcion:c.descripcion,precio:c.precio,duracion:c.duracion,tags:c.tags,activo:false,iaGenerated:false})), mostrarServiciosProfesionales:false, testimonios:[], certificaciones:[], metodosPago:[], colorAccent:config.accent, plan:plan||"trial", trialInicio:Date.now(), trialFin:plan==="trial"?Date.now()+15*86400000:undefined, activo:true, verificado:false, createdAt:new Date(), updatedAt:new Date() };
    let profId: string;
    if (adminDb) { const r = await adminDb.collection("profesionales").add(data); profId = r.id; }
    else { const { createProfessional } = await import("@/lib/professionals-service"); profId = await createProfessional(data as any); }
    let emailSent = false; if (sendEmail) { try { await adminAuth.generatePasswordResetLink(email); emailSent = true; } catch {} }
    let whatsappUrl = ""; if (sendWhatsApp && whatsapp) { const msg = `¡Bienvenido a SaludPro! 🎉\n\nHola ${nombre},\n\nTu portafolio profesional está listo.\n\n📋 TUS DATOS:\n🌐 Login: tu-sitio.com/admin/login\n📧 Email: ${email}\n🔑 Contraseña: ${password}\n🔗 Portafolio: tu-sitio.com/c/${finalSlug}\n\n✨ Ya tienes ${config.serviciosDefault.length} servicios y ${config.catalogoDefault?.length || 0} items de catálogo pre-cargados según tu profesión (${config.label}). Solo agrega tus fotos o genera con IA.\n\n⚠️ Cambia tu contraseña al entrar.\n\nSaludPro 💚\nReinaldo Morales · Soluciones Digitales & IA`; whatsappUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g,"")}?text=${encodeURIComponent(msg)}`; }
    return NextResponse.json({ ok: true, uid, profId, password, url: `/c/${finalSlug}`, emailSent, whatsappUrl, message: `Creado: ${nombre}` });
  } catch (error: any) { console.error('[create-user] error:', error); return NextResponse.json({ ok: false, error: error.message }, { status: 500 }); }
}
