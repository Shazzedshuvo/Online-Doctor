import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { ConsultationReport } from '@/models/ConsultationReport';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const report = await ConsultationReport.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { reportId: id }],
    }).lean();

    if (!report) {
      return NextResponse.json({ error: 'রিপোর্টটি পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve report' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);

    // Only authorized doctor / admin can approve a clinician prescription
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'শুধুমাত্র রেজিস্টার্ড চিকিৎসক বা অ্যাডমিন প্রেসক্রিপশন অনুমোদন করতে পারেন।' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const {
      approvedByDoctorName,
      bmdcRegistrationNumber,
      hospitalAffiliation,
      clinicianNotes,
      prescribedMedicines,
    } = body;

    if (!approvedByDoctorName || !bmdcRegistrationNumber) {
      return NextResponse.json(
        { error: 'চিকিৎসকের নাম ও BMDC রেজিস্ট্রেশন নম্বর বাধ্যতামূলক।' },
        { status: 400 }
      );
    }

    const report = await ConsultationReport.findOneAndUpdate(
      { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { reportId: id }] },
      {
        clinicianVerification: {
          isPrescriptionApproved: true,
          approvedByDoctorName: approvedByDoctorName.trim(),
          bmdcRegistrationNumber: bmdcRegistrationNumber.trim(),
          hospitalAffiliation: hospitalAffiliation?.trim() || '',
          clinicianNotes: clinicianNotes?.trim() || '',
          prescribedMedicines: Array.isArray(prescribedMedicines) ? prescribedMedicines : [],
          approvedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
