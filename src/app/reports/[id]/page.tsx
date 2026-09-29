'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Printer,
  FileDown,
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  User,
  Shield,
  Stethoscope,
  Info,
} from 'lucide-react';
import Link from 'next/link';

interface ReportDetail {
  _id: string;
  reportId: string;
  patientName: string;
  patientAge?: string | number;
  patientGender?: string;
  dateDhaka: string;
  symptoms: string[];
  durationAndSeverity?: string;
  confirmedHealthInfo: {
    allergies: string[];
    conditions: string[];
    currentMedicines: string[];
    pregnancyStatus?: string;
  };
  discussionSummary: string;
  generalGuidance: string;
  recommendedNextSteps: string;
  dataSources: string;
  clinicianVerification?: {
    isPrescriptionApproved: boolean;
    approvedByDoctorName?: string;
    bmdcRegistrationNumber?: string;
    hospitalAffiliation?: string;
    clinicianNotes?: string;
    prescribedMedicines?: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    approvedAt?: string;
  };
}

export default function ReportDetailPage() {
  const { id } = useParams() as { id: string };
  const { language, t, user } = useApp();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clinician verification form (Admin / Clinician only)
  const [isClinicianModalOpen, setIsClinicianModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [bmdcReg, setBmdcReg] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [clinicianNotes, setClinicianNotes] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/reports/${id}`);
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (e) {
      console.error('Fetch report error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApproveClinicianPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !bmdcReg) return;

    try {
      const res = await fetch(`/api/reports/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedByDoctorName: docName,
          bmdcRegistrationNumber: bmdcReg,
          hospitalAffiliation: affiliation,
          clinicianNotes,
          prescribedMedicines: [],
        }),
      });

      if (res.ok) {
        setIsClinicianModalOpen(false);
        fetchReport();
      }
    } catch (e) {
      console.error('Prescription approve error:', e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 text-center py-20 px-4">
        <p className="text-sm font-bold text-slate-700">রিপোর্ট খুঁজে পাওয়া যায়নি।</p>
        <Link href="/reports" className="text-xs text-teal-600 underline mt-2 inline-block">
          সব রিপোর্টে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-100 py-6 sm:py-10 px-4">
      {/* Top Floating Action Bar (Hidden during Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.reports.backToChat}</span>
        </Link>

        <div className="flex items-center gap-2">
          {user?.role === 'admin' && !report.clinicianVerification?.isPrescriptionApproved && (
            <button
              onClick={() => setIsClinicianModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <Stethoscope className="w-4 h-4" />
              <span>চিকিৎসক অনুমোদন যুক্ত করুন</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition"
          >
            <Printer className="w-4 h-4" />
            <span>{t.reports.printBtn}</span>
          </button>
        </div>
      </div>

      {/* A4 PRINTABLE DOCUMENT CONTAINER */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-200 printable-document font-sans text-slate-900 space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-teal-700 pb-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
                <img src="/icon.svg" alt="Online Doctor" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Online<span className="text-teal-600">Doctor</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              ডিজিটাল স্বাস্থ্য পরামর্শ সারসংক্ষেপ (Digital Health Consultation Summary)
            </p>
            <p className="text-[11px] text-slate-400">
              গণপ্রজাতন্ত্রী বাংলাদেশ স্বাস্থ্য নির্দেশিকা ও ডিজিডিএ সম্বলিত
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-900 text-xs font-mono font-bold">
              {report.reportId}
            </span>
            <p className="text-[11px] text-slate-500">
              <strong>তারিখ ও সময়:</strong> {report.dateDhaka}
            </p>
          </div>
        </div>

        {/* Mandatory Prominent Legal Header Notice */}
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-center font-bold text-xs sm:text-sm">
          “{t.reportNotice}”
        </div>

        {/* Patient Demographics Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {t.reports.patientName}
            </span>
            <span className="font-bold text-slate-900 text-sm">{report.patientName}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              {t.reports.patientAge}
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {report.patientAge ? `${report.patientAge} বছর` : t.reports.notSpecified}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">লিঙ্গ</span>
            <span className="font-bold text-slate-900 text-sm">
              {report.patientGender || 'উল্লেখ নেই'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">টাইমজোন</span>
            <span className="font-bold text-slate-900 text-sm">Asia/Dhaka (BST)</span>
          </div>
        </div>

        {/* 1. Patient Reported Symptoms */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-teal-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            {t.reports.symptomsSection}
          </h2>
          <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {report.symptoms.map((sym, idx) => (
              <li key={idx} className="leading-relaxed">
                {sym}
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Confirmed Health Info / Allergies */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-teal-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            {t.reports.memorySection}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] text-teal-900">
                অ্যালার্জি (Allergies):
              </span>
              <p className="text-slate-700">
                {report.confirmedHealthInfo.allergies.length > 0
                  ? report.confirmedHealthInfo.allergies.join(', ')
                  : 'কোনো অ্যালার্জির রেকর্ড নেই'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] text-teal-900">
                দীর্ঘমেয়াদী রোগ (Conditions):
              </span>
              <p className="text-slate-700">
                {report.confirmedHealthInfo.conditions.length > 0
                  ? report.confirmedHealthInfo.conditions.join(', ')
                  : 'কোনো দীর্ঘমেয়াদী রোগের রেকর্ড নেই'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px] text-teal-900">
                বর্তমান ঔষধ (Current Meds):
              </span>
              <p className="text-slate-700">
                {report.confirmedHealthInfo.currentMedicines.length > 0
                  ? report.confirmedHealthInfo.currentMedicines.join(', ')
                  : 'কোনো নিয়মিত ওষুধের রেকর্ড নেই'}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Discussion Summary */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-teal-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            {t.reports.summarySection}
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {report.discussionSummary}
          </p>
        </div>

        {/* 4. Non-Drug Self-Care & General Advice */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-teal-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            {t.reports.guidanceSection}
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            {report.generalGuidance}
          </div>
        </div>

        {/* 5. Recommended Next Steps */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold text-teal-950 uppercase tracking-wide border-b border-slate-200 pb-1">
            {t.reports.nextStepsSection}
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-teal-50/40 p-3 rounded-xl border border-teal-200/60 font-medium">
            {report.recommendedNextSteps}
          </div>
        </div>

        {/* Clinician Review / Prescription Section */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t.reports.clinicianSection}
          </h2>

          {report.clinicianVerification?.isPrescriptionApproved ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-950 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>ডা. {report.clinicianVerification.approvedByDoctorName}</span>
                <span>BMDC Reg: {report.clinicianVerification.bmdcRegistrationNumber}</span>
              </div>
              {report.clinicianVerification.hospitalAffiliation && (
                <p>{report.clinicianVerification.hospitalAffiliation}</p>
              )}
              {report.clinicianVerification.clinicianNotes && (
                <p className="mt-1 pt-1 border-t border-emerald-200 text-slate-700">
                  <strong>ডাক্তারের মন্তব্য:</strong> {report.clinicianVerification.clinicianNotes}
                </p>
              )}
              <p className="text-[10px] text-emerald-700 pt-1" suppressHydrationWarning>
                অনুমোদন সম্পন্ন হয়েছে: {new Date(report.clinicianVerification.approvedAt || '').toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              {t.reports.noPrescriptionYet} (শুধুমাত্র নিবন্ধিত চিকিৎসক সরাসরি যাচাইয়ের পর প্রেসক্রিপশন প্রদান করতে পারবেন।)
            </p>
          )}
        </div>

        {/* Document Footer Disclaimer */}
        <div className="pt-6 border-t border-slate-200 text-center space-y-2 text-[10px] sm:text-[11px] text-slate-500">
          <p className="font-semibold text-slate-700">
            {t.disclaimerText}
          </p>
          <p>
            ডেটা উৎস: {report.dataSources} • জেনারেট করা হয়েছে: Online Doctor (BD Healthcare Systems)
          </p>
        </div>
      </div>

      {/* Clinician Review Modal */}
      {isClinicianModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print">
          <form
            onSubmit={handleApproveClinicianPrescription}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
          >
            <h3 className="text-sm font-bold text-slate-900">
              রেজিস্টার্ড চিকিৎসকের অনুমোদন ও মন্তব্য যুক্ত করুন
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                চিকিৎসকের নাম (Dr. Full Name)
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="যেমন: ডা. মো. আসিফ ইকবাল"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                BMDC রেজিস্ট্রেশন নম্বর (Real Registration Number)
              </label>
              <input
                type="text"
                value={bmdcReg}
                onChange={(e) => setBmdcReg(e.target.value)}
                placeholder="যেমন: A-78901"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                হাসপাতাল / প্রতিষ্ঠান
              </label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="যেমন: ঢাকা মেডিকেল কলেজ ও হাসপাতাল"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                পরামর্শ বা ক্লিনিকাল নোট
              </label>
              <textarea
                value={clinicianNotes}
                onChange={(e) => setClinicianNotes(e.target.value)}
                rows={2}
                placeholder="চিকিৎসকের মন্তব্য..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClinicianModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                অনুমোদন সম্পন্ন করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
