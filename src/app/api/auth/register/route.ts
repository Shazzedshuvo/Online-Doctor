import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, signToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, password, name, language = 'bn' } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'ইমেইল, পাসওয়ার্ড এবং নাম আবশ্যক (All fields required)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে (Email already registered)' },
        { status: 409 }
      );
    }

    // Determine role (first user or admin email becomes admin)
    const userCount = await User.countDocuments();
    const isAdmin = userCount === 0 || cleanEmail === 'admin@onlinedoctor.ai' || cleanEmail.startsWith('admin');

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: cleanEmail,
      passwordHash,
      name: name.trim(),
      role: isAdmin ? 'admin' : 'user',
      profile: {
        preferredLanguage: language === 'en' ? 'en' : 'bn',
        medicalConditions: [],
        medicineAllergies: [],
        currentMedicines: [],
      },
      settings: {
        saveChatHistory: true,
        rememberHealthInfo: true,
        privacyConsentGiven: true,
        privacyConsentDate: new Date(),
      },
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Audit log
    await AuditLog.create({
      action: 'user_registered',
      category: 'auth',
      status: 'success',
      statusCode: 201,
    }).catch(() => {});

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profile: user.profile,
          settings: user.settings,
        },
      },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE_OPTIONS.name, token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'রেজিস্ট্রেশনে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' },
      { status: 500 }
    );
  }
}
