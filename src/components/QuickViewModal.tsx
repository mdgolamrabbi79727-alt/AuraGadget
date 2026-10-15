import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, ShoppingBag, Heart, Check, ExternalLink, ShieldCheck, Truck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { 
    quickViewProduct, 
    closeQuickView, 
    language, 
    t, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  // Keyboard Escape listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeQuickView]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);
  const productName = language === 'bn' ? product.nameBn : product.nameEn;
  const productDesc = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const specs = language === 'bn' ? product.specsBn : product.specsEn;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
    }
  };

  const handleFullDetails = () => {
    closeQuickView();
    navigateTo('product-details', product.id);
  };

  return (
    <div 
      onClick={closeQuickView}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              <img
                src={product.images[selectedImageIndex] || product.images[0] || FALLBACK_IMAGE}
                alt={productName}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="w-full h-full object-cover"
              />
              {product.stock <= 0 ? (
                <span className="absolute top-3 left-3 bg-slate-900/90 text-rose-300 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-rose-500/30">
                  {t.outOfStock}
                </span>
              ) : hasDiscount ? (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg">
                  -{discountPercent}%
                </span>
              ) : null}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img || FALLBACK_IMAGE} 
                      alt="thumbnail" 
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Summary */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-600 font-normal">({product.reviewCount} {t.reviewsCount})</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {productName}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatPrice(product.discountPrice ?? product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-600 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm">
                    {t.saveAmount} {formatPrice(product.price - product.discountPrice!)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {productDesc}
              </p>

              {/* Quick Specs snapshot */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                {Object.entries(specs).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-slate-600">
                    <span className="text-slate-600 font-medium">{key}:</span>
                    <span className="font-semibold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">{t.quantityLabel}:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-600">
                  {product.stock} {language === 'bn' ? 'টি স্টকে আছে' : 'units in stock'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  aria-label={product.stock <= 0 ? t.outOfStock : t.addToCart}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md ${
                    product.stock <= 0
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-blue-600 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock <= 0 ? t.outOfStock : t.addToCart}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleFullDetails}
                className="w-full py-2.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ বিবরণ দেখুন' : 'View Full Product Details'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
