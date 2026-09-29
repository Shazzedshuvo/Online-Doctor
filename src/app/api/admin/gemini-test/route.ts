import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { testGeminiConnection } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);

    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'অ্যাডমিন অনুমতি আবশ্যক (Admin authorization required)' },
        { status: 403 }
      );
    }

    const result = await testGeminiConnection();

    return NextResponse.json({
      success: result.connected,
      model: result.model,
      latencyMs: result.latencyMs,
      message: result.message,
      status: result.status,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Connection test failed',
        status: 'error',
      },
      { status: 500 }
    );
  }
}
