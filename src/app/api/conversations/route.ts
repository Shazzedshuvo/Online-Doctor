import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Conversation } from '@/models/Conversation';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ conversations: [] });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('q')?.trim();

    const query: any = {
      userId: sessionUser._id,
      isDeleted: false,
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { 'messages.content': { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const conversations = await Conversation.find(query)
      .select('title createdAt updatedAt consentSettings messages')
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = conversations.map((conv) => ({
      id: conv._id.toString(),
      title: conv.title,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv.messages?.length || 0,
      preview: conv.messages?.slice(-1)[0]?.content?.slice(0, 60) || '',
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const { title = 'নতুন পরামর্শ' } = body;

    const conversation = await Conversation.create({
      userId: sessionUser._id,
      isGuest: false,
      title,
      consentSettings: {
        saveChatHistory: sessionUser.settings.saveChatHistory,
        rememberHealthInfo: sessionUser.settings.rememberHealthInfo,
      },
      messages: [],
    });

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation._id.toString(),
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: [],
      },
    });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
