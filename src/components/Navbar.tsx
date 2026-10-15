import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sampleProducts } from '../data/products';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  Phone, 
  ChevronDown, 
  Sparkles,
  Watch,
  Headphones,
  Zap,
  Smartphone,
  Laptop,
  Check,
  Shield
} from 'lucide-react';
import { CategoryId } from '../types';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    formatPrice, 
    currentPage, 
    navigateTo, 
    totalCartItems, 
    cartSubtotal,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    products,
    storefrontSettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync local search when global searchQuery changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search suggestions using dynamic products
  const liveMatches = localSearch.trim()
    ? products.filter((p) => {
        const query = localSearch.toLowerCase();
        return (
          p.nameEn.toLowerCase().includes(query) ||
          p.nameBn.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDropdownOpen(false);
    navigateTo('shop', undefined, undefined, localSearch.trim());
  };

  const navCategories = [
    { id: 'watches' as CategoryId, label: t.catWatches, icon: Watch },
    { id: 'audio' as CategoryId, label: t.catAudio, icon: Headphones },
    { id: 'charging' as CategoryId, label: t.catCharging, icon: Zap },
    { id: 'mobile-accessories' as CategoryId, label: t.catMobile, icon: Smartphone },
    { id: 'computer-accessories' as CategoryId, label: t.catComputer, icon: Laptop },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="truncate font-medium text-slate-300">
              {language === 'bn' ? storefrontSettings.announcementBn : storefrontSettings.announcementEn}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-slate-400 shrink-0">
            <a href={`tel:${storefrontSettings.hotline}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{storefrontSettings.hotline}</span>
            </a>
            <button 
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 hover:text-blue-300 transition-colors font-medium text-slate-300"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? 'এডমিন পোর্টাল' : 'Admin Portal'}</span>
            </button>
            <button 
              onClick={() => navigateTo('contact')}
              className="hover:text-white transition-colors"
            >
              {t.helpCenter}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand Logo */}
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  {language === 'bn' ? storefrontSettings.storeNameBn : storefrontSettings.storeNameEn}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-700">
                  BD
                </span>
              </div>
              <p className="text-[10px] text-slate-700 tracking-wider font-semibold uppercase -mt-0.5 hidden sm:block">
                {language === 'bn' ? storefrontSettings.taglineBn : storefrontSettings.taglineEn}
              </p>
            </div>
          </button>

          {/* Search Bar - Desktop */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:ring-3 focus:ring-blue-100 outline-hidden transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                {t.searchAction}
              </button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {searchDropdownOpen && localSearch.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {liveMatches.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {language === 'bn' ? 'সরাসরি পণ্য সাজেশন্স' : 'Matching Products'}
                    </div>
                    {liveMatches.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSearchDropdownOpen(false);
                          navigateTo('product-details', p.id);
                        }}
                        className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-lg transition-colors group"
                      >
                        <img 
                          src={p.images[0]} 
                          alt={p.nameEn} 
                          className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {language === 'bn' ? p.nameBn : p.nameEn}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {p.category.replace('-', ' ')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-slate-900">
                            {formatPrice(p.discountPrice || p.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                    <div className="p-2 text-center bg-slate-50">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {language === 'bn' 
                          ? `"${localSearch}" এর সকল ফলাফল দেখুন` 
                          : `View all results for "${localSearch}"`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    {language === 'bn' ? 'কোনো পণ্য মেলেনি' : 'No matching products found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Tools: Language, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                aria-label="বাংলা ভাষায় পরিবর্তন করুন"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'bn'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => navigateTo('wishlist')}
              aria-label="Wishlist"
              className={`relative p-2.5 rounded-xl border transition-colors ${
                currentPage === 'wishlist'
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => navigateTo('cart')}
              aria-label="Cart"
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all ${
                currentPage === 'cart'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-extrabold text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <span className="text-slate-300 block text-[10px] uppercase font-semibold">
                  {t.navCart}
                </span>
                <span className="font-bold text-white">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-20 py-2 bg-slate-100 text-xs text-slate-800 rounded-lg border border-slate-200 outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md"
            >
              {t.searchAction}
            </button>
          </form>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-slate-50/90 border-t border-slate-200/70 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {/* All Products link */}
            <button
              type="button"
              onClick={() => navigateTo('shop', undefined, 'all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                currentPage === 'shop' && selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{t.navShop}</span>
            </button>

            {/* Individual Categories */}
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = currentPage === 'shop' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => navigateTo('shop', undefined, cat.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Page Links */}
          <div className="flex items-center gap-4 py-1.5 text-slate-600">
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className={`hover:text-blue-600 transition-colors ${
                currentPage === 'about' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              {t.navAbout}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className={`hover:text-blue-600 transition-colors ${
                currentPage === 'contact' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              {t.navContact}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              {t.allCategories}
            </p>
            <button
              type="button"
              onClick={() => {
                navigateTo('shop', undefined, 'all');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>{t.navShop}</span>
              {currentPage === 'shop' && selectedCategory === 'all' && (
                <Check className="w-4 h-4 text-blue-600" />
              )}
            </button>
            {navCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    navigateTo('shop', undefined, cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{cat.label}</span>
                  </div>
                  {currentPage === 'shop' && selectedCategory === cat.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              type="button"
              onClick={() => {
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('about');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.navAbout}
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t.navContact}
            </button>
            <button
              type="button"
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'এডমিন পোর্টাল' : 'Admin Portal'}</span>
              </div>
              <span className="text-[10px] bg-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded-sm">Demo</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            <p className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              {t.topBarHotline}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
