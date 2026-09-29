import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { MemoryItem } from '@/models/MemoryItem';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ memories: [] });
    }

    await connectToDatabase();
    const memories = await MemoryItem.find({
      userId: sessionUser._id,
      status: { $in: ['active', 'outdated'] },
    }).sort({ createdAt: -1 });

    const formatted = memories.map((m) => ({
      id: m._id.toString(),
      infoType: m.infoType,
      key: m.key,
      value: m.value,
      isConfirmed: m.isConfirmed,
      source: m.source,
      status: m.status,
      recordedAt: m.recordedAt,
      lastConfirmedAt: m.lastConfirmedAt,
    }));

    return NextResponse.json({
      memories: formatted,
      settings: {
        rememberHealthInfo: sessionUser.settings.rememberHealthInfo,
        saveChatHistory: sessionUser.settings.saveChatHistory,
      },
    });
  } catch (error: any) {
    console.error('Fetch memory error:', error);
    return NextResponse.json({ error: 'Failed to retrieve memory items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { infoType, key, value, isConfirmed = true, source = 'user_manual' } = body;

    if (!infoType || !key || !value) {
      return NextResponse.json(
        { error: 'তথ্যের ধরণ, শিরোনাম এবং বিবরণ আবশ্যক (infoType, key, value required)' },
        { status: 400 }
      );
    }

    // Check if an existing memory for this key exists
    let memoryItem = await MemoryItem.findOne({
      userId: sessionUser._id,
      infoType,
      key: key.trim(),
    });

    if (memoryItem) {
      memoryItem.value = value.trim();
      memoryItem.isConfirmed = Boolean(isConfirmed);
      memoryItem.status = 'active';
      memoryItem.lastConfirmedAt = new Date();
      await memoryItem.save();
    } else {
      memoryItem = await MemoryItem.create({
        userId: sessionUser._id,
        infoType,
        key: key.trim(),
        value: value.trim(),
        isConfirmed: Boolean(isConfirmed),
        source,
        status: 'active',
        recordedAt: new Date(),
        lastConfirmedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      memory: {
        id: memoryItem._id.toString(),
        infoType: memoryItem.infoType,
        key: memoryItem.key,
        value: memoryItem.value,
        isConfirmed: memoryItem.isConfirmed,
        status: memoryItem.status,
      },
    });
  } catch (error: any) {
    console.error('Add memory error:', error);
    return NextResponse.json({ error: 'Failed to save memory item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const clearAll = searchParams.get('all') === 'true';

    if (clearAll) {
      await MemoryItem.deleteMany({ userId: sessionUser._id });
      return NextResponse.json({
        success: true,
        message: 'সমস্ত স্বাস্থ্য স্মৃতি সফলভাবে মুছে ফেলা হয়েছে (All memories cleared)',
      });
    }

    return NextResponse.json({ error: 'Specify ?all=true to clear all' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to clear memories' }, { status: 500 });
  }
}
