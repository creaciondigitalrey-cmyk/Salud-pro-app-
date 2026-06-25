import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs"; import path from "path";

export const runtime = 'nodejs';
export const maxDuration = 30;

let adminDb: Firestore | null = null;
try {
  const sa = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(sa)) {
    const s = JSON.parse(fs.readFileSync(sa, "utf8"));
    const a: App = getApps().find(x => x.name === "admin-upd") || initializeApp({ credential: cert(s) }, "admin-upd");
    adminDb = getFirestore(a);
  }
} catch (e) {}

export async function POST(req: NextRequest) {
  try {
    const { id, data } = await req.json();

    if (!id || !data) {
      return NextResponse.json({ ok: false, error: "Faltan id o data" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ ok: false, error: "Admin SDK no configurado. Verifica firebase-service-account.json" }, { status: 500 });
    }

    // Verificar que el documento existe antes de actualizar
    const docRef = adminDb.collection("profesionales").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        ok: false,
        error: `No se encontró el profesional con ID: ${id}`,
      }, { status: 404 });
    }

    await docRef.update({ ...data, updatedAt: new Date() });

    return NextResponse.json({ ok: true, message: "Guardado correctamente" });
  } catch (error: any) {
    console.error('[update-professional] error:', error);

    // Mensaje más amigable para errores comunes
    let friendlyError = error.message;
    if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
      friendlyError = "El profesional no existe en la base de datos.";
    } else if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
      friendlyError = "Sin permisos para actualizar. Verifica las reglas de Firestore.";
    }

    return NextResponse.json({ ok: false, error: friendlyError }, { status: 500 });
  }
}
