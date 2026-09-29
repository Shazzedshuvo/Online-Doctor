import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Medicine } from '@/models/Medicine';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const medicine = await Medicine.findById(id).lean();

    if (!medicine) {
      return NextResponse.json({ error: 'ঔষধের বিবরণ পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({
      id: medicine._id.toString(),
      brandName: medicine.brandName,
      genericName: medicine.genericName,
      manufacturer: medicine.manufacturer,
      strength: medicine.strength,
      dosageForm: medicine.dosageForm,
      generalUses: medicine.generalUses,
      warnings: medicine.warnings,
      sideEffects: medicine.sideEffects,
      interactions: medicine.interactions,
      pregnancyCategory: medicine.pregnancyCategory,
      priceBdt: medicine.priceBdt,
      dataSource: medicine.dataSource,
      lastVerificationDate: medicine.lastVerificationDate,
      isVerified: medicine.isVerified,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch medicine details' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const updated = await Medicine.findByIdAndUpdate(
      id,
      {
        ...body,
        lastVerificationDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, medicine: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update medicine' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectToDatabase();
    await Medicine.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'ঔষধ রেকর্ড মুছে ফেলা হয়েছে' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete medicine' }, { status: 500 });
  }
}
