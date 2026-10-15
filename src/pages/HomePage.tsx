import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { categories, sampleProducts } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Star, 
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Zap
} from 'lucide-react';
import { CategoryId } from '../types';

export const HomePage: React.FC = () => {
  const { t, language, navigateTo, products, categories, storefrontSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | CategoryId>('all');

  // Flash deals countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 24, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered featured products from dynamic store
  const featuredProducts = products.filter((p) => {
    if (activeTab === 'all') return p.featured;
    return p.featured && p.category === activeTab;
  });

  // Deals / Discounted products
  const dealProducts = products
    .filter((p) => p.discountPrice && p.discountPrice < p.price)
    .slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden border border-slate-800 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
              
              {/* Left Column: Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'bn' ? storefrontSettings.heroBadgeBn : storefrontSettings.heroBadgeEn}</span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  {language === 'bn' ? storefrontSettings.heroTitleBn : storefrontSettings.heroTitleEn}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {language === 'bn' ? storefrontSettings.heroSubtitleBn : storefrontSettings.heroSubtitleEn}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => navigateTo('shop')}
                    className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>{language === 'bn' ? storefrontSettings.heroCtaTextBn : storefrontSettings.heroCtaTextEn}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('deals-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    {t.heroCtaDeals}
                  </button>
                </div>

                {/* Social Proof */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                  <div className="flex items-center -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                    <span className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-slate-900 bg-blue-600 text-[10px] font-bold text-white">
                      15k+
                    </span>
                  </div>
                  <span>{t.heroHappyCustomers}</span>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                  <img
                    src={storefrontSettings.heroImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"}
                    alt="Hero Gadget"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                        {language === 'bn' ? 'টপ রেটেড অডিও' : 'Featured Audio 2026'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-white truncate">
                        {language === 'bn' ? 'ওভার-ইয়ার ওয়্যারলেস হেডফোন' : 'Over-Ear Wireless Headphones'}
                      </p>
                      <p className="text-xs font-semibold text-blue-300">৳৪,১৯০ / ৳4,190</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo('product-details', 'prod-7')}
                      className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                      aria-label="View product"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Propositions Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Prop 1 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.prop1Title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t.prop1Desc}</p>
            </div>
          </div>

          {/* Prop 2 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.prop2Title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t.prop2Desc}</p>
            </div>
          </div>

          {/* Prop 3 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.prop3Title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t.prop3Desc}</p>
            </div>
          </div>

          {/* Prop 4 */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{t.prop4Title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{t.prop4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse By Category Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.categoriesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.categoriesSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('shop', undefined, 'all')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'Explore All Categories'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigateTo('shop', undefined, cat.id)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-blue-500 transition-all duration-300 hover:shadow-lg text-left flex flex-col"
            >
              <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-md">
                  {cat.itemCount} {language === 'bn' ? 'টি পণ্য' : 'Items'}
                </span>
              </div>
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {language === 'bn' ? cat.descriptionBn : cat.descriptionEn}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured Innovations (With Category Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.featuredTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.featuredSubtitle}
            </p>
          </div>

          {/* Tab Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'bn' ? 'সকল' : 'All Featured'}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveTab(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === c.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {language === 'bn' ? c.nameBn : c.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Flash Deals Section with Live Countdown Timer */}
      <section id="deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-blue-500/10 rounded-3xl p-6 sm:p-10 border border-amber-200/60 shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
                <Zap className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'bn' ? 'সীমিত সময়ের বিশেষ অফার' : 'Limited Time Deals'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t.dealsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {t.dealsSubtitle}
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-slate-600 mr-1">
                {language === 'bn' ? 'শেষ হতে বাকি:' : 'Ends in:'}
              </span>
              <div className="flex items-center gap-1 font-mono font-black text-sm text-slate-900">
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-1 rounded-md">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us / Value Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.whyChooseTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t.whyChooseSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar1Desc}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar2Desc}</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t.pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.pillar3Desc}</p>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.testimonialsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            {t.testimonialsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{t.testimonial1Text}"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-900">{t.testimonial1Name}</p>
              <p className="text-xs text-slate-400">{t.testimonial1Role}</p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{t.testimonial2Text}"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-900">{t.testimonial2Name}</p>
              <p className="text-xs text-slate-400">{t.testimonial2Role}</p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "{t.testimonial3Text}"
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-900">{t.testimonial3Name}</p>
              <p className="text-xs text-slate-400">{t.testimonial3Role}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
