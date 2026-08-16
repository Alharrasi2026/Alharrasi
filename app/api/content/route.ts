import { NextRequest, NextResponse } from 'next/server';
import { sql, getAllContent, getAllMedia } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [content, media] = await Promise.all([getAllContent(), getAllMedia()]);
  return NextResponse.json({ success: true, content, media });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const body = await req.json(); // { key: string, value_en: string, value_ar: string }
  const { key, value_en, value_ar } = body;

  if (!key) return NextResponse.json({ success: false, message: 'key required' }, { status: 400 });

  await sql`
    INSERT INTO site_content (key, value_en, value_ar, updated_at)
    VALUES (${key}, ${value_en}, ${value_ar}, NOW())
    ON CONFLICT (key) DO UPDATE SET value_en = ${value_en}, value_ar = ${value_ar}, updated_at = NOW()
  `;

  return NextResponse.json({ success: true });
}
