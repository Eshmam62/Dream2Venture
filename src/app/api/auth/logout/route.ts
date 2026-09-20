import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    cookieStore.delete('token');
    cookieStore.delete('session');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

export async function GET(request: Request) {
  // In case the browser hits this URL directly, safely bounce to /login
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
  } catch(e) {}
  const url = new URL(request.url);
  return NextResponse.redirect(new URL('/login', url.origin));
}
