import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { ConsultationReport } from '@/models/ConsultationReport';
import { Conversation } from '@/models/Conversation';
import { MemoryItem } from '@/models/MemoryItem';
import { formatDhakaDateTime, generateReportId } from '@/lib/date';

export async function GET(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const reportIdQuery = searchParams.get('reportId');

    if (reportIdQuery) {
      const report = await ConsultationReport.findOne({ reportId: reportIdQuery }).lean();
      if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }
      return NextResponse.json({ report });
    }

    if (!sessionUser) {
      return NextResponse.json({ reports: [] });
    }

    const reports = await ConsultationReport.find({ userId: sessionUser._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error('Fetch reports error:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    const body = await req.json();
    const { conversationId, customPatientName, customAge, language = 'bn' } = body;

    await connectToDatabase();

    let symptoms: string[] = [];
    let discussionSummary = '';
    let generalGuidance = '';
    let recommendedNextSteps = '';
    let conversationRef: any = null;

    if (conversationId) {
      conversationRef = await Conversation.findById(conversationId);
      if (conversationRef) {
        const userMsgs = conversationRef.messages.filter((m: any) => m.role === 'user');
        const assistantMsgs = conversationRef.messages.filter((m: any) => m.role === 'assistant');

        symptoms = userMsgs.map((m: any) => m.content.slice(0, 100));

        discussionSummary =
          language === 'bn'
            ? `রোগী স্বাস্থ্য পরামর্শে ${userMsgs.length}টি প্রধান স্বাস্থ্য সমস্যার বিবরণ দিয়েছেন। প্রাথমিক স্বাস্থ্য যত্ন ও প্রয়োজনীয় সতর্কতা পর্যালোচনা করা হয়েছে।`
            : `Patient detailed ${userMsgs.length} symptom inquiries. Preliminary triage and non-drug self-care guidelines were discussed.`;

        // Extract guidance from assistant answers
        const lastAssistant = assistantMsgs.slice(-1)[0]?.content || '';
        generalGuidance = lastAssistant.slice(0, 600);

        recommendedNextSteps =
          language === 'bn'
            ? '১. রেজিস্টার্ড এমবিবিএস (MBBS) চিকিৎসকের সরাসরি শরণাপন্ন হোন।\n২. উপসর্গ বাড়লে অবিলম্বে নিকটস্থ হাসপাতালের জরুরি বিভাগে যোগাযোগ করুন।\n৩. পর্যাপ্ত বিশ্রাম ও তরল খাবার গ্রহণ করুন।'
            : '1. Consult a licensed MBBS physician for in-person examination and clinical testing.\n2. In case of worsening pain or emergency red flags, visit the nearest emergency room immediately.\n3. Ensure adequate rest and fluid intake.';
      }
    }

    // Load confirmed health info
    const confirmedHealthInfo = {
      allergies: [] as string[],
      conditions: [] as string[],
      currentMedicines: [] as string[],
      pregnancyStatus: sessionUser?.profile?.pregnancyStatus || '',
    };

    if (sessionUser) {
      const memories = await MemoryItem.find({
        userId: sessionUser._id,
        isConfirmed: true,
        status: 'active',
      }).lean();

      for (const m of memories) {
        if (m.infoType === 'allergy') confirmedHealthInfo.allergies.push(m.value);
        if (m.infoType === 'condition') confirmedHealthInfo.conditions.push(m.value);
        if (m.infoType === 'medicine') confirmedHealthInfo.currentMedicines.push(m.value);
      }
    }

    const reportId = generateReportId();
    const dateDhaka = formatDhakaDateTime(new Date(), language === 'en' ? 'en' : 'bn');

    const patientName =
      customPatientName ||
      sessionUser?.name ||
      (language === 'bn' ? 'বেনামী রোগী' : 'Anonymous Patient');

    const patientAge =
      customAge || sessionUser?.profile?.age || (language === 'bn' ? 'উল্লেখ নেই' : 'Not specified');

    const report = await ConsultationReport.create({
      reportId,
      userId: sessionUser?._id,
      conversationId: conversationRef?._id,
      patientName,
      patientAge,
      patientGender: sessionUser?.profile?.gender || '',
      dateDhaka,
      symptoms: symptoms.length > 0 ? symptoms : ['সাধারণ স্বাস্থ্য আলোচনা ও পরামর্শ'],
      confirmedHealthInfo,
      discussionSummary:
        discussionSummary ||
        (language === 'bn'
          ? 'সাধারণ স্বাস্থ্য সচেতনতা ও পরামর্শ পর্যালোচনা।'
          : 'General health consultation review.'),
      generalGuidance:
        generalGuidance ||
        (language === 'bn'
          ? 'শারীরিক যেকোনো জটিলতায় স্ব-চিকিৎসা পরিহার করে চিকিৎসকের শরণাপন্ন হোন।'
          : 'Avoid self-medication and seek professional clinical evaluation.'),
      recommendedNextSteps:
        recommendedNextSteps ||
        (language === 'bn'
          ? 'রেজিস্টার্ড চিকিৎসকের নিকট সরাসরি পরামর্শ ও প্রয়োজনীয় প্যাথলজিক্যাল পরীক্ষা করান।'
          : 'Consult registered doctor and conduct advised diagnostic tests.'),
      dataSources: 'অনলাইন ডক্টর সিস্টেম ও বিশ্ব স্বাস্থ্য সংস্থা / DGDA স্বাস্থ্য নির্দেশিকা',
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error: any) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create consultation report' }, { status: 500 });
  }
}
