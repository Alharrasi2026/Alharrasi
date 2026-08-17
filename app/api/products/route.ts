import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getProducts, createProduct } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: 'اسم المنتج مطلوب' }, { status: 400 });
  }

  const product = await createProduct({
    name: body.name,
    description: body.description || '',
    sectors: Array.isArray(body.sectors) ? body.sectors : [],
    material: body.material || '',
    common_use: body.common_use || '',
    feature: body.feature || '',
    icon_key: body.icon_key || 'circle',
    image_url: body.image_url || null,
    sort_order: body.sort_order ?? 99,
  });
  return NextResponse.json(product, { status: 201 });
}
