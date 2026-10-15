import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLogin } from './AdminLogin';
import { ProductModal } from './ProductModal';
import { ConfirmDialog } from './ConfirmDialog';
import { Product, CategoryId, Category, StorefrontSettings } from '../../types';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Sliders, 
  Database, 
  LogOut, 
  ExternalLink, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Shield, 
  Save, 
  Eye,
  Info,
  Layers,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Smartphone,
  Banknote,
  ShieldAlert
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'categories' | 'storefront' | 'payments' | 'backup';

export const AdminPage: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminLogout, 
    products, 
    categories, 
    storefrontSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStorefrontSettings,
    updateCategory,
    activityLog,
    exportBackup,
    importBackup,
    restoreDemoData,
    formatPrice,
    language,
    setLanguage,
    t,
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Product modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete confirm dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Restore confirm dialog state
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);

  // Product table filters
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState<string>('all');
  const [tableStockStatus, setTableStockStatus] = useState<'all' | 'low' | 'out' | 'in'>('all');
  const [tableFeaturedOnly, setTableFeaturedOnly] = useState(false);

  // Storefront settings form state
  const [cmsSettings, setCmsSettings] = useState<StorefrontSettings>(storefrontSettings);

  // Sync cmsSettings if storefrontSettings updates
  React.useEffect(() => {
    setCmsSettings(storefrontSettings);
  }, [storefrontSettings]);

  // File input ref for backup import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If not logged in, show Login Screen
  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // --- Statistics calculations ---
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const featuredProducts = products.filter((p) => p.featured);
  
  const totalInventoryValuation = products.reduce((sum, p) => {
    const unitPrice = p.discountPrice ?? p.price;
    return sum + (unitPrice * p.stock);
  }, 0);

  // Filtered products for table
  const filteredTableProducts = products.filter((p) => {
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase().trim();
      const match =
        p.nameEn.toLowerCase().includes(q) ||
        p.nameBn.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (tableCategory !== 'all' && p.category !== tableCategory) {
      return false;
    }
    if (tableStockStatus === 'low' && (p.stock === 0 || p.stock > 5)) return false;
    if (tableStockStatus === 'out' && p.stock > 0) return false;
    if (tableStockStatus === 'in' && p.stock === 0) return false;
    if (tableFeaturedOnly && !p.featured) return false;
    return true;
  });

  // Handle Product CRUD
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleOpenDelete = (p: Product) => {
    setProductToDelete(p);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSaveProduct = (productData: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  // Handle CMS form save
  const handleSaveCms = (e: React.FormEvent) => {
    e.preventDefault();
    updateStorefrontSettings(cmsSettings);
  };

  // Handle Backup Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white">
                {language === 'bn' ? storefrontSettings.storeNameBn : storefrontSettings.storeNameEn}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {t.adminPortalSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Language Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'bn' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাং
            </button>
          </div>

          {/* View Public Store */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{t.adminViewStore}</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={adminLogout}
            className="p-2 sm:px-3 sm:py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            title={t.adminLogout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.adminLogout}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800/80 p-4 space-y-1.5 shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            Navigation
          </p>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 opacity-80" />
            <span>{t.adminNavDashboard}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 opacity-80" />
              <span>{t.adminNavProducts}</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {totalProducts}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tags className="w-4 h-4 opacity-80" />
              <span>{t.adminNavCategories}</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">
              {totalCategories}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('storefront')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'storefront'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 opacity-80" />
            <span>{t.adminNavStorefront}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 opacity-80" />
            <span>{t.adminNavPayments}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 opacity-80" />
            <span>{t.adminNavBackup}</span>
          </button>

          {/* Demo storage status */}
          <div className="pt-6 border-t border-slate-800/80 px-2">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Storage Profile</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <p className="text-[10px] leading-tight">
                Browser LocalStorage (Origin Bound)
              </p>
            </div>
          </div>
        </aside>

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.adminNavDashboard}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Live metrics, stock alerts, and recent store events
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Products */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-semibold">{t.adminKpiTotalProducts}</span>
                    <Package className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {totalProducts}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Across {totalCategories} categories
                  </p>
                </div>

                {/* Inventory Valuation */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-semibold">{t.adminKpiInventoryValue}</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white truncate">
                    {formatPrice(totalInventoryValuation)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Total stock retail value
                  </p>
                </div>

                {/* Low Stock (<=5) */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-semibold">{t.adminKpiLowStock}</span>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                    {lowStockProducts.length}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {outOfStockProducts.length} out of stock
                  </p>
                </div>

                {/* Featured Products */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span className="font-semibold">{t.adminKpiFeatured}</span>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {featuredProducts.length}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Highlighted on homepage
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Quick Actions:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.adminAddProduct}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('storefront')}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Edit Hero CMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.adminExportBackup}</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity Log & Low Stock Warning */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Activity Feed (2 cols) */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{t.adminRecentActivity}</span>
                    </h2>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {activityLog.length} events
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto space-y-2 pr-1">
                    {activityLog.length > 0 ? (
                      activityLog.map((act) => (
                        <div key={act.id} className="pt-2.5 pb-2 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${
                              act.type === 'create' ? 'text-emerald-400' :
                              act.type === 'delete' ? 'text-rose-400' :
                              act.type === 'system' ? 'text-blue-400' : 'text-amber-400'
                            }`}>
                              {act.action}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {act.details}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">{t.adminNoActivity}</p>
                    )}
                  </div>
                </div>

                {/* Stock Attention List (1 col) */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>Stock Attention</span>
                    </h2>
                    <span className="text-[11px] text-amber-400 font-bold">
                      {lowStockProducts.length + outOfStockProducts.length} items
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleOpenEdit(p)}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {language === 'bn' ? p.nameBn : p.nameEn}
                          </p>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {p.category.replace('-', ' ')}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          p.stock === 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                        </span>
                      </div>
                    ))}
                    {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
                      <p className="text-xs text-slate-500 text-center py-6">All products have healthy inventory!</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. PRODUCTS TAB (CRUD) */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Header and Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    {t.adminNavProducts}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage {products.length} live products in your storefront catalog
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.adminAddProduct}</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Search */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search name, category, SKU..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <select
                  value={tableCategory}
                  onChange={(e) => setTableCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-hidden focus:border-blue-500"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameEn} ({products.filter((p) => p.category === c.id).length})
                    </option>
                  ))}
                </select>

                {/* Stock Status */}
                <select
                  value={tableStockStatus}
                  onChange={(e) => setTableStockStatus(e.target.value as 'all' | 'low' | 'out' | 'in')}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-hidden focus:border-blue-500"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in">In Stock Only (&gt; 0)</option>
                  <option value="low">Low Stock (1 - 5)</option>
                  <option value="out">Out of Stock (0)</option>
                </select>

                {/* Featured Toggle */}
                <label className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tableFeaturedOnly}
                    onChange={(e) => setTableFeaturedOnly(e.target.checked)}
                    className="rounded-sm border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Featured Only</span>
                </label>
              </div>

              {/* Product Table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">{t.adminTableProduct}</th>
                        <th className="py-3 px-4">{t.adminTableCategory}</th>
                        <th className="py-3 px-4">{t.adminTablePrice}</th>
                        <th className="py-3 px-4">{t.adminTableStock}</th>
                        <th className="py-3 px-4">{t.adminTableFeatured}</th>
                        <th className="py-3 px-4 text-right">{t.adminTableActions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredTableProducts.map((p) => {
                        const isLow = p.stock > 0 && p.stock <= 5;
                        const isOut = p.stock === 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.nameEn}
                                  className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate max-w-xs sm:max-w-sm">
                                    {language === 'bn' ? p.nameBn : p.nameEn}
                                  </p>
                                  <p className="text-[10px] text-slate-500 font-mono">
                                    SKU: {p.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 capitalize">
                                {p.category.replace('-', ' ')}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="font-bold text-white">
                                {formatPrice(p.discountPrice ?? p.price)}
                              </div>
                              {p.discountPrice && p.discountPrice < p.price && (
                                <span className="text-[10px] text-slate-500 line-through">
                                  {formatPrice(p.price)}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isOut
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : isLow
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {p.stock} units
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {p.featured ? (
                                <span className="text-indigo-400 font-semibold text-[11px] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Yes
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[11px]">No</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenDelete(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredTableProducts.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No products matching your search or filters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.adminNavCategories}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage product groupings and category display cards
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.id).length;

                  return (
                    <div
                      key={c.id}
                      className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img src={c.image} alt={c.nameEn} className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-blue-300 px-2 py-0.5 rounded-md border border-slate-700">
                          {count} Products
                        </span>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-base">
                              {c.nameEn}
                            </h3>
                            <span className="text-xs font-semibold text-blue-400">
                              {c.nameBn}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {language === 'bn' ? c.descriptionBn : c.descriptionEn}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                          <span className="font-mono text-[10px]">Slug: {c.id}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('products');
                              setTableCategory(c.id);
                            }}
                            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                          >
                            View Products &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. STOREFRONT CMS TAB */}
          {activeTab === 'storefront' && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.adminNavStorefront}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Customize hero banner, store branding, announcement messages, and hotline
                </p>
              </div>

              <form onSubmit={handleSaveCms} className="space-y-8">
                
                {/* 1. Branding & Announcement */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Store Branding & Announcement</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Store Name (English)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.storeNameEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, storeNameEn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        স্টোরের নাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.storeNameBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, storeNameBn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tagline (English)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.taglineEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, taglineEn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        ট্যাগলাইন (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.taglineBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, taglineBn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Top Announcement (English)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.announcementEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, announcementEn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        টপ অ্যানাউন্সমেন্ট (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.announcementBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, announcementBn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hotline Number
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.hotline}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, hotline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={cmsSettings.email}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Homepage Hero CMS */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Homepage Hero Section CMS</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hero Badge (English)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.heroBadgeEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroBadgeEn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        হিরো ব্যাজ (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.heroBadgeBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroBadgeBn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hero Title (English)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.heroTitleEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroTitleEn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        হিরো শিরোনাম (বাংলা)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.heroTitleBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroTitleBn: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hero Subtitle (English)
                      </label>
                      <textarea
                        rows={2}
                        value={cmsSettings.heroSubtitleEn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroSubtitleEn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        হিরো সাবটাইটেল (বাংলা)
                      </label>
                      <textarea
                        rows={2}
                        value={cmsSettings.heroSubtitleBn}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, heroSubtitleBn: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Hero Showcase Image URL
                    </label>
                    <input
                      type="url"
                      value={cmsSettings.heroImageUrl}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, heroImageUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* 3. Shipping Rules & Fees */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Shipping Rates & Thresholds</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Free Shipping Over (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cmsSettings.freeShippingThreshold}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Inside Dhaka Delivery (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cmsSettings.deliveryFeeDhaka}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, deliveryFeeDhaka: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Outside Dhaka Delivery (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cmsSettings.deliveryFeeOutside}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, deliveryFeeOutside: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.adminSave}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. PAYMENT SETTINGS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.adminPaymentsTitle}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {t.adminPaymentsSubtitle}
                </p>
              </div>

              {/* Security Warning Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 space-y-1">
                  <p className="font-bold text-amber-300">
                    {language === 'bn' ? 'নিরাপত্তা ও আর্কিটেকচার সতর্কতা' : 'Security & Architecture Disclaimer'}
                  </p>
                  <p className="leading-relaxed">
                    {t.adminPaymentsSecurityNotice}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCms} className="space-y-6">
                
                {/* 1. Cash on Delivery (COD) Settings */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {t.adminPaymentCod}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {language === 'bn' ? 'ডেলিভারি পাওয়ার পর গ্রাহক নগদ টাকায় পরিশোধ করবে' : 'Customer pays cash upon physical package delivery'}
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsSettings.paymentCodEnabled}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentCodEnabled: e.target.checked })}
                        className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {cmsSettings.paymentCodEnabled 
                          ? (language === 'bn' ? 'সক্রিয়' : 'Enabled') 
                          : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled')}
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'ক্যাশ অন ডেলিভারি চালু থাকলে গ্রাহক চেকআউটে এই বিকল্পটি দেখতে পাবে। ডেলিভারি চার্জ স্টোরফ্রন্ট শিট থেকে স্বয়ংক্রিয়ভাবে প্রযোজ্য হবে।'
                      : 'When enabled, customers can choose Cash on Delivery at checkout without advance payment. Shipping charges are applied automatically.'}
                  </p>
                </div>

                {/* 2. bKash Settings */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-[#E2136E] text-white font-extrabold text-xs">
                        bKash
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {t.adminPaymentBkash}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {language === 'bn' ? 'বিকাশ মার্চেন্ট / পার্সোনাল ওয়ালেট পেমেন্ট' : 'bKash Merchant / Personal wallet instructions'}
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsSettings.paymentBkashEnabled}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentBkashEnabled: e.target.checked })}
                        className="w-4 h-4 rounded-sm text-pink-600 focus:ring-pink-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {cmsSettings.paymentBkashEnabled 
                          ? (language === 'bn' ? 'সক্রিয়' : 'Enabled') 
                          : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.adminPaymentNumber} (bKash)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.paymentBkashNumber}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentBkashNumber: e.target.value })}
                        placeholder="01711-234567"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t.adminPaymentInstructionsEn}
                        </label>
                        <textarea
                          rows={6}
                          value={cmsSettings.paymentBkashInstructionsEn}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, paymentBkashInstructionsEn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-hidden focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-500">
                          Tags: {'{number}'}, {'{amount}'}, {'{ref}'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t.adminPaymentInstructionsBn}
                        </label>
                        <textarea
                          rows={6}
                          value={cmsSettings.paymentBkashInstructionsBn}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, paymentBkashInstructionsBn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-hidden focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-500">
                          ট্যাগ: {'{number}'}, {'{amount}'}, {'{ref}'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Nagad Settings */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-[#EA1D25] text-white font-extrabold text-xs">
                        Nagad
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          {t.adminPaymentNagad}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {language === 'bn' ? 'নগদ মার্চেন্ট / পার্সোনাল ওয়ালেট পেমেন্ট' : 'Nagad Merchant / Personal wallet instructions'}
                        </p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsSettings.paymentNagadEnabled}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentNagadEnabled: e.target.checked })}
                        className="w-4 h-4 rounded-sm text-orange-600 focus:ring-orange-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {cmsSettings.paymentNagadEnabled 
                          ? (language === 'bn' ? 'সক্রিয়' : 'Enabled') 
                          : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled')}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.adminPaymentNumber} (Nagad)
                      </label>
                      <input
                        type="text"
                        value={cmsSettings.paymentNagadNumber}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentNagadNumber: e.target.value })}
                        placeholder="01811-345678"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t.adminPaymentInstructionsEn}
                        </label>
                        <textarea
                          rows={6}
                          value={cmsSettings.paymentNagadInstructionsEn}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, paymentNagadInstructionsEn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-hidden focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-500">
                          Tags: {'{number}'}, {'{amount}'}, {'{ref}'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          {t.adminPaymentInstructionsBn}
                        </label>
                        <textarea
                          rows={6}
                          value={cmsSettings.paymentNagadInstructionsBn}
                          onChange={(e) => setCmsSettings({ ...cmsSettings, paymentNagadInstructionsBn: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 outline-hidden focus:border-blue-500"
                        />
                        <span className="text-[10px] text-slate-500">
                          ট্যাগ: {'{number}'}, {'{amount}'}, {'{ref}'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Transaction ID Policy */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {t.adminPaymentRequireTrx}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {language === 'bn'
                          ? 'সক্রিয় থাকলে গ্রাহককে অর্ডার প্লেস করার পূর্বে ট্রানজেকশন আইডি লিখতে হবে'
                          : 'When enabled, customers must provide a TrxID to submit mobile banking orders'}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsSettings.paymentRequireTrxId}
                        onChange={(e) => setCmsSettings({ ...cmsSettings, paymentRequireTrxId: e.target.checked })}
                        className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        {cmsSettings.paymentRequireTrxId ? 'Required' : 'Optional'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* 5. Live Customer Preview */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>{t.adminPaymentPreview} (Live Demo)</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#E2136E] text-white font-bold text-[10px]">bKash</span>
                      <span className="font-mono text-slate-300">{cmsSettings.paymentBkashNumber || '01711-234567'}</span>
                    </div>
                    <p className="text-slate-400 whitespace-pre-line font-mono text-[11px] bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {(language === 'bn' ? cmsSettings.paymentBkashInstructionsBn : cmsSettings.paymentBkashInstructionsEn)
                        ?.replace('{number}', cmsSettings.paymentBkashNumber || '01711-234567')
                        ?.replace('{amount}', '2,450')
                        ?.replace('{ref}', 'AG-849201')}
                    </p>
                  </div>
                </div>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t.adminSave}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 6. BACKUP & RESTORE TAB */}
          {activeTab === 'backup' && (
            <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.adminNavBackup}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Export, import, or reset complete store data stored in browser LocalStorage
                </p>
              </div>

              {/* Prototype Notice */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-white">LocalStorage Persistence Notice</p>
                  <p className="leading-relaxed text-slate-400">
                    All products, categories, and storefront customizations exist within your browser profile origin. If you clear browsing data or change computers, use "Export Backup" to download a JSON file and "Import Backup" to restore on any device.
                  </p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Export Card */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                      <Download className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{t.adminExportBackup}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Download a complete formatted JSON backup including all {products.length} products, categories, and custom CMS settings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{t.adminImportBackup}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Upload a previously exported JSON backup file to overwrite current data with validated records.
                    </p>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload JSON File</span>
                    </button>
                  </div>
                </div>

                {/* Restore Demo Data Card */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">{t.adminRestoreDemo}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Reset all data back to the original 20 gadget accessories and default storefront configuration.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRestoreConfirmOpen(true)}
                    className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.adminRestoreDemo}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Modals in Admin */}
      <ProductModal
        isOpen={productModalOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        onClose={() => setProductModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title={t.adminConfirmDeleteTitle}
        message={t.adminConfirmDeleteDesc}
        confirmLabel={t.adminDeleteProduct}
        cancelLabel={t.adminCancel}
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={restoreConfirmOpen}
        title="Restore Default Demo Data?"
        message={t.adminRestoreWarning}
        confirmLabel="Restore Defaults"
        cancelLabel={t.adminCancel}
        confirmVariant="warning"
        onConfirm={() => {
          restoreDemoData();
          setRestoreConfirmOpen(false);
        }}
        onCancel={() => setRestoreConfirmOpen(false)}
      />

    </div>
  );
};
