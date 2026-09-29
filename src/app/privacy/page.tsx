'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  Server,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacySettingsPage() {
  const { language, t, user, isGuest } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = () => {
    window.location.href = '/api/user/export-data';
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t.profile.deleteConfirm)) return;
    try {
      setIsDeleting(true);
      const res = await fetch('/api/user/delete-account', { method: 'DELETE' });
      if (res.ok) {
        alert(language === 'bn' ? 'আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা সফলভাবে মুছে ফেলা হয়েছে।' : 'Your account and data have been permanently erased.');
        window.location.href = '/';
      }
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR & Health Data Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            গোপনীয়তা, নিরাপত্তা ও তথ্য সুরক্ষা নীতি
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            অনলাইন ডক্টর আপনার ব্যক্তিগত স্বাস্থ্য তথ্যের চূড়ান্ত সুরক্ষা ও গোপনীয়তা বজায় রাখতে প্রতিশ্রুতিবদ্ধ।
          </p>
        </div>

        {/* Clear Explanation of What is Stored & What is Sent to Google Gemini */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              আমাদের ডাটাবেসে যা সংরক্ষিত হয়
            </h2>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong>অ্যাকাউন্ট ও প্রোফাইল:</strong> আপনার নাম, ইমেইল এবং ঐচ্ছিক স্বাস্থ্য ব্যাকগ্রাউন্ড (অ্যালার্জি, নিয়মিত ঔষধ)।
              </li>
              <li>
                <strong>চ্যাট আলোচনা:</strong> শুধুমাত্র আপনার স্পষ্ট অনুমতি সাপেক্ষে পরামর্শের কথোপকথন রেকর্ড করা হয়।
              </li>
              <li>
                <strong>স্বাস্থ্য স্মৃতি:</strong> সিস্টেমটি আপনার পূর্ববর্তী সেশন থেকে প্রাপ্ত নিশ্চিত স্বাস্থ্য তথ্য মনে রাখে যাতে বারবার পুনরাবৃত্তি করতে না হয়।
              </li>
              <li>
                <strong>ব্যবহারকারীর সম্পূর্ণ নিয়ন্ত্রণ:</strong> আপনি যেকোনো সময় যেকোনো স্মৃতি বা আলোচনা স্থায়ীভাবে মুছে ফেলতে পারেন।
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              মেডিকেল বিশ্লেষণ সার্ভারে যা প্রেরণ করা হয়
            </h2>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>
                <strong>শুধুমাত্র সংশ্লিষ্ট স্বাস্থ্য প্রেক্ষাপট:</strong> আপনার বর্তমান লক্ষণ এবং আপনার অনুমোদিত পূর্ববর্তী অ্যালার্জি/ঔষধ তালিকা।
              </li>
              <li>
                <strong>সার্ভার-সাইড সরাসরি সংযোগ:</strong> ব্রাউজারে কখনোই Google API Key প্রকাশ পায় না। সকল কল সার্ভারের সিকিউর চ্যানেলে সম্পাদিত হয়।
              </li>
              <li>
                <strong>অন্য ব্যবহারকারীদের সাথে মিশ্রণহীন:</strong> আপনার আলোচনা অন্য কোনো রোগীর অ্যাকাউন্টের সাথে কখনোই মিশ্রিত হয় না।
              </li>
              <li>
                <strong>কঠোরভাবে চিকিৎসকের বিকল্প নয়:</strong> এই প্ল্যাটফর্মটি শুধুমাত্র তথ্যমূলক বিশ্লেষণ প্রদান করে, প্রেসক্রিপশন নয়।
              </li>
            </ul>
          </div>
        </div>

        {/* User Data Ownership & Export / Deletion Controls */}
        {user ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <span>{t.profile.dangerZone}</span>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              আইন অনুযায়ী আপনার অ্যাকাউন্টের সকল স্বাস্থ্য তথ্যের মালিক আপনি। আপনি যেকোনো মুহূর্তে আপনার যাবতীয় ডেটা ডাউনলোড করতে পারেন অথবা সম্পূর্ণ ডেটা স্থায়ীভাবে ধ্বংস করতে পারেন।
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Export Data Button */}
              <button
                onClick={handleExportData}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-teal-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>{t.profile.exportData}</span>
              </button>

              {/* Permanent Account Deletion */}
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>{isDeleting ? 'মুছে ফেলা হচ্ছে...' : t.profile.deleteAccount}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900">
            <p className="font-semibold">
              গেস্ট মোডে চ্যাট করার সময় ব্রাউজার বন্ধ করলে কোনো স্থায়ী হিস্ট্রি থাকে না। স্থায়ী অ্যাকাউন্ট ও ব্যাকআপের জন্য লগইন করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
