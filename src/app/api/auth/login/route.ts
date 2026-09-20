import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { SignJWT } from "jose";

// Basic memory rate limiter (clears on restart/serverless cold start)
const rateLimit = new Map<string, { count: number, resetTime: number }>();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= 10) {
        return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
      }
      limit.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    }

    const body = await req.json();
    const parsedResult = loginSchema.safeParse(body);
    
    if (!parsedResult.success) {
      return NextResponse.json(
        { error: parsedResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsedResult.data;

    const loginRecord = await prisma.login.findUnique({
      where: { email },
      include: { registration: true },
    });

    if (!loginRecord) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, loginRecord.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionData = {
      id: loginRecord.registrationId,
      email: loginRecord.email,
      role: loginRecord.role,
      fullName: loginRecord.registration.fullName,
    };

    const cookieStore = await cookies();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
    const jwt = await new SignJWT(sessionData)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret);

    cookieStore.set("auth_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    const ideaRecord = await prisma.idea.findFirst({
      where: { registrationId: loginRecord.registrationId }
    });

    return NextResponse.json({
      message: "Login successful!",
      role: sessionData.role,
      email: sessionData.email,
      fullName: sessionData.fullName,
      hasSubmission: !!ideaRecord,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Login backend error:", error);
    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again in a few moments." },
      { status: 500 }
    );
  }
}
