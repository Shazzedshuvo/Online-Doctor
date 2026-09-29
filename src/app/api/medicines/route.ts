import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Medicine } from '@/models/Medicine';
import { BANGLADESH_MEDICINES_DATASET } from '@/lib/seed-medicines';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Auto-seed or update if new dataset has more items or missing images
    const count = await Medicine.countDocuments();
    if (count < BANGLADESH_MEDICINES_DATASET.length) {
      console.log('Syncing expanded authentic Bangladesh medicines dataset...');
      for (const item of BANGLADESH_MEDICINES_DATASET) {
        await Medicine.findOneAndUpdate(
          { brandName: item.brandName, strength: item.strength },
          { $set: item },
          { upsert: true, new: true }
        );
      }
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const form = searchParams.get('form')?.trim();
    const manufacturer = searchParams.get('manufacturer')?.trim();

    const filter: any = {};

    if (query) {
      filter.$or = [
        { brandName: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } },
        { generalUses: { $regex: query, $options: 'i' } },
        { manufacturer: { $regex: query, $options: 'i' } },
      ];
    }

    if (form && form !== 'all') {
      filter.dosageForm = { $regex: form, $options: 'i' };
    }

    if (manufacturer && manufacturer !== 'all') {
      filter.manufacturer = { $regex: manufacturer, $options: 'i' };
    }

    const medicines = await Medicine.find(filter)
      .sort({ brandName: 1 })
      .limit(100)
      .lean();

    // Also get distinct forms and manufacturers for filter dropdowns
    const distinctForms = await Medicine.distinct('dosageForm');
    const distinctManufacturers = await Medicine.distinct('manufacturer');

    return NextResponse.json({
      medicines: medicines.map((m) => ({
        id: m._id.toString(),
        brandName: m.brandName,
        genericName: m.genericName,
        manufacturer: m.manufacturer,
        strength: m.strength,
        dosageForm: m.dosageForm,
        generalUses: m.generalUses,
        warnings: m.warnings,
        sideEffects: m.sideEffects,
        interactions: m.interactions,
        pregnancyCategory: m.pregnancyCategory,
        priceBdt: m.priceBdt,
        imageUrl: m.imageUrl,
        tabletAppearance: m.tabletAppearance,
        packagingColor: m.packagingColor,
        dataSource: m.dataSource,
        lastVerificationDate: m.lastVerificationDate,
        isVerified: m.isVerified,
      })),
      filterOptions: {
        dosageForms: distinctForms.filter(Boolean),
        manufacturers: distinctManufacturers.filter(Boolean),
      },
    });
  } catch (error: any) {
    console.error('Fetch medicines error:', error);
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'শুধুমাত্র অ্যাডমিন নতুন ঔষধ যুক্ত করতে পারেন (Admin only)' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const {
      brandName,
      genericName,
      manufacturer,
      strength,
      dosageForm,
      generalUses = [],
      warnings,
      sideEffects,
      interactions,
      priceBdt,
      dataSource = 'DGDA Approved Bangladesh National Formulary',
    } = body;

    if (!brandName || !genericName || !manufacturer || !strength || !dosageForm) {
      return NextResponse.json(
        { error: 'ব্র্যান্ড, জেনেরিক, প্রস্তুতকারক, শক্তি এবং মাত্রা আবশ্যক' },
        { status: 400 }
      );
    }

    const medicine = await Medicine.create({
      brandName: brandName.trim(),
      genericName: genericName.trim(),
      manufacturer: manufacturer.trim(),
      strength: strength.trim(),
      dosageForm: dosageForm.trim(),
      generalUses: Array.isArray(generalUses) ? generalUses : [generalUses],
      warnings: warnings || 'চিকিৎসকের পরামর্শ ছাড়া সেবন নিষেধ।',
      sideEffects: sideEffects || 'প্রয়োজনে চিকিৎসকের পরামর্শ নিন।',
      interactions: interactions || 'অন্য ওষুধের সঙ্গে মিথস্ক্রিয়া এড়াতে চিকিৎসকের সাথে কথা বলুন।',
      priceBdt: priceBdt ? Number(priceBdt) : undefined,
      dataSource,
      lastVerificationDate: new Date(),
      isVerified: true,
    });

    return NextResponse.json({ success: true, medicine }, { status: 201 });
  } catch (error: any) {
    console.error('Create medicine error:', error);
    return NextResponse.json({ error: 'Failed to create medicine' }, { status: 500 });
  }
}
