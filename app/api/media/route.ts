import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const slot = form.get('slot') as string | null;
  const altEn = (form.get('alt_en') as string) || '';
  const altAr = (form.get('alt_ar') as string) || '';

  if (!file || !slot) {
    return NextResponse.json({ success: false, message: 'file and slot required.' }, { status: 400 });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ success: false, message: 'Only JPG, PNG, WebP, GIF allowed.' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ success: false, message: 'Max file size is 8 MB.' }, { status: 400 });
  }

  const blob = await put(`harrasi/${slot}-${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  await sql`
    INSERT INTO media (slot, url, alt_en, alt_ar, updated_at)
    VALUES (${slot}, ${blob.url}, ${altEn}, ${altAr}, NOW())
    ON CONFLICT (slot) DO UPDATE SET url = ${blob.url}, alt_en = ${altEn}, alt_ar = ${altAr}, updated_at = NOW()
  `;

  return NextResponse.json({ success: true, url: blob.url });
}
