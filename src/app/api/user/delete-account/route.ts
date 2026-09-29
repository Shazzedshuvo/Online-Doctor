import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Conversation } from '@/models/Conversation';
import { MemoryItem } from '@/models/MemoryItem';
import { ConsultationReport } from '@/models/ConsultationReport';
import { AuditLog } from '@/models/AuditLog';

export async function DELETE(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const userId = sessionUser._id;

    // Cascade delete all user records
    await Promise.all([
      User.deleteOne({ _id: userId }),
      Conversation.deleteMany({ userId }),
      MemoryItem.deleteMany({ userId }),
      ConsultationReport.deleteMany({ userId }),
    ]);

    await AuditLog.create({
      action: 'user_account_deleted_gdpr',
      category: 'auth',
      status: 'success',
      statusCode: 200,
    }).catch(() => {});

    const response = NextResponse.json({
      success: true,
      message: 'আপনার অ্যাকাউন্ট ও যাবতীয় ডেটা স্থায়ীভাবে মুছে ফেলা হয়েছে (Account permanently deleted)',
    });

    // Clear session cookie
    response.cookies.set(AUTH_COOKIE_OPTIONS.name, '', {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
