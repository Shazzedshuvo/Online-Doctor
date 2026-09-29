'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User,
  Shield,
  Save,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Calendar,
  Heart,
  Pill,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { language, t, user, refreshUser, isGuest } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [preferredLang, setPreferredLang] = useState<'bn' | 'en'>('bn');
  const [conditionsText, setConditionsText] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicinesText, setMedicinesText] = useState('');
  const [pregnancyStatus, setPregnancyStatus] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAge(user.profile?.age || '');
      setDob(user.profile?.dob || '');
      setGender(user.profile?.gender || '');
      setPreferredLang(user.profile?.preferredLanguage || 'bn');
      setConditionsText(user.profile?.medicalConditions?.join(', ') || '');
      setAllergiesText(user.profile?.medicineAllergies?.join(', ') || '');
      setMedicinesText(user.profile?.currentMedicines?.join(', ') || '');
      setPregnancyStatus(user.profile?.pregnancyStatus || '');
      setEmergencyName(user.profile?.emergencyContact?.name || '');
      setEmergencyPhone(user.profile?.emergencyContact?.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setSuccessMsg(false);

      const conditions = conditionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const allergies = allergiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const medicines = medicinesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          profile: {
            age: age ? Number(age) : undefined,
            dob,
            gender,
            preferredLanguage: preferredLang,
            medicalConditions: conditions,
            medicineAllergies: allergies,
            currentMedicines: medicines,
            pregnancyStatus,
            emergencyContact: {
              name: emergencyName,
              phone: emergencyPhone,
            },
          },
        }),
      });

      if (res.ok) {
        setSuccessMsg(true);
        refreshUser();
        setTimeout(() => setSuccessMsg(false), 4000);
      }
    } catch (e) {
      console.error('Update profile error:', e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isGuest) {
    return (
      <div className="flex-1 max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h1 className="text-xl font-bold text-slate-800">{t.profile.title}</h1>
        <p className="text-xs text-slate-600">
          প্রোফাইল দেখতে বা তৈরি করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition"
        >
          {t.nav.login}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <User className="w-3.5 h-3.5" />
            <span>Authenticated Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.profile.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.profile.subtitle}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.profile.successMessage}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.fullName} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.email} (Non-editable)
              </label>
              <input
                type="text"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.age}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="যেমন: ৩২"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.gender}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="">বাছাই করুন (Select)</option>
                <option value="পুরুষ (Male)">{t.profile.genderOptions.male}</option>
                <option value="মহিলা (Female)">{t.profile.genderOptions.female}</option>
                <option value="অন্যান্য (Other)">{t.profile.genderOptions.other}</option>
                <option value="বলতে অনিচ্ছুক">{t.profile.genderOptions.preferNot}</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h2 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-teal-600" />
              <span>ঐচ্ছিক স্বাস্থ্য বিবরণ (Health Context)</span>
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.allergies}
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="যেমন: পেনিসিলিন, সালফা ড্রাগ, চিংড়ি মাছ"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">একাধিক থাকলে কমা (,) দিয়ে আলাদা করুন</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.conditions}
              </label>
              <input
                type="text"
                value={conditionsText}
                onChange={(e) => setConditionsText(e.target.value)}
                placeholder="যেমন: টাইপ-২ ডায়াবেটিস, উচ্চ রক্তচাপ, হাঁপানি"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.currentMeds}
              </label>
              <input
                type="text"
                value={medicinesText}
                onChange={(e) => setMedicinesText(e.target.value)}
                placeholder="যেমন: Seclo 20mg, Metformin 500mg"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {t.profile.pregnancyStatus}
              </label>
              <input
                type="text"
                value={pregnancyStatus}
                onChange={(e) => setPregnancyStatus(e.target.value)}
                placeholder="যেমন: গর্ভবতী (দ্বিতীয় ট্রাইমেস্টার) অথবা স্তন্যদানকারী"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              জরুরি যোগাযোগের ব্যক্তি (Emergency Contact)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.profile.emergencyContactName}
                </label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="যেমন: ভাই / স্বামী / অভিভাবক"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t.profile.emergencyContactPhone}
                </label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="যেমন: 01700000000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : t.profile.saveProfile}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
