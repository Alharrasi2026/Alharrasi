import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { updateProduct, deleteProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const id = Number(params.id);
  const body = await req.json();
  await updateProduct(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const id = Number(params.id);
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
