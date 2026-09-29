'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Activity, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const { language, t, refreshUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      await refreshUser();
      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 py-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-700/20">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create an Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'নিরাপদ ডিজিটাল স্বাস্থ্য পরামর্শ ও স্মৃতি সংরক্ষণের জন্য'
              : 'For personalized health consultation & persistent memory'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.profile.fullName}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রাশেদুল ইসলাম"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {t.profile.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Privacy Consent Agreement Notice */}
          <div className="p-3 bg-teal-50/70 border border-teal-200/70 rounded-xl text-[11px] text-teal-900 leading-snug">
            অ্যাকাউন্ট তৈরি করার মাধ্যমে আপনি আমাদের স্বাস্থ্য তথ্য নীতি এবং অনলাইন ডক্টর ব্যবহারের শর্তাবলীতে সম্মতি প্রদান করছেন।
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'তৈরি করা হচ্ছে...' : t.nav.register}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 space-y-2">
          <p>
            ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
            <Link href="/login" className="font-bold text-teal-700 hover:underline">
              {t.nav.login}
            </Link>
          </p>

          <Link href="/" className="block text-[11px] text-slate-400 hover:underline">
            গেস্ট হিসেবে পরামর্শ শুরু করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
