import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Online Doctor — বাংলাদেশ ডিজিটাল স্বাস্থ্য সেবা',
  description:
    'বাংলাদেশের জন্য সার্বক্ষণিক নিরাপদ ডিজিটাল স্বাস্থ্য পরামর্শক। লক্ষণ বিশ্লেষণ, বাংলাদেশ ঔষধ নির্দেশিকা, রোগীর স্বাস্থ্য তথ্য ও কনসালটেশন রিপোর্ট।',
  keywords: [
    'Online Doctor',
    'অনলাইন ডাক্তার',
    'Bangladesh Healthcare',
    'স্বাস্থ্য সেবা',
    'Medicine Directory Bangladesh',
    'DGDA BDNF',
  ],
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white"
        suppressHydrationWarning
      >
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

          {/* Persistent Bangladesh Healthcare Footer */}
          <footer className="bg-white border-t border-slate-200/80 py-6 px-4 no-print text-center text-xs text-slate-700">
            <div className="max-w-6xl mx-auto space-y-3">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping"></span>
                  জরুরি সেবা: ৯৯৯ (National Emergency 999)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-teal-700">স্বাস্থ্য বাতায়ন: ১৬২৬৩ (Shastho Batayon 16263)</span>
                <span className="text-slate-300">|</span>
                <span className="text-blue-700">জাতীয় হেল্পলাইন: ৩৩৩ (National Helpline 333)</span>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 max-w-3xl mx-auto text-amber-900 leading-relaxed text-[11px] sm:text-xs">
                <strong>⚠️ আইনি ও চিকিৎসা বিজ্ঞপ্তি:</strong> আরও ভালো ও ব্যক্তিগত চিকিৎসা পরামর্শের জন্য নিবন্ধিত চিকিৎসকের সঙ্গে সরাসরি যোগাযোগ করুন। কোনো প্রেসক্রিপশন ছাড়া অ্যান্টিবায়োটিক বা বিপজ্জনক ওষুধ সেবন করবেন না।
              </div>

              <p className="text-[11px] text-slate-600" suppressHydrationWarning>
                © {new Date().getFullYear()} Online Doctor (Bangladesh). All Rights Reserved.
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
