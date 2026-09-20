import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        login: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = registrations.map((reg) => ({
      id: reg.id,
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      role: reg.login?.role || "USER",
      createdAt: reg.createdAt,
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("GET Admin Users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, email, role, fullName, phone } = body;

    if (!registrationId && !email) {
      return NextResponse.json({ error: "Registration ID or Email is required" }, { status: 400 });
    }

    if (role && email) {
      await prisma.login.update({
        where: { email },
        data: { role },
      });
    } else if (role && registrationId) {
      await prisma.login.update({
        where: { registrationId },
        data: { role },
      });
    }

    if (registrationId && (fullName !== undefined || phone !== undefined)) {
      await prisma.registration.update({
        where: { id: registrationId },
        data: {
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone: phone || null }),
        },
      });
    }

    return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH Admin Users error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Admin Users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
