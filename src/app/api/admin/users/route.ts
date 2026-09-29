import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        settings: u.settings,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-passwordHash');

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
