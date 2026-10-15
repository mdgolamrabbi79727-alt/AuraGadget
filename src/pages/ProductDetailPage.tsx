import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    currentProductId, 
    navigateTo, 
    language, 
    t, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openCheckout,
    showToast,
    products 
  } = useApp();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery' | 'reviews'>('desc');

  const product = products.find((p) => p.id === currentProductId) || products[0];
  const isFavorited = isInWishlist(product.id);

  const productName = language === 'bn' ? product.nameBn : product.nameEn;
  const productDesc = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const specs = language === 'bn' ? product.specsBn : product.specsEn;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    openCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        language === 'bn' ? 'পণ্য লিংক কপি করা হয়েছে' : 'Product link copied to clipboard',
        'info'
      );
    }
  };

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Breadcrumbs & Back Link */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="hover:text-blue-600 transition-colors"
          >
            {t.homeBreadcrumb}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => navigateTo('shop', undefined, product.category)}
            className="capitalize hover:text-blue-600 transition-colors"
          >
            {product.category.replace('-', ' ')}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
            {productName}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('shop')}
          className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToShop}</span>
        </button>
      </div>

      {/* Main Product Showcase: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-200 group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-sm">
                -{discountPercent}%
              </span>
            )}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share product"
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-blue-600 transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Status */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md">
                {product.category.replace('-', ' ')}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {t.skuLabel}: {product.id.toUpperCase()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {productName}
            </h1>

            {/* Rating & Stock */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-slate-800 text-sm ml-1">{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} {t.reviewsCount})</span>
              </div>

              <span className="text-slate-300">•</span>

              <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                product.stock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {product.stock > 5 ? t.inStock : t.lowStock} ({product.stock} {language === 'bn' ? 'টি স্টকে আছে' : 'left'})
              </span>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {formatPrice(product.discountPrice ?? product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  {t.saveAmount} {formatPrice(product.price - product.discountPrice!)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {productDesc}
            </p>
          </div>

          {/* Purchasing Tools */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.quantityLabel}:
              </span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-99 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock <= 0 ? t.outOfStock : t.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-99 cursor-pointer"
              >
                <span>{product.stock <= 0 ? t.outOfStock : t.buyNow}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t.deliveryDhaka}</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.officialWarranty}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Delivery & Warranty, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.productDescription}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.specifications}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'delivery'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.deliveryWarranty}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.customerReviews}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              <p>{productDesc}</p>
              <p>
                {language === 'bn'
                  ? 'অরা গ্যাজেট থেকে সংগৃহীত সকল পণ্য প্রস্তুতকারকের মান নিয়ন্ত্রক পরীক্ষায় উত্তীর্ণ। দীর্ঘস্থায়িত্ব, নিখুঁত ফিনিশিং এবং আধুনিক লাইফস্টাইলের চাহিদাকে গুরুত্ব দিয়ে এটি তৈরি করা হয়েছে।'
                  : 'All accessories listed at AuraGadget are rigorously verified for build quality and performance under real-world usage. Designed with high-grade components to accompany your daily productivity and personal tech gear seamlessly.'}
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl divide-y divide-slate-100 text-xs sm:text-sm">
              {Object.entries(specs).map(([specKey, specVal]) => (
                <div key={specKey} className="py-2.5 flex justify-between">
                  <span className="font-semibold text-slate-500">{specKey}</span>
                  <span className="font-bold text-slate-800 text-right">{specVal}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-slate-600">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">{t.deliveryDhaka}</h4>
                <p className="text-slate-500">{t.freeShippingThreshold}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">{t.deliveryOutsideDhaka}</h4>
                <p className="text-slate-500">
                  {language === 'bn' 
                    ? 'বাংলাদেশের ৬৪ জেলার যেকোনো প্রান্তে কুরিয়ার সার্ভিসের মাধ্যমে নিরাপদ হোম ডেলিভারি।' 
                    : 'Doorstep delivery across all 64 districts in Bangladesh with verified tracking.'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900">{t.replacementPolicy}</h4>
                <p className="text-slate-500">{t.officialWarranty}</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-slate-900">{product.rating}</span>
                  <span className="text-slate-400 text-sm"> / 5.0</span>
                  <p className="text-xs text-slate-500 mt-0.5">{language === 'bn' ? 'যাচাইকৃত গ্রাহক সন্তুষ্টি' : 'Verified Customer Satisfaction'}</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Sample Verified Reviews */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Tanvir H. (Dhaka)</span>
                    <span className="text-slate-400 text-[11px]">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    {language === 'bn' ? 'প্যাকেজিং অসাধারণ ছিল এবং ডেলিভারি খুব দ্রুত হয়েছে। পণ্যের ফিনিশ একদম নিখুঁত।' : 'Packaging was top notch and delivery arrived in Dhaka within 24 hours. The build quality feels very durable.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Shirin Akter (Sylhet)</span>
                    <span className="text-slate-400 text-[11px]">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600">
                    {language === 'bn' ? 'খুবই সুন্দর ডিজাইন এবং আসল পণ্য। আমি আমার বন্ধুদেরও সাজেস্ট করেছি।' : 'Authentic product with official warranty document inside. Highly recommended for daily use.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.relatedProducts}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
