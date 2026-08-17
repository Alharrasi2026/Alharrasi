import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { updateAdminPassword } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل' }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await updateAdminPassword(session.username, hash);
  return NextResponse.json({ ok: true });
}
