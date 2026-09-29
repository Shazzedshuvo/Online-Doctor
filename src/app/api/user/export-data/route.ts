import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Conversation } from '@/models/Conversation';
import { MemoryItem } from '@/models/MemoryItem';
import { ConsultationReport } from '@/models/ConsultationReport';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const [conversations, memories, reports] = await Promise.all([
      Conversation.find({ userId: sessionUser._id, isDeleted: false }).lean(),
      MemoryItem.find({ userId: sessionUser._id }).lean(),
      ConsultationReport.find({ userId: sessionUser._id }).lean(),
    ]);

    const exportPayload = {
      exportTimestamp: new Date().toISOString(),
      user: {
        id: sessionUser._id,
        email: sessionUser.email,
        name: sessionUser.name,
        profile: sessionUser.profile,
        settings: sessionUser.settings,
        createdAt: sessionUser.createdAt,
      },
      conversations,
      healthMemories: memories,
      consultationReports: reports,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="online-doctor-ai-data-${sessionUser._id}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Export data error:', error);
    return NextResponse.json({ error: 'Failed to export account data' }, { status: 500 });
  }
}
