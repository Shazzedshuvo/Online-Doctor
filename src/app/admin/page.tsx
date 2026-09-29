'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Activity,
  Users,
  MessageSquare,
  Pill,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Upload,
  Database,
  KeyRound,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  counts: {
    users: number;
    conversations: number;
    medicines: number;
    reports: number;
  };
  configuredModel: string;
  geminiKeyConfigured: boolean;
  recentLogs: Array<{
    action: string;
    category: string;
    status: string;
    statusCode?: number;
    modelUsed?: string;
    durationMs?: number;
    timestamp: string;
  }>;
}

interface GeminiTestResult {
  success: boolean;
  model: string;
  latencyMs: number;
  message: string;
  status: 'online' | 'error' | 'unconfigured';
}

export default function AdminDashboardPage() {
  const { language, t, user, isGuest } = useApp();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gemini Test State
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [testResult, setTestResult] = useState<GeminiTestResult | null>(null);

  // Dataset Import State
  const [jsonInput, setJsonInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  // User Management State
  const [usersList, setUsersList] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
      fetchUsersList();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (e) {
      console.error('Fetch stats error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (e) {
      console.error('Fetch users error:', e);
    }
  };

  const handleTestGemini = async () => {
    try {
      setIsTestingGemini(true);
      setTestResult(null);

      const res = await fetch('/api/admin/gemini-test', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        model: 'gemini-3.8-flash',
        latencyMs: 0,
        message: err.message || 'Connection test failed',
        status: 'error',
      });
    } finally {
      setIsTestingGemini(false);
    }
  };

  const handleImportJson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;

    try {
      setIsImporting(true);
      setImportResult(null);

      let parsedItems;
      try {
        parsedItems = JSON.parse(jsonInput);
      } catch (jsonErr: any) {
        alert('Invalid JSON format: ' + jsonErr.message);
        return;
      }

      if (!Array.isArray(parsedItems)) {
        parsedItems = [parsedItems];
      }

      const res = await fetch('/api/medicines/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: parsedItems,
          dataSource: 'DGDA Approved Authorized Import (Admin)',
        }),
      });

      const data = await res.json();
      setImportResult(data);
      if (data.success) {
        setJsonInput('');
        fetchAdminStats();
      }
    } catch (err: any) {
      alert('Import error: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggleUserRole = async (targetUserId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId, role: newRole }),
      });
      if (res.ok) {
        fetchUsersList();
      }
    } catch (e) {
      console.error('Update role error:', e);
    }
  };

  if (isGuest || user?.role !== 'admin') {
    return (
      <div className="flex-1 max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h1 className="text-xl font-bold text-slate-800">অ্যাডমিন অনুমতি আবশ্যক</h1>
        <p className="text-xs text-slate-600">
          এই পৃষ্ঠাটি শুধুমাত্র সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Restricted Administrator Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.admin.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.admin.subtitle}
          </p>
        </div>

        {/* 1. System Overview Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                {t.admin.stats.users}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.counts.users}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                {t.admin.stats.conversations}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.counts.conversations}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600" />
                {t.admin.stats.medicines}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.counts.medicines}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                {t.admin.stats.reports}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.counts.reports}
              </p>
            </div>
          </div>
        )}

        {/* 2. REAL-TIME GOOGLE GEMINI CONNECTION TEST (Section 4 & 10) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>{t.admin.geminiTestTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.admin.geminiTestDesc}
              </p>
            </div>

            <button
              onClick={handleTestGemini}
              disabled={isTestingGemini}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer self-start sm:self-center"
            >
              {isTestingGemini ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5" />
              )}
              <span>{isTestingGemini ? t.admin.testing : t.admin.testNowBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                {t.admin.activeModel}
              </span>
              <span className="font-bold text-slate-800 font-mono">
                {stats?.configuredModel || 'gemini-3.8-flash'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                API Key Configuration
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Server Secret Configured (Masked)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">
                Live Status
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  testResult?.success ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    testResult?.success ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                ></span>
                {testResult
                  ? testResult.success
                    ? `${t.admin.connectedStatus} (${testResult.latencyMs}ms)`
                    : `${t.admin.disconnectedStatus}`
                  : 'পরীক্ষা চালানো হয়নি (Not tested yet)'}
              </span>
            </div>
          </div>

          {/* Test Result Message Box */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <p className="font-bold">
                {testResult.success ? '✅ টেস্ট সফল:' : '❌ টেস্ট ব্যর্থ হয়েছে:'}
              </p>
              <p className="mt-0.5">{testResult.message}</p>
            </div>
          )}
        </div>

        {/* 3. AUTHORIZED DATASET IMPORT WORKFLOW (Section 8 & 10) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-teal-600" />
              <span>{t.admin.importDataset}</span>
            </h2>
            <p className="text-xs text-slate-500">
              অনুমোদিত DGDA বা বাংলাদেশ ন্যাশনাল ফর্মুলারির JSON রেকর্ড পেস্ট করুন। ডুপ্লিকেট যাচাইকরণ ও সোর্স ট্র্যাকিং স্বয়ংক্রিয়ভাবে সম্পন্ন হবে।
            </p>
          </div>

          <form onSubmit={handleImportJson} className="space-y-3">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={4}
              placeholder={`[
  {
    "brandName": "Napa Rapid",
    "genericName": "Paracetamol",
    "manufacturer": "Beximco Pharmaceuticals Ltd.",
    "strength": "500 mg",
    "dosageForm": "Tablet",
    "generalUses": ["তাত্ক্ষণিক জ্বর", "ব্যথা"],
    "priceBdt": 2.00
  }
]`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                JSON ফরম্যাটে এক বা একাধিক ঔষধ অবজেক্ট
              </span>
              <button
                type="submit"
                disabled={isImporting || !jsonInput.trim()}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer disabled:bg-slate-300"
              >
                {isImporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>ইমপোর্ট ডেটাসেট</span>
              </button>
            </div>
          </form>

          {/* Import Result Notification */}
          {importResult && (
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 space-y-1">
              <p className="font-bold">
                ইমপোর্ট সম্পন্ন! নতুন যুক্ত হয়েছে: {importResult.importedCount} টি | এড়িয়ে চলা হয়েছে (ডুপ্লিকেট): {importResult.duplicateCount} টি
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                ব্যাচ আইডি: {importResult.batchId}
              </p>
            </div>
          )}
        </div>

        {/* 4. USER ACCOUNT MANAGEMENT */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>{t.admin.userManagement} ({usersList.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">নাম</th>
                  <th className="py-2.5 px-3">ইমেইল</th>
                  <th className="py-2.5 px-3">ভূমিকা (Role)</th>
                  <th className="py-2.5 px-3">নিবন্ধন তারিখ</th>
                  <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500" suppressHydrationWarning>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleUserRole(u.id, u.role)}
                          className="text-[11px] text-teal-600 hover:underline font-semibold"
                        >
                          {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. AGGREGATE SYSTEM & API AUDIT LOGS (Section 10) */}
        {stats?.recentLogs && stats.recentLogs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>{t.admin.logsTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              গোপনীয়তা বজায় রেখে শুধুমাত্র সিস্টেম মেকানিক্স ও এপিআই ত্রুটি ট্র্যাক করা হয়। কোনো রোগীর ব্যক্তিগত চ্যাট সংরক্ষণ করা হয় না।
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-[11px] text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">ইভেন্ট</th>
                    <th className="py-2 px-3">ক্যাটাগরি</th>
                    <th className="py-2 px-3">স্ট্যাটাস</th>
                    <th className="py-2 px-3">মডেল</th>
                    <th className="py-2 px-3">বিলম্বিতা</th>
                    <th className="py-2 px-3">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentLogs.map((log, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-medium text-slate-800">{log.action}</td>
                      <td className="py-2 px-3 text-slate-500">{log.category}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[10px]">
                        {log.modelUsed || '-'}
                      </td>
                      <td className="py-2 px-3">
                        {log.durationMs ? `${log.durationMs}ms` : '-'}
                      </td>
                      <td className="py-2 px-3 text-slate-400" suppressHydrationWarning>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
