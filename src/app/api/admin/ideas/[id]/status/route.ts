import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Next.js 15+ compat
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const body = await req.json();
    const { status } = body;

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedIdea, { status: 200 });
  } catch (error: any) {
    console.error('Failed to update idea status:', error);
    return NextResponse.json({ error: 'Failed to update idea status' }, { status: 500 });
  }
}
