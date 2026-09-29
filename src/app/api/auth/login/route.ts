import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { verifyPassword, signToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'ইমেইল এবং পাসওয়ার্ড প্রদান করুন (Email and password required)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে (Invalid email or password)' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে (Invalid email or password)' },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await AuditLog.create({
      action: 'user_logged_in',
      category: 'auth',
      status: 'success',
      statusCode: 200,
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        settings: user.settings,
      },
    });

    response.cookies.set(AUTH_COOKIE_OPTIONS.name, token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'লগইনে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
