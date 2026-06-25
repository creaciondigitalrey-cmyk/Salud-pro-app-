import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * POST /api/ai-improve-description
 * Body: { titulo: string, descripcion: string, profesion: string }
 *
 * Usa Google Gemini 3.5 Flash para mejorar la descripción de un servicio.
 * Con degradación elegante: si la API falla (región, key, etc.), la app sigue funcionando.
 */
export async function POST(req: NextRequest) {
  try {
    const { titulo, descripcion, profesion } = await req.json();

    if (!titulo || typeof titulo !== 'string') {
      return NextResponse.json({ ok: false, error: 'Título requerido' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        ok: false,
        error: 'IA no configurada. El administrador debe configurar GEMINI_API_KEY.',
        iaDisabled: true,
      }, { status: 503 });
    }

    const prompt = `Eres un copywriter experto en marketing de servicios de salud. Mejora la siguiente descripción de un servicio profesional para hacerla más atractiva, clara y vendedora, manteniendo la verdad técnica.

SERVICIO: ${titulo}
PROFESIÓN: ${profesion || 'Profesional de la salud'}
DESCRIPCIÓN ACTUAL: ${descripcion || '(sin descripción)'}

Reglas:
1. Máximo 2 oraciones (entre 150 y 250 caracteres).
2. Tono profesional pero cercano.
3. Menciona el beneficio principal para el paciente.
4. NO uses emojis.
5. NO inventes precios ni promesas falsas.
6. Responde SOLO con la descripción mejorada, sin explicaciones ni comillas.`;

    // Probar gemini-3.5-flash primero, caer a gemini-2.5-flash si falla
    const modelos = ['gemini-3.5-flash', 'gemini-2.5-flash'];
    let lastError = '';

    for (const modelo of modelos) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `HTTP ${response.status}`;

          // Si es error de región o key, no intentar el siguiente modelo
          if (response.status === 400 && lastError.includes('location is not supported')) {
            return NextResponse.json({
              ok: false,
              error: 'IA no disponible en este entorno. Funcionará cuando deployes a Vercel o Firebase Hosting.',
              iaDisabled: true,
              region: true,
            }, { status: 503 });
          }
          continue;
        }

        const data = await response.json();
        const improvedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (improvedText) {
          const cleanText = improvedText.replace(/^["'`]|["'`]$/g, '').trim();
          return NextResponse.json({
            ok: true,
            descripcion: cleanText,
            modelo,
          });
        }
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    return NextResponse.json({
      ok: false,
      error: lastError || 'La IA no respondió. Intenta de nuevo.',
    }, { status: 502 });
  } catch (error: any) {
    console.error('[ai-improve] error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message || 'Error interno',
    }, { status: 500 });
  }
}
