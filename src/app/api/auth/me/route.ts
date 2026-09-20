import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let sessionData: any;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      sessionData = payload;
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (!sessionData || !sessionData.email) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check actual DB role
    const dbUser = await prisma.login.findUnique({
      where: { email: sessionData.email },
      select: { role: true },
    });

    return NextResponse.json({
      authenticated: !!dbUser,
      role: dbUser?.role || null,
      email: sessionData.email,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
