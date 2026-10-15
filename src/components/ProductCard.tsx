import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { 
    language, 
    t, 
    formatPrice, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openQuickView,
    cart
  } = useApp();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCartCount = cartItem?.quantity || 0;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const productName = language === 'bn' ? product.nameBn : product.nameEn;
  const productDescription = language === 'bn' ? product.descriptionBn : product.descriptionEn;

  const handleCardClick = () => {
    navigateTo('product-details', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 p-4 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col sm:flex-row gap-5 items-center"
      >
        {/* Thumbnail Image */}
        <div className="relative w-full sm:w-48 h-48 bg-slate-100 rounded-xl overflow-hidden shrink-0">
          <img
            src={product.images[0] || FALLBACK_IMAGE}
            alt={productName}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-bold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 w-full space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {productName}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {productDescription}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900">
                {formatPrice(product.discountPrice ?? product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.stock <= 5 && (
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {t.lowStock}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            aria-label={product.stock <= 0 ? t.outOfStock : t.addToCart}
            className={`w-full sm:w-36 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              product.stock <= 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : inCartCount > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xs'
            }`}
          >
            {product.stock <= 0 ? (
              <span>{t.outOfStock}</span>
            ) : inCartCount > 0 ? (
              <>
                <Check className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? `কার্টে আছে (${inCartCount})` : `In Cart (${inCartCount})`}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label="Wishlist"
              className={`p-2.5 rounded-xl border transition-colors ${
                isFavorited
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleQuickView}
              aria-label="Quick View"
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col overflow-hidden relative"
    >
      {/* Product Image Section */}
      <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
        <img
          src={product.images[0] || FALLBACK_IMAGE}
          alt={productName}
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.stock <= 0 ? (
            <span className="bg-slate-900/90 text-rose-300 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg shadow-sm border border-rose-500/30">
              {t.outOfStock}
            </span>
          ) : hasDiscount ? (
            <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg shadow-sm">
              -{discountPercent}%
            </span>
          ) : null}
          {product.featured && product.stock > 0 && (
            <span className="bg-blue-600 text-white font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-sm">
              {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isFavorited ? (language === 'bn' ? 'উইশলিস্ট থেকে সরান' : 'Remove from wishlist') : (language === 'bn' ? 'উইশলিস্টে যোগ করুন' : 'Add to wishlist')}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
          </button>
          
          <button
            type="button"
            onClick={handleQuickView}
            aria-label={language === 'bn' ? 'একনজরে দেখুন' : 'Quick view product'}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white hover:text-blue-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-600 text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {productName}
          </h3>
        </div>

        {/* Pricing and Add to Cart */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                {formatPrice(product.discountPrice ?? product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-600 line-through font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                {t.lowStock}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            aria-label={product.stock <= 0 ? t.outOfStock : t.addToCart}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : inCartCount > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-98 shadow-xs'
            }`}
          >
            {product.stock <= 0 ? (
              <span>{t.outOfStock}</span>
            ) : inCartCount > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'bn' ? `কার্টে যোগ করা (${inCartCount})` : `In Cart (${inCartCount})`}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
