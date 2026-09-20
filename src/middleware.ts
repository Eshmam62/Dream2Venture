import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const path = request.nextUrl.pathname;

  const isAdminPath = path.startsWith('/admin');
  const isPortalPath = path.startsWith('/portal');

  if (isAdminPath || isPortalPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_fallback_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      const sessionData = payload as any;

      // Route Guard Logic
      if (isAdminPath && sessionData.role !== 'ADMIN') {
        // Users cannot enter admin
        return NextResponse.redirect(new URL('/portal', request.url));
      }

      if (isPortalPath && sessionData.role === 'ADMIN') {
        // Admins should not be in the portal
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    } catch (e) {
      // Invalid token format, clear it or just redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/portal/:path*'],
};
