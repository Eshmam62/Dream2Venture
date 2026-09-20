import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const rateLimit = new Map<string, { count: number, resetTime: number }>();

const prisma = new PrismaClient();

const formatUrl = (url: any, defaultName: string) => {
  const str = url ? String(url) : defaultName;
  if (str && !str.startsWith('http') && !str.startsWith('/')) {
    return `/uploads/${str}`;
  }
  return str;
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= 10) {
        return NextResponse.json({ success: false, message: "Too many submission attempts." }, { status: 429 });
      }
      limit.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    }

    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let sessionData;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      sessionData = payload as any;
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const loggedInUserId = sessionData.id;

    if (!loggedInUserId) {
      return NextResponse.json({ success: false, message: 'User ID missing in session' }, { status: 400 });
    }

    // প্রতিবার নতুন আইডিয়া ডাটাবেজে তৈরি করা
    const newIdea = await prisma.idea.create({
      data: {
        registrationId: loggedInUserId,
        participationType: String(body.participationType || 'Individual'),
        teamName: body.teamName ? String(body.teamName) : null,
        teamLeader: body.teamLeader ? String(body.teamLeader) : null,
        teamMembers: body.teamMembers ? (typeof body.teamMembers === 'string' ? body.teamMembers : JSON.stringify(body.teamMembers)) : null,
        universityName: body.universityName ? String(body.universityName) : null,
        universityIdUrl: body.universityIdUrl ? formatUrl(body.universityIdUrl, '') : null,
        resumeUrl: body.resumeUrl ? formatUrl(body.resumeUrl, '') : null,
        nidUrls: body.nidUrls ? formatUrl(body.nidUrls, '') : null,
        segment: body.segment ? String(body.segment) : (body.category ? String(body.category) : 'Digital & AI'),
        category: body.category ? String(body.category) : (body.segment ? String(body.segment) : 'Digital & AI'),
        title: body.title ? String(body.title) : 'Untitled Pitch',
        problemStatement: body.problemStatement ? String(body.problemStatement) : 'Problem description details',
        solution: body.solution ? String(body.solution) : 'Proposed solution details',
        stage: body.stage ? String(body.stage) : 'Idea',
        deckUrl: body.deckUrl ? formatUrl(body.deckUrl, '') : null,
        videoUrl: body.videoUrl ? String(body.videoUrl) : null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, idea: newIdea }, { status: 200 });
  } catch (error: any) {
    console.error('Submission API Error:', error);
    return NextResponse.json(
      { success: false, message: "Unable to connect to the server. Please try again in a few moments." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= 20) {
        return NextResponse.json({ success: false, message: "Too many edit attempts." }, { status: 429 });
      }
      limit.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    }

    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let sessionData;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      sessionData = payload as any;
    } catch (e) {
      return NextResponse.json({ success: false, message: 'Invalid session' }, { status: 401 });
    }

    const loggedInUserId = sessionData.id;
    const ideaId = body.ideaId || body.id;

    if (!ideaId || !loggedInUserId) {
      return NextResponse.json({ success: false, message: 'Idea ID and valid session are required.' }, { status: 400 });
    }

    const existingIdea = await prisma.idea.findFirst({
      where: { id: String(ideaId), registrationId: loggedInUserId }
    });

    if (!existingIdea) {
      return NextResponse.json({ success: false, message: 'Idea not found or unauthorized.' }, { status: 403 });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id: String(ideaId) },
      data: {
        participationType: body.participationType ? String(body.participationType) : undefined,
        teamName: body.teamName ? String(body.teamName) : undefined,
        teamLeader: body.teamLeader ? String(body.teamLeader) : undefined,
        teamMembers: body.teamMembers ? (typeof body.teamMembers === 'string' ? body.teamMembers : JSON.stringify(body.teamMembers)) : undefined,
        universityName: body.universityName ? String(body.universityName) : undefined,
        segment: body.segment ? String(body.segment) : (body.category ? String(body.category) : undefined),
        category: body.category ? String(body.category) : (body.segment ? String(body.segment) : undefined),
        title: body.title ? String(body.title) : undefined,
        problemStatement: body.problemStatement ? String(body.problemStatement) : undefined,
        solution: body.solution ? String(body.solution) : undefined,
        stage: body.stage ? String(body.stage) : undefined,
        deckUrl: body.deckUrl ? formatUrl(body.deckUrl, '') : undefined,
        resumeUrl: body.resumeUrl ? formatUrl(body.resumeUrl, '') : undefined,
        nidUrls: body.nidUrls ? formatUrl(body.nidUrls, '') : undefined,
        universityIdUrl: body.universityIdUrl ? formatUrl(body.universityIdUrl, '') : undefined,
        videoUrl: body.videoLink || body.videoUrl ? String(body.videoLink || body.videoUrl) : undefined,
      }
    });

    return NextResponse.json({ success: true, idea: updatedIdea }, { status: 200 });
  } catch (error: any) {
    console.error('Submission API PATCH Error:', error);
    return NextResponse.json(
      { success: false, message: "Unable to connect to the server. Please try again in a few moments." },
      { status: 500 }
    );
  }
}