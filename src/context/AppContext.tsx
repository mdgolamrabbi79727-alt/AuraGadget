import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Language, 
  Page, 
  ToastMessage, 
  StorefrontSettings, 
  AdminActivity,
  StoreBackupData,
  CategoryId
} from '../types';
import { translations, formatPrice as i18nFormatPrice } from '../i18n/translations';
import { sampleProducts, categories as defaultCategories } from '../data/products';
import { defaultStorefrontSettings } from '../data/defaultSettings';

const STORAGE_KEY_STORE_DATA = 'aura_store_data_v1';
const STORAGE_KEY_CART = 'aura_gadget_cart';
const STORAGE_KEY_WISHLIST = 'aura_gadget_wishlist';
const STORAGE_KEY_LANG = 'aura_gadget_lang';
const STORAGE_KEY_ADMIN_AUTH = 'aura_admin_session';
const STORAGE_KEY_ACTIVITY_LOG = 'aura_admin_activity_log';

interface AppContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  formatPrice: (amount: number) => string;

  // Navigation
  currentPage: Page;
  currentProductId: string | null;
  selectedCategory: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigateTo: (page: Page, productId?: string, category?: string, search?: string) => void;

  // Dynamic Products & Storefront Settings
  products: Product[];
  categories: Category[];
  storefrontSettings: StorefrontSettings;
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStorefrontSettings: (updates: Partial<StorefrontSettings>) => void;
  updateCategory: (id: CategoryId, updates: Partial<Category>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCartItems: number;
  cartSubtotal: number;
  deliveryZone: 'inside-dhaka' | 'outside-dhaka';
  setDeliveryZone: (zone: 'inside-dhaka' | 'outside-dhaka') => void;
  deliveryFee: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartFinalTotal: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  addAllWishlistToCart: () => void;

  // Quick View & Modals
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Admin Management & Auth
  isAdminAuthenticated: boolean;
  adminLogin: (user: string, pass: string) => boolean;
  adminLogout: () => void;
  activityLog: AdminActivity[];
  exportBackup: () => void;
  importBackup: (backupJson: string) => { success: boolean; message: string };
  restoreDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with localStorage persistence
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return (saved === 'bn' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore
    }
  };

  const t = translations[language] || translations.en;
  const formatPrice = useCallback(
    (amount: number) => i18nFormatPrice(amount, language),
    [language]
  );

  // 2. Centralized LocalStorage Data Layer for Products, Categories & Settings
  const [storeData, setStoreData] = useState<{
    version: number;
    products: Product[];
    categories: Category[];
    settings: StorefrontSettings;
  }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STORE_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return {
            version: parsed.version || 1,
            products: parsed.products,
            categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 
              ? parsed.categories 
              : defaultCategories,
            settings: parsed.settings 
              ? { ...defaultStorefrontSettings, ...parsed.settings } 
              : defaultStorefrontSettings,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved store data, seeding defaults', e);
    }

    // Default Seed on First Launch
    return {
      version: 1,
      products: sampleProducts,
      categories: defaultCategories,
      settings: defaultStorefrontSettings,
    };
  });

  // Save storeData to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STORE_DATA, JSON.stringify(storeData));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [storeData]);

  const products = storeData.products;
  const categories = storeData.categories;
  const storefrontSettings = storeData.settings;

  // 3. Activity Log
  const [activityLog, setActivityLog] = useState<AdminActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVITY_LOG);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'act-init',
        timestamp: new Date().toISOString(),
        action: 'System Initialized',
        details: 'Storefront loaded with 20 premium gadget accessories',
        type: 'system',
      },
    ];
  });

  const addActivity = useCallback((
    action: string, 
    details: string, 
    type: 'create' | 'update' | 'delete' | 'system' = 'update'
  ) => {
    const newEntry: AdminActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      type,
    };
    setActivityLog((prev) => {
      const updated = [newEntry, ...prev].slice(0, 50); // keep recent 50
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVITY_LOG, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // 4. Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const adminLogin = (user: string, pass: string): boolean => {
    // Frontend demo validation (username: admin, password: password123)
    if (user.trim().toLowerCase() === 'admin' && pass === 'password123') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      } catch {
        // Ignore
      }
      addActivity('Admin Logged In', `Session opened for user "${user}"`, 'system');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    } catch {
      // Ignore
    }
    addActivity('Admin Logged Out', 'Session terminated', 'system');
  };

  // 5. Navigation state & Hash synchronization
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === '#admin' || path === '/admin') {
        return 'admin';
      }
    }
    return 'home';
  });

  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = useCallback((page: Page, productId?: string, category?: string, search?: string) => {
    setCurrentPage(page);
    if (productId !== undefined) {
      setCurrentProductId(productId);
    }
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    if (search !== undefined) {
      setSearchQuery(search);
    }
    
    // Sync URL hash for admin
    if (page === 'admin') {
      window.location.hash = 'admin';
    } else if (window.location.hash === '#admin') {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen to hash changes (e.g. back button or direct #admin entry)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setCurrentPage('admin');
      } else if (currentPage === 'admin') {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // 6. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 7. Cart State (safely hydrated with current dynamic products)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hydrated = parsed
            .map((item: { product?: { id: string }; quantity?: number }) => {
              if (!item?.product?.id) return null;
              const fresh = storeData.products.find((p) => p.id === item.product!.id) || sampleProducts.find((p) => p.id === item.product!.id);
              if (!fresh) return null;
              return { product: fresh, quantity: Math.max(1, item.quantity || 1) };
            })
            .filter((item): item is CartItem => Boolean(item));
          if (hydrated.length > 0) return hydrated;
        }
      }
    } catch {
      // Ignore
    }
    // Default initial cart with 1 sample item
    const initialProd = storeData.products.find((p) => p.id === 'prod-3') || storeData.products[0] || sampleProducts[2];
    return initialProd ? [{ product: initialProd, quantity: 1 }] : [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // 8. Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const hydrated = parsed
            .map((item: { id?: string }) => {
              if (!item?.id) return null;
              return storeData.products.find((p) => p.id === item.id) || sampleProducts.find((p) => p.id === item.id) || null;
            })
            .filter((item): item is Product => Boolean(item));
          if (hydrated.length > 0) return hydrated;
        }
      }
    } catch {
      // Ignore
    }
    const defaultWish = [
      storeData.products.find((p) => p.id === 'prod-1') || storeData.products[0],
      storeData.products.find((p) => p.id === 'prod-6') || storeData.products[1]
    ].filter((p): p is Product => Boolean(p));
    return defaultWish.length > 0 ? defaultWish : [sampleProducts[0], sampleProducts[5]];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
    } catch {
      // Ignore
    }
  }, [wishlist]);

  // 9. Delivery zone & Coupon
  const [deliveryZone, setDeliveryZone] = useState<'inside-dhaka' | 'outside-dhaka'>('inside-dhaka');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // 10. Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // --- CRUD Operations for Products ---
  const addProduct = useCallback((productData: Omit<Product, 'id'> & { id?: string }): Product => {
    const id = productData.id && productData.id.trim()
      ? productData.id.trim()
      : `prod-${Date.now()}`;

    const newProduct: Product = {
      ...productData,
      id,
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      specsEn: productData.specsEn || { 'Warranty': '1 Year' },
      specsBn: productData.specsBn || { 'ওয়ারেন্টি': '১ বছর' },
    };

    setStoreData((prev) => ({
      ...prev,
      products: [newProduct, ...prev.products],
      categories: prev.categories.map((c) =>
        c.id === newProduct.category
          ? { ...c, itemCount: c.itemCount + 1 }
          : c
      ),
    }));

    addActivity(
      'Product Created', 
      `Added "${newProduct.nameEn}" (৳${newProduct.price}) in ${newProduct.category}`, 
      'create'
    );
    showToast(t.adminProductCreated, 'success');
    return newProduct;
  }, [addActivity, showToast, t.adminProductCreated]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setStoreData((prev) => {
      const oldProd = prev.products.find((p) => p.id === id);
      const updatedProducts = prev.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      
      // Update categories count if category changed
      let updatedCategories = prev.categories;
      if (oldProd && updates.category && updates.category !== oldProd.category) {
        updatedCategories = prev.categories.map((c) => {
          if (c.id === updates.category) return { ...c, itemCount: c.itemCount + 1 };
          if (c.id === oldProd.category) return { ...c, itemCount: Math.max(0, c.itemCount - 1) };
          return c;
        });
      }

      return {
        ...prev,
        products: updatedProducts,
        categories: updatedCategories,
      };
    });

    // Also update instances in Cart and Wishlist
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === id ? { ...item, product: { ...item.product, ...updates } } : item
      )
    );
    setWishlist((prevWishlist) =>
      prevWishlist.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    addActivity('Product Updated', `Updated fields for product ID: ${id}`, 'update');
    showToast(t.adminProductUpdated, 'success');
  }, [addActivity, showToast, t.adminProductUpdated]);

  const deleteProduct = useCallback((id: string) => {
    let deletedName = id;
    setStoreData((prev) => {
      const prod = prev.products.find((p) => p.id === id);
      if (prod) deletedName = prod.nameEn;
      const updatedProducts = prev.products.filter((p) => p.id !== id);

      const updatedCategories = prev.categories.map((c) => {
        if (prod && c.id === prod.category) {
          return { ...c, itemCount: Math.max(0, c.itemCount - 1) };
        }
        return c;
      });

      return {
        ...prev,
        products: updatedProducts,
        categories: updatedCategories,
      };
    });

    // CRITICAL: Safely remove deleted product from cart and wishlist!
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((item) => item.id !== id));

    // Close quickview if deleted
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }

    addActivity('Product Deleted', `Removed product "${deletedName}" (${id})`, 'delete');
    showToast(t.adminProductDeleted, 'info');
  }, [quickViewProduct, addActivity, showToast, t.adminProductDeleted]);

  // Storefront Settings Update
  const updateStorefrontSettings = useCallback((updates: Partial<StorefrontSettings>) => {
    setStoreData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
    addActivity('Storefront Settings Updated', `Modified: ${Object.keys(updates).join(', ')}`, 'update');
    showToast(t.adminSettingsSaved, 'success');
  }, [addActivity, showToast, t.adminSettingsSaved]);

  // Category Update
  const updateCategory = useCallback((id: CategoryId, updates: Partial<Category>) => {
    setStoreData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    addActivity('Category Updated', `Updated settings for category "${id}"`, 'update');
    showToast('Category updated successfully!', 'success');
  }, [addActivity, showToast]);

  // Export Backup
  const exportBackup = useCallback(() => {
    const backup: StoreBackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products: storeData.products,
      categories: storeData.categories,
      settings: storeData.settings,
      activityLog,
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auragadget-store-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addActivity('Backup Exported', 'Downloaded complete store JSON snapshot', 'system');
    showToast(t.adminBackupExported, 'success');
  }, [storeData, activityLog, addActivity, showToast, t.adminBackupExported]);

  // Import Backup
  const importBackup = useCallback((backupJson: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(backupJson);
      if (!parsed || !Array.isArray(parsed.products) || parsed.products.length === 0) {
        showToast(t.adminInvalidBackup, 'error');
        return { success: false, message: t.adminInvalidBackup };
      }

      setStoreData({
        version: parsed.version || 1,
        products: parsed.products,
        categories: Array.isArray(parsed.categories) ? parsed.categories : defaultCategories,
        settings: parsed.settings ? { ...defaultStorefrontSettings, ...parsed.settings } : defaultStorefrontSettings,
      });

      if (Array.isArray(parsed.activityLog)) {
        setActivityLog(parsed.activityLog);
        try {
          localStorage.setItem(STORAGE_KEY_ACTIVITY_LOG, JSON.stringify(parsed.activityLog));
        } catch {
          // Ignore
        }
      }

      addActivity(
        'Backup Imported', 
        `Restored ${parsed.products.length} products from imported backup`, 
        'system'
      );
      showToast(t.adminBackupImported, 'success');
      return { success: true, message: t.adminBackupImported };
    } catch {
      showToast(t.adminInvalidBackup, 'error');
      return { success: false, message: t.adminInvalidBackup };
    }
  }, [addActivity, showToast, t.adminBackupImported, t.adminInvalidBackup]);

  // Restore Demo Data
  const restoreDemoData = useCallback(() => {
    const pristineData = {
      version: 1,
      products: sampleProducts,
      categories: defaultCategories,
      settings: defaultStorefrontSettings,
    };
    setStoreData(pristineData);

    // Hydrate default cart & wishlist
    setCart([{ product: sampleProducts[2], quantity: 1 }]);
    setWishlist([sampleProducts[0], sampleProducts[5]]);

    addActivity('Demo Data Restored', 'Reset storefront to default 20 products and initial settings', 'system');
    showToast(t.adminDataRestored, 'success');
  }, [addActivity, showToast, t.adminDataRestored]);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
    showToast(
      language === 'bn'
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে`
        : `Added "${product.nameEn}" to your cart`,
      'success'
    );
  }, [language, showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast(
      language === 'bn' ? 'পণ্য কার্ট থেকে অপসারণ করা হয়েছে' : 'Item removed from cart',
      'info'
    );
  }, [language, showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  // Calculations
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

  // Delivery: Uses dynamic storefront settings
  const freeLimit = storefrontSettings.freeShippingThreshold || 2500;
  const dhakaFee = storefrontSettings.deliveryFeeDhaka || 70;
  const outsideFee = storefrontSettings.deliveryFeeOutside || 130;
  const baseDeliveryFee = deliveryZone === 'inside-dhaka' ? dhakaFee : outsideFee;
  const deliveryFee = (cartSubtotal >= freeLimit || appliedCoupon === 'FREESHIP' || cart.length === 0) ? 0 : baseDeliveryFee;

  let couponDiscount = 0;
  if (appliedCoupon === 'AURA10') {
    couponDiscount = Math.round(cartSubtotal * 0.1);
  }

  const cartFinalTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);

  const applyCoupon = useCallback((code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'AURA10') {
      setAppliedCoupon('AURA10');
      showToast(t.promoSuccess, 'success');
      return { success: true, message: t.promoSuccess };
    }
    if (cleaned === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      showToast(t.promoFreeShipSuccess, 'success');
      return { success: true, message: t.promoFreeShipSuccess };
    }
    showToast(t.promoInvalid, 'error');
    return { success: false, message: t.promoInvalid };
  }, [showToast, t.promoFreeShipSuccess, t.promoInvalid, t.promoSuccess]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Wishlist operations
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(
        language === 'bn' ? `"${product.nameBn}" উইশলিস্ট থেকে সরানো হয়েছে` : `Removed "${product.nameEn}" from wishlist`,
        'info'
      );
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(
        language === 'bn' ? `"${product.nameBn}" উইশলিস্টে যুক্ত হয়েছে` : `Added "${product.nameEn}" to your wishlist`,
        'success'
      );
    }
  }, [isInWishlist, language, showToast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const addAllWishlistToCart = useCallback(() => {
    if (wishlist.length === 0) return;
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
    showToast(
      language === 'bn' ? 'উইশলিস্টের সকল পণ্য কার্টে যোগ করা হয়েছে' : 'All wishlist items added to cart',
      'success'
    );
  }, [addToCart, showToast, wishlist]);

  // Quick View & Modals
  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);
  const openCheckout = useCallback(() => setIsCheckoutOpen(true), []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatPrice,
        currentPage,
        currentProductId,
        selectedCategory,
        searchQuery,
        setSearchQuery,
        navigateTo,
        products,
        categories,
        storefrontSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStorefrontSettings,
        updateCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCartItems,
        cartSubtotal,
        deliveryZone,
        setDeliveryZone,
        deliveryFee,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        cartFinalTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        addAllWishlistToCart,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        toasts,
        showToast,
        removeToast,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        activityLog,
        exportBackup,
        importBackup,
        restoreDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
