import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { getSession } from '@/lib/auth';
import { getMedia, addMedia, deleteMedia } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const media = await getMedia();
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'لم يتم إرفاق ملف' }, { status: 400 });
  }

  try {
    const blob = await put(file.name, file, { access: 'public', addRandomSuffix: true });
    const saved = await addMedia(blob.url, blob.pathname);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'تعذّر رفع الصورة — تأكد من ربط Vercel Blob بالمشروع' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await req.json();
  const removed = await deleteMedia(Number(id));
  if (removed) {
    try {
      await del(removed.url);
    } catch {
      // blob already gone — ignore
    }
  }
  return NextResponse.json({ ok: true });
}
