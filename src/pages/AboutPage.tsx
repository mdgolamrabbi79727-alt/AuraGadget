import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Users,
  Compass
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language, navigateTo, storefrontSettings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden text-center max-w-5xl mx-auto">
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            {language === 'bn' ? 'আমাদের দর্শন ও প্রতিশ্রুতি' : 'Our Philosophy & Mission'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t.aboutTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.aboutSubtitle}
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? storefrontSettings.aboutStoryTitleBn : storefrontSettings.aboutStoryTitleEn}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'bn' 
              ? 'নকল গ্যাজেটের ভিড়ে আসল পণ্যের বিশ্বস্ত গন্তব্য' 
              : 'Redefining Gadget Reliability in Bangladesh'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn' ? storefrontSettings.aboutStoryP1Bn : storefrontSettings.aboutStoryP1En}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'bn' ? storefrontSettings.aboutStoryP2Bn : storefrontSettings.aboutStoryP2En}
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> 100% Verified Origins
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Direct Brand Warranty
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Nationwide Courier Fleet
            </span>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg aspect-4/3 bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
            alt="Our Tech Team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Core Pillars */}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.aboutPillarsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {language === 'bn'
              ? 'যে ৪টি মূলনীতির উপর দাঁড়িয়ে আমাদের প্রতিদিনের কার্যক্রম'
              : 'The four cornerstones of the AuraGadget promise'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar1Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar2Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar3Desc}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.pillar4Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar4Desc}</p>
          </div>
        </div>
      </div>

      {/* Showroom & Experience Center Info */}
      <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              {language === 'bn' ? 'ফিজিক্যাল ভিজিট' : 'Visit Our Flagship Store'}
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {t.showroomTitle}
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                <span>{language === 'bn' ? storefrontSettings.addressBn : storefrontSettings.addressEn}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                <span>{language === 'bn' ? storefrontSettings.hoursBn : storefrontSettings.hoursEn}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-3">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {language === 'bn' ? 'এক্সপেরিয়েন্স জোন' : 'Hands-on Tech Testing'}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'আমাদের গুলশান এক্সপেরিয়েন্স সেন্টারে এসে প্রতিটি ওয়াচ, হেডফোন বা মেকানিক্যাল কিবোর্ডের সাউন্ড ও বিল্ড কোয়ালিটি নিজেই টেস্ট করে কিনতে পারবেন।'
                : 'Experience our headphones soundstage, feel the tactile mechanical keyboard switches, and test watch strap ergonomics in person before ordering.'}
            </p>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              {language === 'bn' ? 'যোগাযোগের উপায় দেখুন' : 'Get Directions & Contact'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
