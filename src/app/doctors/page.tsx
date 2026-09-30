'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  BANGLADESH_BEST_DOCTORS,
  SPECIALTY_CATEGORIES,
  Doctor,
} from '@/lib/doctorsData';
import {
  Stethoscope,
  Search,
  MapPin,
  Clock,
  PhoneCall,
  Award,
  ShieldCheck,
  Star,
  Hospital,
  ChevronRight,
  X,
  Phone,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  HeartPulse,
} from 'lucide-react';

export default function BestDoctorsPage() {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Extract unique hospital names
  const hospitals = useMemo(() => {
    const set = new Set<string>();
    BANGLADESH_BEST_DOCTORS.forEach((d) => {
      set.add(language === 'bn' ? d.primaryChamber.hospitalNameBn : d.primaryChamber.hospitalNameEn);
    });
    return Array.from(set);
  }, [language]);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return BANGLADESH_BEST_DOCTORS.filter((doctor) => {
      // Specialty filter
      if (selectedSpecialty !== 'all' && doctor.specialtyCategory !== selectedSpecialty) {
        return false;
      }

      // Hospital filter
      const hospitalName = language === 'bn' ? doctor.primaryChamber.hospitalNameBn : doctor.primaryChamber.hospitalNameEn;
      if (selectedHospital !== 'all' && hospitalName !== selectedHospital) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          doctor.nameBn.toLowerCase().includes(q) || doctor.nameEn.toLowerCase().includes(q);
        const matchSpecialty =
          doctor.specialtyBn.toLowerCase().includes(q) ||
          doctor.specialtyEn.toLowerCase().includes(q) ||
          doctor.subSpecialtiesBn.some((s) => s.toLowerCase().includes(q)) ||
          doctor.subSpecialtiesEn.some((s) => s.toLowerCase().includes(q));
        const matchDegrees =
          doctor.degreesBn.toLowerCase().includes(q) || doctor.degreesEn.toLowerCase().includes(q);
        const matchHospital =
          doctor.primaryChamber.hospitalNameBn.toLowerCase().includes(q) ||
          doctor.primaryChamber.hospitalNameEn.toLowerCase().includes(q) ||
          doctor.primaryChamber.addressBn.toLowerCase().includes(q) ||
          doctor.primaryChamber.addressEn.toLowerCase().includes(q);
        const matchDesignation =
          doctor.designationBn.toLowerCase().includes(q) ||
          doctor.designationEn.toLowerCase().includes(q);

        return matchName || matchSpecialty || matchDegrees || matchHospital || matchDesignation;
      }

      return true;
    });
  }, [searchQuery, selectedSpecialty, selectedHospital, language]);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white pt-10 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-300/30 text-teal-200 text-xs sm:text-sm font-medium backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>
              {language === 'bn'
                ? 'বিএমডিসি নিবন্ধিত ও জাতীয়ভাবে স্বীকৃত সেরা বিশেষজ্ঞ চিকিৎসক'
                : 'BMDC Registered & Nationally Recognized Top Medical Specialists'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'bn' ? (
              <>
                বাংলাদেশের <span className="text-teal-300 underline decoration-teal-400/60 decoration-wavy decoration-2">শীর্ষ ও সেরা</span> ডাক্তারদের ডিরেক্টরি
              </>
            ) : (
              <>
                Directory of <span className="text-teal-300 underline decoration-teal-400/60 decoration-wavy decoration-2">Best Doctors</span> in Bangladesh
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-teal-100/90 leading-relaxed">
            {language === 'bn'
              ? 'মেডিসিন, হৃদরোগ, নিউরোলজি, ইএনটি, শিশু ও স্ত্রীরোগসহ সকল প্রধান বিভাগের জাতীয় অধ্যাপক এবং শীর্ষ বিশেষজ্ঞ চিকিৎসকদের চেম্বার, সময়সূচি ও সিরিয়াল যোগাযোগের তথ্য।'
              : 'Direct verified appointment schedules, chamber locations, and contact details of National Professors and premier specialists across Bangladesh.'}
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto pt-4">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-white p-1.5 sm:p-2 border border-teal-200/50">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-teal-600" />
              </div>
              <input
                id="doctor-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'ডাক্তারের নাম, বিভাগ (উদাঃ হৃদরোগ), হাসপাতাল বা ডিগ্রি দিয়ে খুঁজুন...'
                    : 'Search by doctor name, specialty, hospital, or degrees...'
                }
                className="w-full pl-3 pr-10 py-2.5 sm:py-3 text-slate-800 text-sm sm:text-base outline-hidden bg-transparent placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition mr-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-4 sm:p-6 mb-8 space-y-4">
          {/* Specialty Categories */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                {language === 'bn' ? 'বিভাগ অনুযায়ী বাছাই করুন' : 'Filter by Department / Specialty'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {language === 'bn' ? `${filteredDoctors.length} জন ডাক্তার তালিকাভুক্ত` : `${filteredDoctors.length} doctors found`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              {SPECIALTY_CATEGORIES.map((cat) => {
                const isActive = selectedSpecialty === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedSpecialty(cat.id)}
                    className={`whitespace-nowrap px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub Filters: Hospital selector */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Hospital className="w-4 h-4 text-slate-400" />
              <label htmlFor="hospital-select" className="font-semibold text-slate-600">
                {language === 'bn' ? 'হাসপাতাল / প্রতিষ্ঠান:' : 'Hospital / Clinic:'}
              </label>
              <select
                id="hospital-select"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-hidden focus:border-teal-500 cursor-pointer font-medium"
              >
                <option value="all">{language === 'bn' ? 'সকল হাসপাতাল' : 'All Hospitals'}</option>
                {hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </select>
            </div>

            {(selectedSpecialty !== 'all' || selectedHospital !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSpecialty('all');
                  setSelectedHospital('all');
                  setSearchQuery('');
                }}
                className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                {language === 'bn' ? 'সকল ফিল্টার মুছুন' : 'Reset all filters'}
              </button>
            )}
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'bn' ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No doctors matched your search'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'অনুগ্রহ করে ভিন্ন কোনো নাম, বিভাগ বা হাসপাতাল নির্বাচন করে পুনরায় চেষ্টা করুন।'
                : 'Try adjusting your search query or selecting a different specialty category.'}
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('all');
                setSelectedHospital('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
            >
              {language === 'bn' ? 'সকল ডাক্তার দেখুন' : 'Show All Doctors'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => {
              const name = language === 'bn' ? doctor.nameBn : doctor.nameEn;
              const specialty = language === 'bn' ? doctor.specialtyBn : doctor.specialtyEn;
              const title = language === 'bn' ? doctor.titleBn : doctor.titleEn;
              const designation = language === 'bn' ? doctor.designationBn : doctor.designationEn;
              const chamber = doctor.primaryChamber;
              const hospitalName = language === 'bn' ? chamber.hospitalNameBn : chamber.hospitalNameEn;
              const visitingHours = language === 'bn' ? chamber.visitingHoursBn : chamber.visitingHoursEn;
              const address = language === 'bn' ? chamber.addressBn : chamber.addressEn;

              return (
                <div
                  key={doctor.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Top Header Card */}
                  <div className="p-5 pb-3 flex items-start gap-4">
                    {/* Doctor Image with Verified Badge */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-teal-600/20 shadow-md group-hover:scale-102 transition duration-300 bg-slate-100">
                        <img
                          src={doctor.imageUrl}
                          alt={doctor.nameEn}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span
                        className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1 rounded-full shadow-md"
                        title={doctor.bmdcRegNo}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-teal-50 text-teal-800 border border-teal-200/80 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 truncate max-w-full">
                          <HeartPulse className="w-3 h-3 text-teal-600 shrink-0" />
                          <span className="truncate">{specialty}</span>
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition leading-snug line-clamp-1">
                        {name}
                      </h2>

                      <p className="text-xs font-semibold text-slate-600 line-clamp-1 mt-0.5">
                        {language === 'bn' ? doctor.degreesBn : doctor.degreesEn}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{doctor.rating}</span>
                          <span className="text-slate-400 font-normal text-[10px]">
                            ({doctor.reviewsCount})
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {doctor.experienceYears}+ {language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Yrs Exp.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Designation / Former Position */}
                  <div className="px-5 py-2">
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2 leading-relaxed">
                      {designation}
                    </p>
                  </div>

                  {/* Chamber Details Box */}
                  <div className="px-5 py-2.5 space-y-2 flex-1 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <Hospital className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">{hospitalName}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-medium text-[11px]">
                        {visitingHours} <span className="text-red-500 font-normal">({language === 'bn' ? chamber.offDaysBn : chamber.offDaysEn})</span>
                      </span>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {(language === 'bn' ? doctor.subSpecialtiesBn : doctor.subSpecialtiesEn)
                        .slice(0, 3)
                        .map((sub, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {sub}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 mt-2 grid grid-cols-2 gap-2">
                    {/* Call Hotline Button */}
                    <a
                      href={`tel:${chamber.rawPhones[0]}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm active:scale-95"
                      title={language === 'bn' ? 'সরাসরি কল করে সিরিয়াল নিন' : 'Call to Book Serial'}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সিরিয়াল কল' : 'Call Serial'}</span>
                    </a>

                    {/* Details Modal Trigger */}
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-slate-300 hover:border-teal-400 bg-white hover:bg-teal-50/50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>{language === 'bn' ? 'বিস্তারিত প্রোফাইল' : 'Full Profile'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Doctor Details Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-200"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedDoctor.bmdcRegNo}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-7 space-y-6">
                {/* Doctor Header Banner */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left bg-gradient-to-br from-teal-50/80 via-slate-50 to-white p-5 rounded-2xl border border-teal-100">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-teal-600/30 shadow-lg shrink-0">
                    <img
                      src={selectedDoctor.imageUrl}
                      alt={selectedDoctor.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="inline-block bg-teal-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {language === 'bn' ? selectedDoctor.specialtyBn : selectedDoctor.specialtyEn}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                      {language === 'bn' ? selectedDoctor.nameBn : selectedDoctor.nameEn}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-teal-800">
                      {language === 'bn' ? selectedDoctor.degreesBn : selectedDoctor.degreesEn}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {language === 'bn' ? selectedDoctor.designationBn : selectedDoctor.designationEn}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
                      <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{selectedDoctor.rating}</span>
                        <span className="text-slate-400 font-normal">
                          ({selectedDoctor.reviewsCount} {language === 'bn' ? 'মতামত' : 'reviews'})
                        </span>
                      </span>
                      <span className="text-slate-500 font-semibold">
                        {selectedDoctor.experienceYears}+ {language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Biography / Profile Note */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    {language === 'bn' ? 'চিকিৎসকের পরিচিতি ও কর্মজীবন' : 'Doctor Biography & Career'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    {language === 'bn' ? selectedDoctor.bioBn : selectedDoctor.bioEn}
                  </p>
                </div>

                {/* Achievements / Key Highlights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    {language === 'bn' ? 'বিশেষ অর্জন ও অবদান' : 'Key Achievements & Honors'}
                  </h4>
                  <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm text-slate-700">
                    {(language === 'bn'
                      ? selectedDoctor.achievementsBn
                      : selectedDoctor.achievementsEn
                    ).map((ach, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chamber Schedule & Visiting Rules */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Hospital className="w-4 h-4 text-teal-600" />
                    {language === 'bn' ? 'চেম্বারের স্থান ও সময়সূচি' : 'Chamber Schedule & Address'}
                  </h4>

                  <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white shadow-xs">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {language === 'bn'
                            ? selectedDoctor.primaryChamber.hospitalNameBn
                            : selectedDoctor.primaryChamber.hospitalNameEn}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {language === 'bn'
                              ? selectedDoctor.primaryChamber.addressBn
                              : selectedDoctor.primaryChamber.addressEn}
                          </span>
                        </p>
                      </div>
                      {selectedDoctor.primaryChamber.roomBn && (
                        <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-lg shrink-0">
                          {language === 'bn'
                            ? selectedDoctor.primaryChamber.roomBn
                            : selectedDoctor.primaryChamber.roomEn}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">
                            {language === 'bn' ? 'সাক্ষাতের সময়:' : 'Visiting Hours:'}
                          </p>
                          <p>
                            {language === 'bn'
                              ? selectedDoctor.primaryChamber.visitingHoursBn
                              : selectedDoctor.primaryChamber.visitingHoursEn}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">
                            {language === 'bn' ? 'বন্ধের দিন:' : 'Weekly Off Days:'}
                          </p>
                          <p className="text-red-600 font-medium">
                            {language === 'bn'
                              ? selectedDoctor.primaryChamber.offDaysBn
                              : selectedDoctor.primaryChamber.offDaysEn}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fees */}
                    <div className="bg-teal-50/60 border border-teal-100 p-2.5 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold text-teal-900">
                        {language === 'bn' ? 'পরামর্শ ফি (Consultation Fee):' : 'Consultation Fee:'}
                      </span>
                      <span className="font-extrabold text-teal-700">
                        {language === 'bn'
                          ? selectedDoctor.primaryChamber.feeBn
                          : selectedDoctor.primaryChamber.feeEn}
                      </span>
                    </div>

                    {/* Booking Instructions Notice */}
                    <div className="bg-amber-50 border border-amber-200/70 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        {language === 'bn'
                          ? selectedDoctor.primaryChamber.bookingInstructionsBn
                          : selectedDoctor.primaryChamber.bookingInstructionsEn}
                      </p>
                    </div>

                    {/* Serial Numbers with Direct Dial & Copy */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-xs font-bold text-slate-700">
                        {language === 'bn' ? 'সিরিয়াল ও তথ্যের জন্য সরাসরি কল করুন:' : 'Direct Serial Hotline Numbers:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.primaryChamber.serialPhones.map((phone, idx) => {
                          const raw = selectedDoctor.primaryChamber.rawPhones[idx] || phone;
                          const isCopied = copiedPhone === phone;
                          return (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl px-2.5 py-1.5 transition text-xs font-bold text-slate-800"
                            >
                              <a
                                href={`tel:${raw}`}
                                className="flex items-center gap-1.5 text-teal-700 hover:text-teal-900"
                              >
                                <Phone className="w-3.5 h-3.5 text-teal-600" />
                                <span>{phone}</span>
                              </a>
                              <button
                                onClick={() => handleCopyPhone(phone)}
                                className="p-1 hover:text-teal-700 transition cursor-pointer text-slate-400"
                                title="Copy number"
                              >
                                {isCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Disclaimer */}
                <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 text-center">
                  {language === 'bn'
                    ? 'অনলাইন ডক্টর বিডি কোনো অতিরিক্ত কমিশন চার্জ করে না। ডাক্তারের ব্যক্তিগত ব্যস্ততা বা হাসপাতালের অভ্যন্তরীণ পরিবর্তনের কারণে সময়সূচি পরিবর্তন হতে পারে।'
                    : 'Online Doctor BD charges no consultation booking fees. Schedules may be subject to change per hospital operational updates.'}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${selectedDoctor.primaryChamber.rawPhones[0]}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সরাসরি চেম্বারে কল করুন' : 'Call Chamber Now'}</span>
                </a>

                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="py-2.5 px-5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm transition cursor-pointer"
                >
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Emergency & Verification Banner */}
        <section className="mt-12 bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-800">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'bn' ? 'সার্বক্ষণিক নির্ভরযোগ্য সেবা' : '24/7 Verified Health Directory'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {language === 'bn'
                ? 'জরুরি চিকিৎসায় নিকটস্থ হাসপাতালের শরণাপন্ন হোন'
                : 'Need immediate emergency care?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'অনলাইন ডক্টরে যেকোনো সাধারণ শারীরিক সমস্যার জন্য আমাদের এআই স্বাস্থ্য সহকারীর সাথে ফ্রিতে তাৎক্ষণিক আলোচনা করতে পারেন।'
                : 'You can also chat freely with our AI Health Assistant for instant preliminary symptom review.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <HeartPulse className="w-4 h-4 text-slate-950" />
              <span>{language === 'bn' ? 'স্বাস্থ্য সহকারীর সাথে চ্যাট' : 'Chat with Health AI'}</span>
            </Link>

            <a
              href="tel:16263"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-teal-300" />
              <span>{language === 'bn' ? 'স্বাস্থ্য বাতায়ন ১৬২৬৩' : 'Shastho Batayan 16263'}</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
