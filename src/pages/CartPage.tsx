import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    deliveryZone, 
    setDeliveryZone, 
    deliveryFee, 
    appliedCoupon, 
    couponDiscount, 
    applyCoupon, 
    removeCoupon, 
    cartFinalTotal, 
    formatPrice, 
    language, 
    t, 
    navigateTo, 
    openCheckout,
    storefrontSettings 
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  // Free delivery threshold progress
  const freeThreshold = storefrontSettings.freeShippingThreshold || 2500;
  const neededForFree = Math.max(0, freeThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 shadow-xs space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.cartEmptyTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.cartEmptyDesc}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-blue-500/20"
          >
            <span>{t.cartEmptyAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.cartTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.cartSubtitle}
        </p>
      </div>

      {/* Free shipping progress alert */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-slate-700">
            <Truck className="w-4 h-4 text-blue-600" />
            {neededForFree > 0 ? (
              <span>
                {language === 'bn'
                  ? `ফ্রি ডেলিভারি পেতে আরও ${formatPrice(neededForFree)} টাকার পণ্য যোগ করুন`
                  : `Add ${formatPrice(neededForFree)} more to qualify for Free Nationwide Delivery!`}
              </span>
            ) : (
              <span className="text-emerald-600 font-bold">
                🎉 {t.freeDeliveryBadge} ({language === 'bn' ? '২,৫০০ টাকার অধিক অর্ডারে ফ্রি শিপিং' : 'Free delivery on orders over ৳2,500'})
              </span>
            )}
          </div>
          <span className="text-slate-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              progressPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items Table (8 cols) & Order Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
            {cart.map((item) => {
              const p = item.product;
              const name = language === 'bn' ? p.nameBn : p.nameEn;
              const unitPrice = p.discountPrice ?? p.price;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div key={p.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
                  {/* Image */}
                  <img
                    src={p.images[0] || FALLBACK_IMAGE}
                    alt={name}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-100 shrink-0 cursor-pointer"
                    onClick={() => navigateTo('product-details', p.id)}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 w-full text-center sm:text-left space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                      {p.category.replace('-', ' ')}
                    </span>
                    <h3
                      onClick={() => navigateTo('product-details', p.id)}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors truncate"
                    >
                      {name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.tablePrice}: <strong className="text-slate-800">{formatPrice(unitPrice)}</strong>
                    </p>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(p.id, item.quantity - 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(p.id, item.quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Subtotal & Remove */}
                  <div className="flex sm:flex-col items-center justify-between sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {formatPrice(itemTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(p.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                      title={t.clearCart}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Table Bottom Actions */}
          <div className="flex items-center justify-between text-xs font-semibold pt-2">
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.continueShopping}</span>
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="text-rose-500 hover:text-rose-700 transition-colors"
            >
              {t.clearCart}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5 sticky top-28">
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              {t.orderSummary}
            </h2>

            {/* Delivery Location Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.deliveryLocation}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('inside-dhaka')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    deliveryZone === 'inside-dhaka'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p>{t.insideDhakaOption}</p>
                  <span className="text-[10px] text-slate-400">
                    {formatPrice(storefrontSettings.deliveryFeeDhaka || 70)} / {language === 'bn' ? 'ফ্রি' : 'Free'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryZone('outside-dhaka')}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                    deliveryZone === 'outside-dhaka'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p>{t.outsideDhakaOption}</p>
                  <span className="text-[10px] text-slate-400">
                    {formatPrice(storefrontSettings.deliveryFeeOutside || 130)} / {language === 'bn' ? 'ফ্রি' : 'Free'}
                  </span>
                </button>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.promoCodeLabel}
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    {language === 'bn' ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t.promoPlaceholder}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 uppercase outline-hidden focus:border-blue-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {t.applyPromo}
                  </button>
                </form>
              )}
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'টিপ: AURA10 (১০% ছাড়) বা FREESHIP ট্রাই করুন' : 'Hint: Try AURA10 (10% off) or FREESHIP'}
              </p>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t.shippingFee}</span>
                <span className="font-semibold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">{language === 'bn' ? 'ফ্রি' : 'FREE'}</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t.discountAmount} ({appliedCoupon})</span>
                  <span className="font-bold">-{formatPrice(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>{t.totalAmount}</span>
                <span>{formatPrice(cartFinalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              onClick={openCheckout}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.proceedCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.secureCheckoutNotice}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
