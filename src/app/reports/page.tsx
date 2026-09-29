'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Printer,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Download,
  CheckCircle,
  Plus,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface ReportItem {
  _id: string;
  reportId: string;
  patientName: string;
  patientAge?: string | number;
  dateDhaka: string;
  symptoms: string[];
  confirmedHealthInfo: {
    allergies: string[];
    conditions: string[];
    currentMedicines: string[];
    pregnancyStatus?: string;
  };
  discussionSummary: string;
  generalGuidance: string;
  recommendedNextSteps: string;
  clinicianVerification?: {
    isPrescriptionApproved: boolean;
    approvedByDoctorName?: string;
    bmdcRegistrationNumber?: string;
  };
  createdAt: string;
}

export default function ReportsListPage() {
  const { language, t, user, isGuest } = useApp();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConvId, setSelectedConvId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customAge, setCustomAge] = useState('');

  useEffect(() => {
    fetchReports();
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error('Fetch reports error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.conversations && data.conversations.length > 0) {
        setConversations(data.conversations);
        setSelectedConvId(data.conversations[0].id);
      }
    } catch (e) {
      console.error('Fetch conv error:', e);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConvId || undefined,
          customPatientName: customName || user?.name || undefined,
          customAge: customAge || user?.profile?.age || undefined,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        fetchReports();
        window.location.href = `/reports/${data.report.reportId}`;
      }
    } catch (e) {
      console.error('Report gen error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 py-5 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>A4 Printable Consultation Summaries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.reports.title}
            </h1>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              {t.reports.subtitle}
            </p>
          </div>

          <a
            href="#generate-section"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রিপোর্ট তৈরি করুন</span>
          </a>
        </div>

        {/* Generate New Report Section */}
        <div id="generate-section" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-600" />
            <span>আলোচনা থেকে সারাংশ রিপোর্ট তৈরি করুন</span>
          </h2>

          <form onSubmit={handleGenerateReport} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                পরামর্শ সেশন বেছে নিন
              </label>
              <select
                value={selectedConvId}
                onChange={(e) => setSelectedConvId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {conversations.length > 0 ? (
                  conversations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                ) : (
                  <option value="">সাম্প্রতিক আলোচনা (General)</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                রোগীর নাম (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={user?.name || 'বেনামী রোগী'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  বয়স (বছর)
                </label>
                <input
                  type="text"
                  value={customAge}
                  onChange={(e) => setCustomAge(e.target.value)}
                  placeholder={user?.profile?.age ? String(user.profile.age) : 'যেমন: ৩৫'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>তৈরি করুন</span>
              </button>
            </div>
          </form>
        </div>

        {/* Reports Grid */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            পূর্ববর্তী স্বাস্থ্য রিপোর্টসমূহ ({reports.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-600" />
            </div>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-400 hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                          {report.reportId}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {report.patientName}
                        </h3>
                      </div>

                      {report.clinicianVerification?.isPrescriptionApproved ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          ডাক্তার অনুমোদিত
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                          পরামর্শ সারসংক্ষেপ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{report.dateDhaka}</span>
                    </p>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-800">লক্ষণসমূহ:</p>
                      <div className="flex flex-wrap gap-1">
                        {report.symptoms.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] truncate max-w-[200px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-amber-800 font-medium">
                      {t.reportNotice}
                    </span>
                    <Link
                      href={`/reports/${report.reportId}`}
                      className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold text-xs"
                    >
                      <span>রিপোর্ট দেখুন ও প্রিন্ট করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                কোনো রিপোর্ট এখনো সংরক্ষিত হয়নি। চ্যাট আলোচনা থেকে সরাসরি রিপোর্ট তৈরি করুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
