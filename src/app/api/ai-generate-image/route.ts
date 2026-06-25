import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs"; import path from "path";

export const runtime = 'nodejs';
export const maxDuration = 60;

let adminDb: Firestore | null = null;
try {
  const sa = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(sa)) {
    const s = JSON.parse(fs.readFileSync(sa, "utf8"));
    const a: App = getApps().find(x => x.name === "ai-img-db") || initializeApp({ credential: cert(s) }, "ai-img-db");
    adminDb = getFirestore(a);
  }
} catch (e) {}

/**
 * Mapeo de profesión → estilo de imagen para el prompt
 */
function getPromptStyle(profesion: string): string {
  const styles: Record<string, string> = {
    enfermera: "professional medical photography, syringe and nursing equipment, clean modern clinical setting, soft natural lighting, teal and white palette, no faces visible, no real patients, advertising style, high quality",
    "medico-general": "professional medical photography, stethoscope and medical equipment, modern doctor office, warm professional lighting, blue and white palette, no faces visible, advertising style",
    "medico-especialista": "professional medical photography, specialized medical equipment, modern clinic, soft lighting, blue palette, no faces visible, advertising style",
    psicologo: "calm and cozy therapy room, soft armchair, warm lighting, plants, peaceful atmosphere, no faces visible, professional photography, advertising style",
    fisioterapeuta: "modern physiotherapy equipment, clean clinic, bright lighting, motion and recovery theme, no faces visible, professional photography",
    nutricionista: "fresh healthy food, fruits and vegetables on clean table, bright natural lighting, green and orange palette, no faces visible, advertising style",
    odontologo: "modern dental equipment, clean dental chair, bright lighting, blue and white palette, no faces visible, professional medical photography",
    pediatra: "child-friendly medical setting, colorful and warm, soft lighting, no faces visible, professional photography, advertising style",
    "cuidador-adultos": "warm and caring environment for elderly care, soft lighting, comfortable setting, no faces visible, professional photography",
    doula: "warm and intimate maternity setting, soft natural lighting, peaceful atmosphere, no faces visible, professional photography",
    clinica: "modern medical clinic exterior or reception, clean professional architecture, bright lighting, no faces visible, advertising style",
    oftalmologo: "modern ophthalmology equipment, eye examination tools, clean clinic, blue palette, no faces visible, professional photography",
    podologo: "professional podiatry tools and clean treatment area, soft lighting, no faces visible, advertising style",
    entrenador: "modern gym or fitness equipment, dynamic athletic atmosphere, bright lighting, no faces visible, professional photography",
    esteticista: "modern beauty spa setting, clean aesthetic equipment, soft pink and gold lighting, no faces visible, advertising style",
    "nail-artist": "professional manicure tools and beautiful nail art display, clean modern salon, soft lighting, no faces visible, advertising style",
    estilista: "modern hair salon interior, professional styling tools, stylish atmosphere, warm lighting, no faces visible, advertising style",
  };
  return styles[profesion] || styles["enfermera"];
}

/**
 * POST /api/ai-generate-image
 * Body: { titulo: string, descripcion?: string, profesion: string, profesionalId: string }
 *
 * Genera una imagen publicitaria profesional usando Google Imagen 3.
 * Controla cuotas según el plan del profesional.
 */
