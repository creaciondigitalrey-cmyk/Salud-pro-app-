import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const maxDuration = 10;

/**
 * GET /api/qr?slug=juan-perez&size=400
 * Genera un código QR como imagen PNG que apunta a /c/[slug]
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const size = parseInt(searchParams.get('size') || '400', 10);

    if (!slug) {
      return NextResponse.json({ ok: false, error: 'Slug requerido' }, { status: 400 });
    }

    // URL pública del portafolio del profesional
    const baseUrl = req.nextUrl.origin;
    const portfolioUrl = `${baseUrl}/c/${slug}`;

    // Generar QR como buffer PNG
    const qrBuffer = await QRCode.toBuffer(portfolioUrl, {
      type: 'png',
      width: size,
      margin: 1,
      color: {
        dark: '#061520',  // QR en color oscuro del fondo SaludPro
        light: '#FFFFFF00', // Fondo transparente
      },
      errorCorrectionLevel: 'H', // Alta corrección para poder tener logo encima
    });

    // Devolver como imagen PNG
    return new NextResponse(qrBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400', // 24h
      },
    });
  } catch (error: any) {
    console.error('[qr] error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
