import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Medicine } from '@/models/Medicine';
import { getSessionUser } from '@/lib/auth';
import { AuditLog } from '@/models/AuditLog';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন ডেটাসেট ইমপোর্ট করতে পারেন' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const { items, dataSource = 'DGDA Approved Dataset', format = 'json' } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'বৈধ ঔষধ তালিকা প্রদান করুন (Empty or invalid dataset)' },
        { status: 400 }
      );
    }

    const batchId = `BATCH-${Date.now()}-${nanoid(6)}`;
    let importedCount = 0;
    let duplicateCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.brandName || !item.genericName || !item.manufacturer) {
        errors.push(`Row ${i + 1}: Missing brandName, genericName, or manufacturer`);
        continue;
      }

      const brand = item.brandName.trim();
      const generic = item.genericName.trim();
      const mfr = item.manufacturer.trim();
      const strength = (item.strength || 'Standard').trim();
      const dosageForm = (item.dosageForm || 'Tablet').trim();

      // Duplicate check
      const existing = await Medicine.findOne({
        brandName: { $regex: new RegExp(`^${brand}$`, 'i') },
        manufacturer: { $regex: new RegExp(`^${mfr}$`, 'i') },
        strength: { $regex: new RegExp(`^${strength}$`, 'i') },
      });

      if (existing) {
        duplicateCount++;
        continue;
      }

      let generalUses = item.generalUses;
      if (typeof generalUses === 'string') {
        generalUses = generalUses.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (!Array.isArray(generalUses)) {
        generalUses = [];
      }

      await Medicine.create({
        brandName: brand,
        genericName: generic,
        manufacturer: mfr,
        strength,
        dosageForm,
        generalUses,
        warnings: item.warnings || 'চিকিৎসকের পরামর্শ ছাড়া সেবন নিষেধ।',
        sideEffects: item.sideEffects || 'প্রয়োজনে চিকিৎসকের পরামর্শ নিন।',
        interactions: item.interactions || 'অন্য ওষুধের সঙ্গে মিথস্ক্রিয়া এড়াতে চিকিৎসকের সাথে কথা বলুন।',
        pregnancyCategory: item.pregnancyCategory || 'C',
        priceBdt: item.priceBdt ? Number(item.priceBdt) : undefined,
        dataSource,
        importedBatchId: batchId,
        lastVerificationDate: new Date(),
        isVerified: true,
      });

      importedCount++;
    }

    await AuditLog.create({
      action: 'medicine_dataset_imported',
      category: 'medicine_import',
      status: 'success',
      statusCode: 200,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      batchId,
      importedCount,
      duplicateCount,
      errorsCount: errors.length,
      errors: errors.slice(0, 10),
    });
  } catch (error: any) {
    console.error('Import medicines error:', error);
    return NextResponse.json({ error: 'ইমপোর্ট প্রক্রিয়ায় ত্রুটি ঘটেছে' }, { status: 500 });
  }
}