export async function POST(req: NextRequest) {
  try {
    const { titulo, descripcion, profesion, profesionalId } = await req.json();

    if (!titulo || typeof titulo !== 'string') {
      return NextResponse.json({ ok: false, error: 'Título requerido' }, { status: 400 });
    }

    if (!profesionalId) {
      return NextResponse.json({ ok: false, error: 'ID del profesional requerido' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        error: 'IA no configurada. El administrador debe configurar GEMINI_API_KEY.',
        iaDisabled: true,
      }, { status: 503 });
    }

    // Verificar cuota del profesional
    const limitePorPlan: Record<string, number> = {
      trial: 1,
      pro: 5,
      premium: Infinity,
    };

    let profData: any = null;
    if (adminDb) {
      const profDoc = await adminDb.collection("profesionales").doc(profesionalId).get();
      if (profDoc.exists) {
        profData = profDoc.data();
        const plan = profData?.plan || 'trial';
        const limite = limitePorPlan[plan] ?? 1;

        // Contar imágenes IA generadas este mes
        const now = new Date();
        const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const catalogo: any[] = profData?.catalogo || [];
        const iaImagesMes = catalogo.filter(c => c.iaGenerated && c.iaGeneratedAt && c.iaGeneratedAt > inicioMes).length;

        if (iaImagesMes >= limite) {
          return NextResponse.json({
            ok: false,
            error: `Cuota de IA agotada (${iaImagesMes}/${limite} imágenes este mes). Tu plan ${plan} permite ${limite === Infinity ? 'ilimitadas' : limite} imágenes IA por mes. Sube una foto desde tu celular o espera al próximo mes.`,
            cuotaAgotada: true,
            limite,
            usado: iaImagesMes,
          }, { status: 429 });
        }
      }
    }

    // Construir prompt optimizado para Imagen 3
    const styleSuffix = getPromptStyle(profesion);
    const promptText = `Professional advertising photograph for: ${titulo}. ${descripcion || ''}. Style: ${styleSuffix}. High resolution, commercial quality, no text overlay, no watermarks, no real faces, no real patients.`;

    // Probar imagen-3.0-generate-002 y versiones alternativas
    const modelosImagen = [
      'imagen-3.0-generate-002',
      'imagen-3.0-fast-generate-001',
    ];
    let lastError = '';
    let regionBlocked = false;
    let modelNotFound = false;

    for (const modelo of modelosImagen) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:predict`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              instances: [{ prompt: promptText }],
              parameters: {
                sampleCount: 1,
                aspectRatio: "16:9",
                outputMimeType: "image/jpeg",
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;

          // Detectar bloqueo de región
          if (response.status === 400 && lastError.includes('location is not supported')) {
            regionBlocked = true;
            continue;
          }

          // Detectar modelo no disponible
          if (response.status === 404 || lastError.includes('is not found for API version')) {
            modelNotFound = true;
            continue;
          }

          // Otros errores (cuota, permisos, etc.)
          continue;
        }

        const data = await response.json();
        const imagenBase64 = data?.predictions?.[0]?.bytesBase64Encoded;

        if (imagenBase64) {
          // Guardar contador en Firestore
          if (adminDb && profData) {
            try {
              await adminDb.collection("ia_usage").add({
                profesionalId,
                tipo: 'imagen',
                modelo,
                titulo,
                timestamp: Date.now(),
              });
            } catch {}
          }

          return NextResponse.json({
            ok: true,
            imagen: `data:image/jpeg;base64,${imagenBase64}`,
            modelo,
            prompt: promptText,
          });
        }
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    // Mensajes de error claros según el tipo de fallo
    if (regionBlocked) {
      return NextResponse.json({
        ok: false,
        error: 'IA de imágenes no disponible en este entorno. Funcionará cuando deployes a Vercel o Firebase Hosting.',
        iaDisabled: true,
        region: true,
      }, { status: 503 });
    }

    if (modelNotFound) {
      return NextResponse.json({
        ok: false,
        error: 'El modelo de generación de imágenes no está disponible con tu API key. Verifica en Google AI Studio que Imagen 3 esté habilitado para tu proyecto.',
        iaDisabled: true,
        modelNotFound: true,
      }, { status: 503 });
    }

    return NextResponse.json({
      ok: false,
      error: 'La IA no pudo generar la imagen en este momento. Intenta de nuevo en unos segundos o sube una foto desde tu celular.',
    }, { status: 502 });
  } catch (error: any) {
    console.error('[ai-generate-image] error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message || 'Error interno',
    }, { status: 500 });
  }
}
