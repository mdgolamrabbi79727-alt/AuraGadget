import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, language, storefrontSettings } = useApp();

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = t.contactValidationName;
    if (!email.trim() || !email.includes('@')) errs.email = t.contactValidationEmail;
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = t.contactValidationPhone;
    if (!message.trim() || message.trim().length < 10) errs.message = t.contactValidationMessage;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          {language === 'bn' ? 'সরাসরি সহায়তা' : 'Customer Support'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.contactTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {t.contactSubtitle}
        </p>
      </div>

      {/* Main Grid: Form (7 cols) + Contact Info (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">{t.contactFormTitle}</h2>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Received!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.contactSuccess}
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors"
              >
                {language === 'bn' ? 'অন্য বার্তা পাঠান' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contactName} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asif Mahmud"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                      errors.name ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contactEmail} *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. asif@example.com"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                      errors.email ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contactPhone} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                      errors.phone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.contactSubject}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Product Warranty Inquiry"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.contactMessage} *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with our gadget accessories?"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                    errors.message ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.contactSubmit}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              {t.contactInfoTitle}
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {language === 'bn' ? 'অফিস ও শোরুম' : 'Showroom & Office'}
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {language === 'bn' ? storefrontSettings.addressBn : storefrontSettings.addressEn}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {language === 'bn' ? 'হটলাইন ও হোয়াটসঅ্যাপ' : 'Direct Helpline & WhatsApp'}
                  </span>
                  <p className="text-slate-400 font-mono">{storefrontSettings.hotline}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Email Support'}
                  </span>
                  <p className="text-slate-400">{storefrontSettings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">
                    {language === 'bn' ? 'গ্রাহকসেবা সময়সূচি' : 'Support Hours'}
                  </span>
                  <p className="text-slate-400">
                    {language === 'bn' ? storefrontSettings.hoursBn : storefrontSettings.hoursEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
