'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Pill,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
  ArrowRight,
  X,
  Sparkles,
  Eye,
  BadgeAlert,
  ShieldCheck,
} from 'lucide-react';

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  dosageForm: string;
  generalUses: string[];
  warnings: string;
  sideEffects: string;
  interactions: string;
  pregnancyCategory?: string;
  priceBdt?: number;
  imageUrl?: string;
  tabletAppearance?: string;
  packagingColor?: string;
  dataSource: string;
  lastVerificationDate: string;
  isVerified: boolean;
}

export default function MedicineDirectoryPage() {
  const { language, t } = useApp();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [filterOptions, setFilterOptions] = useState<{
    dosageForms: string[];
    manufacturers: string[];
  }>({ dosageForms: [], manufacturers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    fetchMedicines();
  }, [searchQuery, selectedForm, selectedManufacturer]);

  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedForm !== 'all') params.append('form', selectedForm);
      if (selectedManufacturer !== 'all') params.append('manufacturer', selectedManufacturer);

      const res = await fetch(`/api/medicines?${params.toString()}`);
      const data = await res.json();
      if (data.medicines) {
        setMedicines(data.medicines);
        if (data.filterOptions) {
          setFilterOptions(data.filterOptions);
        }
      }
    } catch (err) {
      console.error('Fetch medicines error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 py-5 sm:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <Pill className="w-3.5 h-3.5" />
              <span>DGDA / BDNF Pharmacopeia (বাংলাদেশ ঔষধ নির্দেশিকা)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'bn' ? 'ওষুধ ডিরেক্টরি ও দৃশ্যমান রূপ' : t.medicines.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের বহুল ব্যবহৃত ওষুধ, প্যাকেজিংয়ের আসল ছবি ও ট্যাবলেট চেনার সহজ নির্দেশিকা।'
                : t.medicines.subtitle}
            </p>
          </div>

          {/* Identification Visual Banner */}
          <div className="mt-5 p-3.5 bg-teal-50/80 border border-teal-200/80 rounded-xl text-xs text-teal-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>ট্যাবলেট চেনার নির্দেশিকা:</strong> প্রতিটি ওষুধের স্ট্রিপের ছবি, ট্যাবলেটের আসল রঙ ও আকৃতি এবং প্যাকেজিং দেখে সহজে সঠিক ওষুধটি চিনতে পারবেন।
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'ওষুধের নাম (যেমন: Napa, Seclo, Ace, Alatrol) বা লক্ষণ লিখে খুঁজুন...'
                    : t.medicines.searchPlaceholder
                }
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <select
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full sm:w-40 px-2.5 sm:px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 cursor-pointer truncate"
              >
                <option value="all">{t.medicines.allForms}</option>
                {filterOptions.dosageForms.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="w-full sm:w-44 px-2.5 sm:px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 cursor-pointer truncate"
              >
                <option value="all">{t.medicines.allManufacturers}</option>
                {filterOptions.manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medicines Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {language === 'bn' ? 'ঔষধের তালিকা ও ছবি লোড হচ্ছে...' : 'Loading medicines...'}
            </p>
          </div>
        ) : medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                onClick={() => setSelectedMedicine(med)}
                className="group bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-teal-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3.5"
              >
                {/* Medicine Original Packaging Image */}
                <div className="relative w-full h-44 bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2 group-hover:scale-[1.02] transition">
                  {med.imageUrl ? (
                    <img
                      src={med.imageUrl}
                      alt={med.brandName}
                      className="w-full h-full object-contain drop-shadow-xs"
                      loading="lazy"
                    />
                  ) : (
                    <Pill className="w-12 h-12 text-teal-600/40" />
                  )}

                  {/* Dosage form badge */}
                  <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-teal-800 border border-teal-200/80 shadow-xs">
                    {med.dosageForm}
                  </span>

                  {/* Price Tag */}
                  {med.priceBdt !== undefined && (
                    <span className="absolute bottom-2 left-2 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600/95 text-white shadow-xs">
                      ৳{med.priceBdt.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Medicine Text Details */}
                <div className="space-y-2">
                  <div>
                    <div className="flex items-baseline justify-between gap-1">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition leading-tight">
                        {med.brandName}
                      </h2>
                      <span className="text-xs font-bold text-slate-500 shrink-0">
                        {med.strength}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-700 truncate mt-0.5">
                      {med.genericName}
                    </p>
                  </div>

                  {/* Visual Guide Box */}
                  {med.tabletAppearance && (
                    <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>ট্যাবলেট:</strong> {med.tabletAppearance}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{med.manufacturer}</span>
                  </div>

                  <div className="text-xs text-slate-600 line-clamp-2">
                    <strong className="text-slate-700">ব্যবহার: </strong>
                    {med.generalUses?.join(', ') || 'তথ্য নেই'}
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    DGDA অনুমোদিত
                  </span>
                  <span className="flex items-center gap-1 text-teal-600 font-bold group-hover:translate-x-0.5 transition">
                    <span>{t.medicines.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto border border-slate-200">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">{t.medicines.noResults}</p>
          </div>
        )}
      </div>

      {/* Full Medicine Details Modal */}
      {selectedMedicine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedMedicine(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-7 space-y-4 sm:space-y-5 max-h-[90dvh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                    {selectedMedicine.brandName}
                  </h3>
                  <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {selectedMedicine.strength}
                  </span>
                  {selectedMedicine.priceBdt && (
                    <span className="text-[11px] sm:text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      ৳{selectedMedicine.priceBdt.toFixed(2)} / পিস
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-bold text-teal-700">
                  {selectedMedicine.genericName}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  {selectedMedicine.manufacturer} • {selectedMedicine.dosageForm}
                </p>
              </div>

              <button
                onClick={() => setSelectedMedicine(null)}
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0 active:scale-95"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Visual Packaging Image Preview */}
            {selectedMedicine.imageUrl && (
              <div className="w-full h-44 sm:h-60 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-3 sm:p-4 flex items-center justify-center border border-slate-200/80 shadow-inner">
                <img
                  src={selectedMedicine.imageUrl}
                  alt={selectedMedicine.brandName}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
            )}

            {/* Visual Identification Guide */}
            {(selectedMedicine.tabletAppearance || selectedMedicine.packagingColor) && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Eye className="w-4 h-4 text-amber-700" />
                  <span>ট্যাবলেট ও প্যাকেজিং চেনার সহজ উপায়:</span>
                </div>
                {selectedMedicine.tabletAppearance && (
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <strong>ট্যাবলেটের রূপ:</strong> {selectedMedicine.tabletAppearance}
                  </p>
                )}
                {selectedMedicine.packagingColor && (
                  <p className="text-xs text-amber-900 leading-relaxed">
                    <strong>প্যাকেজিং / পাতা:</strong> {selectedMedicine.packagingColor}
                  </p>
                )}
              </div>
            )}

            {/* Details Content */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Indications */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">{t.medicines.indications}:</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedMedicine.generalUses?.map((use, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 font-medium border border-teal-100"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t.medicines.warnings}:</span>
                </div>
                <p className="leading-relaxed">{selectedMedicine.warnings}</p>
              </div>

              {/* Side Effects */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">{t.medicines.sideEffects}:</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedMedicine.sideEffects}
                </p>
              </div>

              {/* Interactions */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">{t.medicines.interactions}:</h4>
                <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedMedicine.interactions}
                </p>
              </div>

              {/* Verification Info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedMedicine.dataSource}
                </span>
                <span suppressHydrationWarning>
                  যাচাই: {new Date(selectedMedicine.lastVerificationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMedicine(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                {t.medicines.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
