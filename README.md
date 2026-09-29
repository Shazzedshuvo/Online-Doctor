# Online Doctor

বাংলাদেশ ডিজিটাল স্বাস্থ্য সেবা — একটি নিরাপদ, আধুনিক এবং ব্যবহারকারী-বান্ধব স্বাস্থ্য পরামর্শক প্ল্যাটফর্ম।

## 🏥 বৈশিষ্ট্যসমূহ (Features)
- **ডিজিটাল স্বাস্থ্য পরামর্শ (Consultation):** লক্ষণ বিশ্লেষণ ও প্রাথমিক যত্ন সংক্রান্ত স্বাস্থ্য পরামর্শ।
- **বাংলাদেশের ঔষধ নির্দেশিকা (Medicine Directory):** ডিজিডিএ (DGDA) অনুমোদিত ২৪+ বহুল ব্যবহৃত ওষুধের আসল ছবি, ব্লিস্টার প্যাক, ট্যাবলেট চেনার রূপ ও আনুমানিক মূল্য তালিকা।
- **স্বাস্থ্য স্মৃতি ব্যবস্থাপনা (Health Memory):** রোগীর অ্যালার্জি, পূর্ববর্তী রোগ ও নিয়মিত সেবনকৃত ওষুধের তথ্য সংরক্ষণ।
- **পরামর্শের সারসংক্ষেপ রিপোর্ট (Consultation Report):** ডাক্তারের সাথে সাক্ষাতের সুবিধার জন্য প্রিন্টযোগ্য ও সেভযোগ্য মেডিকেল সারসংক্ষেপ।
- **গোপনীয়তা ও ডেটা সুরক্ষা (Privacy First):** ব্যবহারকারীর ডেটার ওপর পূর্ণ নিয়ন্ত্রণ ও মুছে ফেলার সুবিধা।

## 🛠️ ব্যবহৃত প্রযুক্তি (Tech Stack)
- **Frontend / Framework:** Next.js (App Router), React, Tailwind CSS
- **Backend / Database:** MongoDB with Mongoose
- **Icons & Assets:** Lucide React, Custom Medical SVG Logos & Medicine Pack Visuals

## 🚀 লোকাল সেটআপ (Getting Started)

১. ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm install
```

২. `.env.local` ফাইল তৈরি করুন:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_jwt_secret
APP_URL=http://localhost:3000
```

৩. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```

৪. ব্রাউজারে ওপেন করুন: [http://localhost:3000](http://localhost:3000)
