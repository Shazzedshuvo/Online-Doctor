import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { User, IUser } from '@/models/User';

const AUTH_SECRET = process.env.AUTH_SECRET || 'online_doctor_ai_default_secure_secret_2026';
const TOKEN_NAME = 'od_session_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<IUser | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(TOKEN_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
  } else {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_NAME)?.value;
    } catch {
      // In static or unsupported contexts
      token = undefined;
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.userId) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(payload.userId);
    return user;
  } catch (error) {
    console.error('Error fetching session user:', error);
    return null;
  }
}

export const AUTH_COOKIE_OPTIONS = {
  name: TOKEN_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
};
