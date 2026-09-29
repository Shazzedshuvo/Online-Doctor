'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { language, t, refreshUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      await refreshUser();
      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message || 'লগইন ব্যর্থ হয়েছে।');
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
            {language === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'আপনার পূর্ববর্তী স্বাস্থ্য আলোচনা ও স্মৃতি অ্যাক্সেস করুন'
              : 'Access your consultation history & health memory'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
              পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'যাচাই করা হচ্ছে...' : t.nav.login}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500 space-y-2">
          <p>
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/register" className="font-bold text-teal-700 hover:underline">
              {t.nav.register}
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
