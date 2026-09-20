import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        registration: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(ideas, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}
