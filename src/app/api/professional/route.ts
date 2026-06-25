import { NextRequest, NextResponse } from 'next/server';
import { getProfessionalBySlug, getProfessionalById, getPublishedProfessionals } from '@/lib/professionals-service';
import { isFirebaseConfigured } from '@/lib/firebase';
import { DEMO_PROFESSIONAL } from '@/lib/demo-data';
export const runtime = 'nodejs';
export const revalidate = 60;
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    if (!isFirebaseConfigured) {
      if (slug === DEMO_PROFESSIONAL.slug) return NextResponse.json({ professional: DEMO_PROFESSIONAL, ok: true, demo: true });
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    if (slug) {
      if (slug === DEMO_PROFESSIONAL.slug) return NextResponse.json({ professional: DEMO_PROFESSIONAL, ok: true, demo: true });
      const prof = await getProfessionalBySlug(slug);
      if (!prof) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ professional: prof, ok: true });
    }
    if (id) {
      const prof = await getProfessionalById(id);
      if (!prof) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ professional: prof, ok: true });
    }
    const list = await getPublishedProfessionals();
    return NextResponse.json({ professionals: list, ok: true });
  } catch (error: any) {
    const slug = new URL(req.url).searchParams.get('slug');
    if (slug === DEMO_PROFESSIONAL.slug) return NextResponse.json({ professional: DEMO_PROFESSIONAL, ok: true, demo: true });
    return NextResponse.json({ ok: false, error: 'Failed' }, { status: 500 });
  }
}
