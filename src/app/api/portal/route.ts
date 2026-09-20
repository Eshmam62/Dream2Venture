import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let sessionData: any;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      sessionData = payload;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid session signature' }, { status: 401 });
    }

    const registrationId = sessionData.id;

    if (!registrationId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Fetch the registration user and their associated Idea
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        ideas: {
          orderBy: { createdAt: 'desc' },
        }
      }
    });

    if (!registration) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone
      },
      ideas: registration.ideas 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Portal API error:', error);
    return NextResponse.json({ error: 'Failed to fetch portal data' }, { status: 500 });
  }
}
