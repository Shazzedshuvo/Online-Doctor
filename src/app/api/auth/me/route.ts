import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { MemoryItem } from '@/models/MemoryItem';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser(req);
    if (!sessionUser) {
      return NextResponse.json(
        { error: 'অননুমোদিত এক্সেস। অনুগ্রহ করে লগইন করুন (Unauthorized)' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const { name, profile, settings } = body;

    const user = await User.findById(sessionUser._id);
    if (!user) {
      return NextResponse.json({ error: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি' }, { status: 404 });
    }

    if (name && typeof name === 'string') {
      user.name = name.trim();
    }

    if (profile && typeof profile === 'object') {
      user.profile = {
        ...user.profile,
        age: profile.age !== undefined ? Number(profile.age) : user.profile?.age,
        dob: profile.dob !== undefined ? profile.dob : user.profile?.dob,
        gender: profile.gender !== undefined ? profile.gender : user.profile?.gender,
        preferredLanguage: profile.preferredLanguage || user.profile?.preferredLanguage || 'bn',
        medicalConditions: Array.isArray(profile.medicalConditions)
          ? profile.medicalConditions
          : user.profile?.medicalConditions || [],
        medicineAllergies: Array.isArray(profile.medicineAllergies)
          ? profile.medicineAllergies
          : user.profile?.medicineAllergies || [],
        currentMedicines: Array.isArray(profile.currentMedicines)
          ? profile.currentMedicines
          : user.profile?.currentMedicines || [],
        pregnancyStatus: profile.pregnancyStatus !== undefined ? profile.pregnancyStatus : user.profile?.pregnancyStatus,
        emergencyContact: profile.emergencyContact || user.profile?.emergencyContact,
      };

      // If user consented to health memory, sync profile allergies and conditions to MemoryItem collection
      if (user.settings.rememberHealthInfo) {
        // Sync allergies
        for (const allergy of user.profile.medicineAllergies || []) {
          if (allergy && allergy.trim()) {
            await MemoryItem.findOneAndUpdate(
              { userId: user._id, infoType: 'allergy', key: allergy.trim() },
              {
                userId: user._id,
                infoType: 'allergy',
                key: allergy.trim(),
                value: allergy.trim(),
                isConfirmed: true,
                source: 'profile',
                status: 'active',
                lastConfirmedAt: new Date(),
              },
              { upsert: true }
            );
          }
        }
        // Sync conditions
        for (const cond of user.profile.medicalConditions || []) {
          if (cond && cond.trim()) {
            await MemoryItem.findOneAndUpdate(
              { userId: user._id, infoType: 'condition', key: cond.trim() },
              {
                userId: user._id,
                infoType: 'condition',
                key: cond.trim(),
                value: cond.trim(),
                isConfirmed: true,
                source: 'profile',
                status: 'active',
                lastConfirmedAt: new Date(),
              },
              { upsert: true }
            );
          }
        }
      }
    }

    if (settings && typeof settings === 'object') {
      user.settings = {
        saveChatHistory:
          settings.saveChatHistory !== undefined
            ? Boolean(settings.saveChatHistory)
            : user.settings.saveChatHistory,
        rememberHealthInfo:
          settings.rememberHealthInfo !== undefined
            ? Boolean(settings.rememberHealthInfo)
            : user.settings.rememberHealthInfo,
        privacyConsentGiven:
          settings.privacyConsentGiven !== undefined
            ? Boolean(settings.privacyConsentGiven)
            : user.settings.privacyConsentGiven,
        privacyConsentDate: new Date(),
      };
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile,
        settings: user.settings,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।' },
      { status: 500 }
    );
  }
}
