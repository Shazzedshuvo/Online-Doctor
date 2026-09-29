import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { MemoryItem } from '@/models/MemoryItem';

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
    const { value, isConfirmed, status } = body;

    const memoryItem = await MemoryItem.findOne({
      _id: id,
      userId: sessionUser._id,
    });

    if (!memoryItem) {
      return NextResponse.json({ error: 'স্মৃতি তথ্য পাওয়া যায়নি' }, { status: 404 });
    }

    if (value !== undefined) memoryItem.value = String(value).trim();
    if (isConfirmed !== undefined) {
      memoryItem.isConfirmed = Boolean(isConfirmed);
      if (memoryItem.isConfirmed) {
        memoryItem.lastConfirmedAt = new Date();
      }
    }
    if (status && ['active', 'outdated', 'dismissed'].includes(status)) {
      memoryItem.status = status;
    }

    await memoryItem.save();

    return NextResponse.json({
      success: true,
      memory: {
        id: memoryItem._id.toString(),
        infoType: memoryItem.infoType,
        key: memoryItem.key,
        value: memoryItem.value,
        isConfirmed: memoryItem.isConfirmed,
        status: memoryItem.status,
        lastConfirmedAt: memoryItem.lastConfirmedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update memory item' }, { status: 500 });
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
    const result = await MemoryItem.deleteOne({
      _id: id,
      userId: sessionUser._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Memory item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'স্মৃতি সফলভাবে মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete memory item' }, { status: 500 });
  }
}
