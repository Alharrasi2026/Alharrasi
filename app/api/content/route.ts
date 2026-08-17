import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSiteContent, updateSiteContent } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const entries = await req.json();
  await updateSiteContent(entries);
  const content = await getSiteContent();
  return NextResponse.json(content);
}
