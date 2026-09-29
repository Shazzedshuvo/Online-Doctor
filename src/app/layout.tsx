import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f766e',
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
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
