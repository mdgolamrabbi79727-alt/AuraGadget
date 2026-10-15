import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Banknote, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Info,
  ShieldAlert
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cart, 
    cartSubtotal, 
    deliveryFee, 
    deliveryZone, 
    setDeliveryZone, 
    couponDiscount, 
    cartFinalTotal, 
    clearCart, 
    formatPrice, 
    t, 
    language, 
    navigateTo, 
    storefrontSettings 
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Determine initial active payment method based on admin settings
  const defaultMethod: PaymentMethod = useMemo(() => {
    if (storefrontSettings.paymentCodEnabled) return 'cod';
    if (storefrontSettings.paymentBkashEnabled) return 'bkash';
    if (storefrontSettings.paymentNagadEnabled) return 'nagad';
    return 'cod';
  }, [storefrontSettings.paymentCodEnabled, storefrontSettings.paymentBkashEnabled, storefrontSettings.paymentNagadEnabled]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(defaultMethod);
  const [mobilePaymentMode, setMobilePaymentMode] = useState<'manual' | 'online'>('manual');
  const [trxId, setTrxId] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [submittedTrxId, setSubmittedTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Generate a stable simulated session order reference
  const orderRef = useMemo(() => {
    return `AG-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [isCheckoutOpen]);

  // Keyboard Escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        closeCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, closeCheckout]);

  // Reset payment method if current one becomes disabled
  React.useEffect(() => {
    if (paymentMethod === 'cod' && !storefrontSettings.paymentCodEnabled) {
      setPaymentMethod(defaultMethod);
    } else if (paymentMethod === 'bkash' && !storefrontSettings.paymentBkashEnabled) {
      setPaymentMethod(defaultMethod);
    } else if (paymentMethod === 'nagad' && !storefrontSettings.paymentNagadEnabled) {
      setPaymentMethod(defaultMethod);
    }
  }, [storefrontSettings, paymentMethod, defaultMethod]);

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = t.contactValidationName;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      newErrors.phone = t.contactValidationPhone;
    }
    if (!address.trim() || address.trim().length < 6) {
      newErrors.address = language === 'bn' ? 'অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা লিখুন' : 'Please provide your full delivery address';
    }

    // Mobile payment TrxID validation if required
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && storefrontSettings.paymentRequireTrxId) {
      if (!trxId.trim() || trxId.trim().length < 4) {
        newErrors.trxId = t.transactionIdRequiredError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate simulated order ID
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `AURA-BD-${randomNum}`;
    setConfirmedOrderId(orderId);
    setSubmittedTrxId(trxId.trim());
    setOrderConfirmed(true);
    clearCart();
  };

  const handleCloseAndFinish = () => {
    setOrderConfirmed(false);
    setTrxId('');
    closeCheckout();
    navigateTo('home');
  };

  const dhakaFee = storefrontSettings.deliveryFeeDhaka || 70;
  const outsideFee = storefrontSettings.deliveryFeeOutside || 130;
  const freeLimit = storefrontSettings.freeShippingThreshold || 2500;

  // Mobile Banking details
  const currentMobileNumber = paymentMethod === 'bkash'
    ? (storefrontSettings.paymentBkashNumber || '01711-234567')
    : (storefrontSettings.paymentNagadNumber || '01811-345678');

  const rawInstructions = paymentMethod === 'bkash'
    ? (language === 'bn' ? storefrontSettings.paymentBkashInstructionsBn : storefrontSettings.paymentBkashInstructionsEn)
    : (language === 'bn' ? storefrontSettings.paymentNagadInstructionsBn : storefrontSettings.paymentNagadInstructionsEn);

  const formattedInstructions = (rawInstructions || '')
    .replace('{number}', currentMobileNumber)
    .replace('{amount}', cartFinalTotal.toLocaleString('en-US'))
    .replace('{ref}', orderRef);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentMobileNumber.replace(/\s+/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(orderRef);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div 
      onClick={closeCheckout}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">
              {orderConfirmed ? t.orderSuccessTitle : t.checkoutTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {orderConfirmed ? t.orderSuccessSubtitle : t.checkoutSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {orderConfirmed ? (
            /* Order Success State */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {t.orderIdLabel}
                </span>
                <span className="text-2xl font-mono font-extrabold text-blue-600">
                  {confirmedOrderId}
                </span>
              </div>

              {/* Order Details & Summary Card */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs sm:text-sm space-y-3 max-w-lg mx-auto">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">{t.estimatedDeliveryLabel}:</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryZone === 'inside-dhaka' 
                      ? (language === 'bn' ? '২৪ - ৪৮ ঘণ্টা' : '24 - 48 Hours')
                      : (language === 'bn' ? '৪৮ - ৭২ ঘণ্টা' : '48 - 72 Hours')}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">{t.paymentMethodChosen}:</span>
                  <span className="font-bold text-slate-800">
                    {paymentMethod === 'cod' && t.payCod}
                    {paymentMethod === 'bkash' && 'bKash Mobile Banking'}
                    {paymentMethod === 'nagad' && 'Nagad Mobile Banking'}
                  </span>
                </div>

                {/* Show unverified submitted Transaction ID if mobile payment was chosen */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-800">
                        {t.transactionIdLabel}:
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {submittedTrxId || (language === 'bn' ? 'প্রদান করা হয়নি' : 'Not submitted')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>{t.transactionIdCustomerSubmitted}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">{t.deliveryAddressSummary}:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-xs">{address}</span>
                </div>

                <div className="flex justify-between py-1 pt-2 text-base font-bold text-slate-900 border-t border-slate-200">
                  <span>{t.totalAmount}:</span>
                  <span className="text-blue-600">{formatPrice(cartFinalTotal)}</span>
                </div>
              </div>

              {/* Unverified / Prototype Notice */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-start gap-2 max-w-lg mx-auto text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <p className="leading-relaxed">
                  {language === 'bn' 
                    ? 'এটি একটি ফ্রন্টএন্ড নমুনা অর্ডার। মোবাইল পেমেন্টের ক্ষেত্রে ট্রানজেকশন আইডি প্রদান করলেও তা যাচাই না হওয়া পর্যন্ত মার্চেন্ট দ্বারা পেন্ডিং রাখা হয়।' 
                    : 'This is a frontend demonstration order. Orders submitted with a transaction ID are recorded as customer-provided and pending merchant verification.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseAndFinish}
                className="w-full max-w-lg mx-auto py-3 px-6 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md cursor-pointer"
              >
                {t.doneBtn}
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-5">
              
              {/* Product mini summary accordion / list */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{language === 'bn' ? 'অর্ডারের পণ্যসমূহ' : 'Order Items'} ({cart.length})</span>
                  <span className="font-mono text-blue-600">{formatPrice(cartFinalTotal)}</span>
                </div>
                <div className="max-h-24 overflow-y-auto space-y-1.5 divide-y divide-slate-100 text-xs">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-slate-600">
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {item.quantity}
                        </span>
                        <span className="truncate text-slate-800">
                          {language === 'bn' ? item.product.nameBn : item.product.nameEn}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 shrink-0 ml-2">
                        {formatPrice((item.product.discountPrice ?? item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1. Customer & Shipping Info */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'bn' ? '১. গ্রাহক ও ডেলিভারি তথ্য' : '1. Customer & Shipping Info'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.fullNameLabel} *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                        errors.fullName ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                        errors.phone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.districtLabel}
                    </label>
                    <select
                      value={deliveryZone}
                      onChange={(e) => setDeliveryZone(e.target.value as 'inside-dhaka' | 'outside-dhaka')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden focus:border-blue-500"
                    >
                      <option value="inside-dhaka">
                        {language === 'bn' 
                          ? `ঢাকা শহর (${formatPrice(dhakaFee)} / ${formatPrice(freeLimit)} এর অধিক অর্ডারে ফ্রি)` 
                          : `Dhaka City (${formatPrice(dhakaFee)} / Free over ${formatPrice(freeLimit)})`}
                      </option>
                      <option value="outside-dhaka">
                        {language === 'bn' 
                          ? `ঢাকার বাইরে সমগ্র বাংলাদেশ (${formatPrice(outsideFee)} / ${formatPrice(freeLimit)} এর অধিক অর্ডারে ফ্রি)` 
                          : `Outside Dhaka - All 64 Districts (${formatPrice(outsideFee)} / Free over ${formatPrice(freeLimit)})`}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.emailLabel} ({language === 'bn' ? 'ঐচ্ছিক' : 'Optional'})
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.addressLabel} *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t.addressPlaceholder}
                    className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 outline-hidden transition-all ${
                      errors.address ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
                </div>
              </div>

              {/* 2. Payment Method Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === 'bn' ? '২. পেমেন্ট পদ্ধতি' : '2. Payment Method'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {language === 'bn' ? 'বাংলাদেশি টাকা (৳)' : 'Bangladeshi Taka (৳)'}
                  </span>
                </div>

                {/* Method Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* COD */}
                  {storefrontSettings.paymentCodEnabled && (
                    <label
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative ${
                        paymentMethod === 'cod'
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Banknote className="w-4 h-4" />
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 text-blue-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{t.payCod}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.payCodDesc}</p>
                      </div>
                    </label>
                  )}

                  {/* bKash */}
                  {storefrontSettings.paymentBkashEnabled && (
                    <label
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative ${
                        paymentMethod === 'bkash'
                          ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="px-2 py-0.5 rounded-lg bg-[#E2136E] text-white font-extrabold text-xs tracking-tight">
                          bKash
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bkash"
                          checked={paymentMethod === 'bkash'}
                          onChange={() => setPaymentMethod('bkash')}
                          className="w-4 h-4 text-pink-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{t.payBkash}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.payBkashDesc}</p>
                      </div>
                    </label>
                  )}

                  {/* Nagad */}
                  {storefrontSettings.paymentNagadEnabled && (
                    <label
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative ${
                        paymentMethod === 'nagad'
                          ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="px-2 py-0.5 rounded-lg bg-[#EA1D25] text-white font-extrabold text-xs tracking-tight">
                          Nagad
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="nagad"
                          checked={paymentMethod === 'nagad'}
                          onChange={() => setPaymentMethod('nagad')}
                          className="w-4 h-4 text-orange-600"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{t.payNagad}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{t.payNagadDesc}</p>
                      </div>
                    </label>
                  )}
                </div>

                {/* Cash on Delivery Notice */}
                {paymentMethod === 'cod' && (
                  <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-blue-900 text-xs flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold">{t.payCod}</p>
                      <p className="text-blue-700 text-[11px] mt-0.5 leading-relaxed">{t.payCodNotice}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Payment (bKash or Nagad) Interactive Card */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 space-y-3 p-4">
                    
                    {/* Header with Mode Tabs */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-white text-[11px] font-bold ${
                          paymentMethod === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#EA1D25]'
                        }`}>
                          {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {language === 'bn' ? 'পেমেন্ট নির্দেশিকা ও ভেরিফিকেশন' : 'Payment Steps & Verification'}
                        </span>
                      </div>

                      {/* Mode Switcher */}
                      <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setMobilePaymentMode('manual')}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            mobilePaymentMode === 'manual'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.manualPaymentTab}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMobilePaymentMode('online')}
                          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                            mobilePaymentMode === 'online'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {t.onlineGatewayTab}
                        </button>
                      </div>
                    </div>

                    {/* Mode A: Manual Payment Instructions */}
                    {mobilePaymentMode === 'manual' ? (
                      <div className="space-y-3.5">
                        
                        {/* Quick Data Badges: Number, Amount, Ref */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Number */}
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400">
                                {t.merchantNumberLabel}
                              </p>
                              <p className="text-xs font-mono font-bold text-slate-900">
                                {currentMobileNumber}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyNumber}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                              title={t.copyNumber}
                            >
                              {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedNumber ? t.copied : t.copyNumber}</span>
                            </button>
                          </div>

                          {/* Amount */}
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <p className="text-[10px] uppercase font-bold text-slate-400">
                              {t.amountToPay}
                            </p>
                            <p className="text-xs font-mono font-bold text-blue-600">
                              {formatPrice(cartFinalTotal)}
                            </p>
                          </div>

                          {/* Reference */}
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400">
                                {t.paymentReference}
                              </p>
                              <p className="text-xs font-mono font-bold text-slate-900">
                                {orderRef}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyRef}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                              title={t.copyNumber}
                            >
                              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedRef ? t.copied : t.copyNumber}</span>
                            </button>
                          </div>
                        </div>

                        {/* Step by step formatted instructions */}
                        <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                          {formattedInstructions}
                        </div>

                        {/* Transaction ID Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-700">
                              {t.transactionIdLabel} {storefrontSettings.paymentRequireTrxId ? t.transactionIdRequired : t.transactionIdOptional}
                            </label>
                            <span className="text-[10px] text-slate-400">
                              {language === 'bn' ? 'এসএমএস থেকে TrxID' : 'From confirmation SMS'}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                            placeholder={t.transactionIdPlaceholder}
                            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-mono text-slate-800 outline-hidden transition-all ${
                              errors.trxId ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                            }`}
                          />
                          {errors.trxId ? (
                            <p className="text-[11px] text-rose-500 mt-1">{errors.trxId}</p>
                          ) : (
                            <p className="text-[10px] text-slate-500 mt-1">{t.transactionIdHelp}</p>
                          )}
                        </div>

                        {/* CRITICAL SECURITY WARNING */}
                        <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200 text-rose-900 text-[11px] flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                          <p className="leading-snug">
                            {t.noCredentialsWarning}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Mode B: Online Gateway Integration Placeholder */
                      <div className="space-y-3.5 p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl text-white ${
                            paymentMethod === 'bkash' ? 'bg-[#E2136E]' : 'bg-[#EA1D25]'
                          }`}>
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {t.onlineGatewayTab}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {t.onlineGatewayDesc}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-1 font-mono">
                          <div className="flex justify-between">
                            <span>Target Gateway:</span>
                            <span className="font-bold text-slate-800">
                              {paymentMethod === 'bkash' ? 'bKash PGW API v1.3' : 'Nagad Merchant Engine'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Callback URL:</span>
                            <span>https://auragadget.bd/api/payment/verify</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-emerald-600 font-bold">Integration Ready (Frontend Mock)</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                          <Info className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>
                            {language === 'bn'
                              ? 'প্রোডাকশন এনভায়রনমেন্টে মার্চেন্ট অনুমোদন ও সার্ভার যাচাইয়ের পর এই গেটওয়ে সক্রিয় হবে।'
                              : 'Production readiness requires official merchant credential approval and secure server-side verification.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Cost Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>{t.subtotal}:</span>
                  <span className="font-semibold text-slate-800">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.shippingFee} ({deliveryZone === 'inside-dhaka' ? t.insideDhakaOption : t.outsideDhakaOption}):</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? <span className="text-emerald-600">{t.freeDeliveryBadge}</span> : formatPrice(deliveryFee)}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>{t.discountAmount}:</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t.totalAmount}:</span>
                  <span>{formatPrice(cartFinalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-99 cursor-pointer"
              >
                <span>{t.confirmOrderBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
