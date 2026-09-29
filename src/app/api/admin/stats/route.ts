import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { Conversation } from '@/models/Conversation';
import { Medicine } from '@/models/Medicine';
import { ConsultationReport } from '@/models/ConsultationReport';
import { AuditLog } from '@/models/AuditLog';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();

    const [usersCount, conversationsCount, medicinesCount, reportsCount, recentLogs] =
      await Promise.all([
        User.countDocuments(),
        Conversation.countDocuments({ isDeleted: false }),
        Medicine.countDocuments(),
        ConsultationReport.countDocuments(),
        AuditLog.find()
          .sort({ timestamp: -1 })
          .limit(20)
          .select('action category status statusCode modelUsed durationMs timestamp')
          .lean(),
      ]);

    return NextResponse.json({
      counts: {
        users: usersCount,
        conversations: conversationsCount,
        medicines: medicinesCount,
        reports: reportsCount,
      },
      configuredModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      geminiKeyConfigured: Boolean(
        process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_')
      ),
      recentLogs,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
