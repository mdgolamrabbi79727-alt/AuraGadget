import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones,
  CheckCircle2,
  Shield
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, navigateTo, storefrontSettings } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setNewsletterError(t.contactValidationEmail);
      return;
    }
    setNewsletterError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Newsletter Section Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800/80">
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 rounded-3xl p-6 sm:p-10 border border-blue-500/20 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              {language === 'bn' ? 'এক্সক্লুসিভ অফার' : 'Exclusive Deals & Updates'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {t.newsletterTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.newsletterSubtitle}
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] sm:min-w-[400px]">
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{t.newsletterSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (newsletterError) setNewsletterError('');
                    }}
                    placeholder={t.newsletterPlaceholder}
                    className="w-full pl-4 pr-32 py-3 bg-slate-900 text-xs sm:text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-hidden"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{t.newsletterButton}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {newsletterError && (
                  <p className="text-[11px] text-rose-400">{newsletterError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
        {/* Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {language === 'bn' ? 'অরা গ্যাজেট' : 'AuraGadget'}
              </span>
              <span className="ml-1 text-xs font-bold text-blue-400 uppercase">BD</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            {t.footerAbout}
          </p>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{language === 'bn' ? storefrontSettings.addressBn : storefrontSettings.addressEn}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{storefrontSettings.hotline}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{storefrontSettings.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.footerQuickLinks}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">
                {t.navHome}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">
                {t.navShop}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                {t.navAbout}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                {t.navContact}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('wishlist')} className="hover:text-white transition-colors">
                {t.navWishlist}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('admin')} 
                className="hover:text-blue-400 text-blue-400 font-semibold transition-colors flex items-center gap-1.5 pt-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.footerCategories}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => navigateTo('shop', undefined, 'watches')} className="hover:text-white transition-colors">
                {t.catWatches}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop', undefined, 'audio')} className="hover:text-white transition-colors">
                {t.catAudio}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop', undefined, 'charging')} className="hover:text-white transition-colors">
                {t.catCharging}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop', undefined, 'mobile-accessories')} className="hover:text-white transition-colors">
                {t.catMobile}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('shop', undefined, 'computer-accessories')} className="hover:text-white transition-colors">
                {t.catComputer}
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Care & Trust */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.footerCustomerCare}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                {t.faqTitle}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                {t.deliveryDhaka}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                {t.replacementPolicy}
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                {t.officialWarranty}
              </button>
            </li>
          </ul>

          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              {t.footerPaymentMethods}
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-1 bg-pink-950 text-pink-300 border border-pink-800 rounded-md">bKash</span>
              <span className="px-2 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-md">Nagad</span>
              <span className="px-2 py-1 bg-purple-950 text-purple-300 border border-purple-800 rounded-md">Rocket</span>
              <span className="px-2 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-md">VISA</span>
              <span className="px-2 py-1 bg-slate-900 text-slate-300 border border-slate-700 rounded-md">COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>{t.footerCopyright}</p>
        <p className="text-[11px] text-amber-400/90 text-center md:text-right max-w-xl">
          {t.footerDisclaimer}
        </p>
      </div>
    </footer>
  );
};
