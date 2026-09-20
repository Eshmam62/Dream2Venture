import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const rateLimit = new Map<string, { count: number, resetTime: number }>();

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long").max(100),
  phone: z.string().max(20).optional(),
  mobile: z.string().max(20).optional(),
}).refine(data => data.fullName || data.name, {
  message: "Full Name is required",
  path: ["fullName"]
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const limit = rateLimit.get(ip);
    
    if (limit && now < limit.resetTime) {
      if (limit.count >= 5) {
        return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 });
      }
      limit.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, resetTime: now + 60 * 1000 });
    }

    const body = await req.json();
    const parsedResult = registerSchema.safeParse(body);
    
    if (!parsedResult.success) {
      // Return the first specific validation error message instead of generic dump
      return NextResponse.json(
        { error: parsedResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = parsedResult.data;
    const fullName = parsedResult.data.fullName || parsedResult.data.name || "";
    const phone = parsedResult.data.phone || parsedResult.data.mobile || "";

    // রেজিস্ট্রেশন মডেলে চেক করা ইউজার আগে থেকে আছে কি না
    const existing = await prisma.registration.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email or mobile number already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // ১. Registration টেবিলে সেভ + ২. Login টেবিলে একই সাথে রিলেশনসহ সেভ
    const newRecord = await prisma.registration.create({
      data: {
        fullName,
        phone: phone || null,
        email,
        login: {
          create: {
            email,
            passwordHash,
            role: "USER",
          },
        },
      },
      include: {
        login: true,
      },
    });

    return NextResponse.json(
      {
        message: "Registration completed successfully!",
        user: {
          id: newRecord.id,
          fullName: newRecord.fullName,
          email: newRecord.email,
          role: newRecord.login?.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register backend error:", error);
    
    // Prisma unique constraint violation fallback
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "An account with this email or mobile number already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to connect to the server. Please try again in a few moments." },
      { status: 500 }
    );
  }
}
