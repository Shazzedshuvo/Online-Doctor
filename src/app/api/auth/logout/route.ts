import { NextResponse } from 'next/server';
import { AUTH_COOKIE_OPTIONS } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'সফলভাবে লগআউট হয়েছে (Logged out)' });
  response.cookies.set(AUTH_COOKIE_OPTIONS.name, '', {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 0,
  });
  return response;
}
