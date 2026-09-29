'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PhoneCall, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // On the chat page ('/'), we omit the footer so the consultation window
  // gets 100% of the mobile screen height without double scrollbars.
  // Safety notices and emergency numbers are already integrated in the chat interface.
  if (pathname === '/') {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200/90 py-6 sm:py-8 px-3 sm:px-6 no-print text-center text-xs text-slate-700">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Emergency Hotline Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-800">
          <a
            href="tel:999"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping"></span>
            <PhoneCall className="w-3.5 h-3.5" />
            <span>জরুরি সেবা: ৯৯৯</span>
          </a>

          <a
            href="tel:16263"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
            <span>স্বাস্থ্য বাতায়ন: ১৬২৬৩</span>
          </a>

          <a
            href="tel:333"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>জাতীয় হেল্পলাইন: ৩৩৩</span>
          </a>
        </div>

        {/* Legal & Medical Disclaimer Box */}
        <div className="p-3 sm:p-3.5 bg-amber-50/90 rounded-xl border border-amber-200/70 max-w-3xl mx-auto text-amber-900 leading-relaxed text-[11px] sm:text-xs text-left sm:text-center">
          <div className="flex items-start sm:items-center justify-center gap-1.5 mb-1 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <span>আইনি ও চিকিৎসা নিরাপত্তা বিজ্ঞপ্তি:</span>
          </div>
          <p>
            আরও নির্ভরযোগ্য ও ব্যক্তিগত চিকিৎসা পরামর্শের জন্য নিবন্ধিত চিকিৎসকের সঙ্গে সরাসরি যোগাযোগ করুন।
            চিকিৎসকের প্রেসক্রিপশন ছাড়া অ্যান্টিবায়োটিক বা ঝুঁকিপূর্ণ ওষুধ সেবন করবেন না।
          </p>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-slate-500" suppressHydrationWarning>
          © {new Date().getFullYear()} Online Doctor (Bangladesh). All Rights Reserved. DGDA / BDNF Pharmacopeia Standards.
        </p>
      </div>
    </footer>
  );
}
