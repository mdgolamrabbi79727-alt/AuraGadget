import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, addAllWishlistToCart, t, language, navigateTo } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-14 shadow-xs space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.wishlistEmptyTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.wishlistEmptyDesc}
          </p>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
          >
            <span>{t.wishlistEmptyAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.wishlistTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishlist.length} {t.itemsSaved}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addAllWishlistToCart}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.addAllToCart}</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            {language === 'bn' ? 'আরও পণ্য দেখুন' : 'Explore More'}
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
