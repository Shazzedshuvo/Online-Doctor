'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  MessageSquare,
  Pill,
  Brain,
  FileText,
  User as UserIcon,
  Shield,
  PhoneCall,
  Menu,
  X,
  Globe,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t, user, logout, isGuest } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.chat, icon: MessageSquare },
    { href: '/medicines', label: t.nav.medicines, icon: Pill },
    { href: '/memory', label: t.nav.memory, icon: Brain },
    { href: '/reports', label: t.nav.reports, icon: FileText },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: t.nav.admin, icon: Shield });
  }

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      {/* Top Emergency Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs py-1 sm:py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-medium tracking-wide truncate">
              {t.emergencyNotice}
            </span>
          </div>
          <a
            href="tel:999"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition shrink-0"
          >
            <PhoneCall className="w-3 h-3" />
            <span className="hidden xs:inline">৯৯৯</span>
            <span className="hidden sm:inline">(999)</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition duration-200 shadow-md shadow-teal-700/20">
              <img src="/icon.svg" alt="Online Doctor" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                  Online<span className="text-teal-600">Doctor</span>
                </span>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-200">
                  BD
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block -mt-0.5">
                {language === 'bn' ? 'বাংলাদেশ ডিজিটাল স্বাস্থ্য সেবা' : 'Bangladesh Digital Health Service'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-teal-300 text-xs font-semibold text-slate-700 bg-white hover:bg-teal-50/50 transition cursor-pointer shadow-xs"
              title="বাংলা / English"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition cursor-pointer shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {user.role === 'admin' ? 'Administrator' : 'Patient'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-sm"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <UserIcon className="w-4 h-4 text-teal-600" />
                      <span>{t.nav.profile}</span>
                    </Link>

                    <Link
                      href="/memory"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <Brain className="w-4 h-4 text-teal-600" />
                      <span>{t.nav.memory}</span>
                    </Link>

                    <Link
                      href="/privacy"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                    >
                      <Shield className="w-4 h-4 text-teal-600" />
                      <span>{language === 'bn' ? 'গোপনীয়তা সেটিংস' : 'Privacy Settings'}</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-amber-700 font-medium"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>{t.nav.admin}</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.nav.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="hidden xl:inline-flex text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  {t.nav.guestMode}
                </span>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-teal-600" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-slate-100 pt-2 mt-2">
            <Link
              href="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-600"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>{language === 'bn' ? 'গোপনীয়তা ও ডেটা সুরক্ষা' : 'Privacy & Consent'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
