import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const user = await prisma.login.findUnique({
      where: { email },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json({ exists: false, role: null }, { status: 200 });
    }

    return NextResponse.json({ exists: true, role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Verify Role error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
