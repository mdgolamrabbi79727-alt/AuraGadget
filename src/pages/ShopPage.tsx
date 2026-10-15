import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Filter, 
  X, 
  Search, 
  Grid3X3, 
  List, 
  SlidersHorizontal, 
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';
import { CategoryId, SortOption } from '../types';

export const ShopPage: React.FC = () => {
  const { 
    t, 
    language, 
    formatPrice, 
    selectedCategory, 
    searchQuery, 
    setSearchQuery, 
    navigateTo,
    products,
    categories
  } = useApp();

  // Local filter states
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync if context category changes (e.g. user clicked navbar link)
  React.useEffect(() => {
    setActiveCategory(selectedCategory || 'all');
  }, [selectedCategory]);

  // Handle category selection
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setMinPrice(0);
    setMaxPrice(6000);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery('');
  };

  const hasActiveFilters = 
    activeCategory !== 'all' || 
    minPrice > 0 || 
    maxPrice < 6000 || 
    inStockOnly || 
    onSaleOnly || 
    Boolean(searchQuery.trim());

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matches =
            product.nameEn.toLowerCase().includes(q) ||
            product.nameBn.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.descriptionEn.toLowerCase().includes(q) ||
            product.descriptionBn.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }

        // Price range
        const actualPrice = product.discountPrice ?? product.price;
        if (actualPrice < minPrice || actualPrice > maxPrice) {
          return false;
        }

        // In Stock
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        // On Sale
        if (onSaleOnly && (!product.discountPrice || product.discountPrice >= product.price)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;

        switch (sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'rating':
            return b.rating - a.rating;
          case 'name-asc':
            return (language === 'bn' ? a.nameBn : a.nameEn).localeCompare(
              language === 'bn' ? b.nameBn : b.nameEn
            );
          case 'name-desc':
            return (language === 'bn' ? b.nameBn : b.nameEn).localeCompare(
              language === 'bn' ? a.nameBn : a.nameEn
            );
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [searchQuery, activeCategory, minPrice, maxPrice, inStockOnly, onSaleOnly, sortBy, language]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            {language === 'bn' ? 'অরা গ্যাজেট স্টোর' : 'AuraGadget Catalog'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t.shopTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.shopSubtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters & Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>{t.filterTitle}</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {t.clearFilters}
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.categoryLabel}
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.allCategories}</span>
                  <span className="text-[11px] text-slate-400">{products.length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCategoryChange(c.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeCategory === c.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{language === 'bn' ? c.nameBn : c.nameEn}</span>
                    <span className="text-[11px] text-slate-400">{c.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-slate-400">
                  {t.priceRange}
                </label>
                <span className="font-bold text-slate-800">
                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="6000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold"
                  placeholder="Min"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.min(10000, Number(e.target.value)))}
                  className="w-1/2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Availability & Deals checkboxes */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.availability}
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium">{t.inStockOnly}</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium">{t.onSaleOnly}</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Listing Main Column */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar: Search, Sort, View Modes */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden py-2 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>{t.filterTitle}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            {/* Results Counter */}
            <div className="text-xs text-slate-500 font-medium">
              <span>{t.showingResults} </span>
              <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong>
              <span> {t.ofResults} {products.length} {t.productsWord}</span>
            </div>

            {/* Right Tools: Sort & View Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  {t.sortBy}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:border-blue-500"
                >
                  <option value="featured">{t.sortFeatured}</option>
                  <option value="price-low">{t.sortPriceLow}</option>
                  <option value="price-high">{t.sortPriceHigh}</option>
                  <option value="rating">{t.sortRating}</option>
                  <option value="name-asc">{t.sortNameAsc}</option>
                  <option value="name-desc">{t.sortNameDesc}</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Pill Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">{t.activeFilters}:</span>

              {activeCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  <span>{activeCategory.replace('-', ' ')}</span>
                  <button onClick={() => setActiveCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onSaleOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-100">
                  <span>{t.onSaleOnly}</span>
                  <button onClick={() => setOnSaleOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                  <span>{t.inStockOnly}</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline ml-2"
              >
                {t.resetAll}
              </button>
            </div>
          )}

          {/* Product Items Grid / List or Empty State */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t.noProductsFound}</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                {t.noProductsSuggestion}
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetAll}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{t.filterTitle}</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.categoryLabel}
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryChange('all');
                    setMobileFilterOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {t.allCategories}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(c.id);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {language === 'bn' ? c.nameBn : c.nameEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                {t.priceRange}
              </label>
              <span className="text-xs font-bold text-slate-800">
                Max: {formatPrice(maxPrice)}
              </span>
              <input
                type="range"
                min="0"
                max="6000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-sm border-slate-300 text-blue-600"
                />
                <span>{t.inStockOnly}</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded-sm border-slate-300 text-blue-600"
                />
                <span>{t.onSaleOnly}</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {language === 'bn' ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
