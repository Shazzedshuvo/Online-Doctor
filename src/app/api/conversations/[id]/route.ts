import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { Conversation } from '@/models/Conversation';
import { MemoryItem } from '@/models/MemoryItem';
import { ConsultationReport } from '@/models/ConsultationReport';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const conversation = await Conversation.findOne({
      _id: id,
      userId: sessionUser._id,
      isDeleted: false,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'আলোচনা পাওয়া যায়নি (Conversation not found)' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: conversation._id.toString(),
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      consentSettings: conversation.consentSettings,
      messages: conversation.messages,
    });
  } catch (error: any) {
    console.error('Fetch conversation error:', error);
    return NextResponse.json({ error: 'Failed to retrieve conversation' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: sessionUser._id, isDeleted: false },
      { title: title.trim(), updatedAt: new Date() },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation._id.toString(),
        title: conversation.title,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to rename conversation' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: id,
      userId: sessionUser._id,
      isDeleted: false,
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    conversation.isDeleted = true;
    await conversation.save();

    // Section 11 Requirement: Deleting a conversation must remove or update summaries and memories derived solely from it
    await MemoryItem.deleteMany({
      userId: sessionUser._id,
      sourceConversationId: conversation._id,
      source: 'chat_consultation',
    });

    await ConsultationReport.deleteMany({
      userId: sessionUser._id,
      conversationId: conversation._id,
    });

    return NextResponse.json({
      success: true,
      message: 'আলোচনা এবং সংশ্লিষ্ট তথ্য সফলভাবে মুছে ফেলা হয়েছে (Conversation and derived memories deleted)',
    });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}
