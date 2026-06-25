import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs"; import path from "path";

export const runtime = 'nodejs';
export const revalidate = 300; // 5 minutos

let cachedRate: { value: number; date: string; lastUpdate: number; source: string } | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos en memoria

let adminDb: Firestore | null = null;
try {
  const sa = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(sa)) {
    const s = JSON.parse(fs.readFileSync(sa, "utf8"));
    const a: App = getApps().find(x => x.name === "bcv-db") || initializeApp({ credential: cert(s) }, "bcv-db");
    adminDb = getFirestore(a);
  }
} catch (e) {}

/**
 * GET /api/bcv
 * Devuelve la tasa del dólar del BCV actualizada.
 * Estrategia:
 *   1. Cache en memoria (30 min)
 *   2. Firestore (config/bcv) - actualizable por super admin manualmente
 *   3. BCV oficial (https://www.bcv.org.ve)
 *   4. PyDolarVE API
 *   5. Monitor Dolar API
 *   6. Fallback hardcoded (con advertencia)
 */
export async function GET() {
  try {
    // 1. Cache en memoria
    if (cachedRate && Date.now() - cachedRate.lastUpdate < CACHE_DURATION) {
      return NextResponse.json({
        ok: true,
        rate: cachedRate.value,
        date: cachedRate.date,
        source: cachedRate.source,
        cached: true,
      });
    }

    // 2. Firestore - tasa guardada manualmente por super admin
    if (adminDb) {
      try {
        const doc = await adminDb.collection("config").doc("bcv").get();
        if (doc.exists) {
          const data = doc.data() as any;
          if (data?.rate && data?.updatedAt) {
            const lastUpdate = data.updatedAt instanceof Date ? data.updatedAt.getTime() : (data.updatedAt as number);
            // Si la tasa guardada tiene menos de 24 horas, usarla
            if (Date.now() - lastUpdate < 24 * 60 * 60 * 1000) {
              const dateStr = data.date || new Date(lastUpdate).toISOString().split('T')[0];
              cachedRate = { value: data.rate, date: dateStr, lastUpdate, source: data.source || 'BCV (manual)' };
              return NextResponse.json({
                ok: true,
                rate: data.rate,
                date: dateStr,
                source: data.source || 'BCV (manual)',
                cached: false,
                manual: true,
              });
            }
          }
        }
      } catch (e) {
        console.error('[bcv] Firestore error:', e);
      }
    }

    // 3-5. Intentar fuentes externas
    const sources = [
      {
        name: 'BCV oficial',
        url: 'https://www.bcv.org.ve/',
        parse: (html: string) => {
          // El BCV tiene el formato: <strong>USD</strong> <strong class="...">XXX,XX</strong>
          const m = html.match(/USD\s*<\/strong>\s*<strong[^>]*>\s*([\d.,]+)/i);
          if (m) return parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
          // Backup: buscar número con formato XX,XX cerca de "dólar"
          const m2 = html.match(/d[óo]lar[^0-9]*([\d.,]+)/i);
          if (m2) return parseFloat(m2[1].replace(/\./g, '').replace(',', '.'));
          return null;
        },
        extract: 'html',
      },
      {
        name: 'PyDolarVE',
        url: 'https://pydolarve.org/api/v1/dollar?page=bcv&monitor=usd',
        parse: (json: any) => json?.price ? parseFloat(json.price) : (json?.data?.price ? parseFloat(json.data.price) : null),
        extract: 'json',
      },
      {
        name: 'Monitor Dolar',
        url: 'https://monitor-dolar-venezuela.com/api/tasa',
        parse: (json: any) => json?.bcv ? parseFloat(json.bcv) : null,
        extract: 'json',
      },
    ];

    for (const src of sources) {
      try {
        const res = await fetch(src.url, {
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': src.extract === 'json' ? 'application/json' : 'text/html',
          },
        });

        if (res.ok) {
          const text = await res.text();
          let parsed: any = null;
          if (src.extract === 'json') {
            try { parsed = JSON.parse(text); } catch { continue; }
          } else {
            parsed = text;
          }
          const rate = src.parse(parsed);
          if (rate && rate > 50 && rate < 1000) {
            cachedRate = {
              value: rate,
              date: new Date().toISOString().split('T')[0],
              lastUpdate: Date.now(),
              source: src.name,
            };

            // Guardar en Firestore para respaldo
            if (adminDb) {
              try {
                await adminDb.collection("config").doc("bcv").set({
                  rate,
                  date: cachedRate.date,
                  source: src.name,
                  updatedAt: new Date(),
                }, { merge: true });
              } catch {}
            }

            return NextResponse.json({
              ok: true,
              rate,
              date: cachedRate.date,
              source: src.name,
              cached: false,
            });
          }
        }
      } catch (e) {
        // Continuar con la siguiente fuente
        continue;
      }
    }

    // 6. Fallback - tasa hardcoded con aviso claro
    return NextResponse.json({
      ok: true,
      rate: 245.50,
      date: new Date().toISOString().split('T')[0],
      source: 'BCV (respaldo - no se pudo actualizar)',
      fallback: true,
      warning: 'No se pudo conectar con las fuentes del BCV. Usa el panel de Super Admin → Configuración para actualizar la tasa manualmente.',
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: true,
      rate: 245.50,
      date: new Date().toISOString().split('T')[0],
      source: 'BCV (respaldo - error)',
      fallback: true,
    });
  }
}

/**
 * POST /api/bcv
 * Permite al super admin actualizar la tasa manualmente
 */
export async function POST(req: Request) {
  try {
    const { rate, source } = await req.json();
    if (!rate || typeof rate !== 'number' || rate < 50 || rate > 1000) {
      return NextResponse.json({ ok: false, error: 'Tasa inválida (debe estar entre 50 y 1000)' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ ok: false, error: 'Firebase no configurado' }, { status: 500 });
    }

    const date = new Date().toISOString().split('T')[0];
    await adminDb.collection("config").doc("bcv").set({
      rate,
      date,
      source: source || 'BCV (manual)',
      updatedAt: new Date(),
    }, { merge: true });

    // Actualizar cache en memoria
    cachedRate = {
      value: rate,
      date,
      lastUpdate: Date.now(),
      source: source || 'BCV (manual)',
    };

    return NextResponse.json({
      ok: true,
      message: 'Tasa actualizada correctamente',
      rate,
      date,
      source: source || 'BCV (manual)',
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
