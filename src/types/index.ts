export type Language = 'en' | 'bn';

export type CategoryId = 'watches' | 'audio' | 'charging' | 'mobile-accessories' | 'computer-accessories';

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  category: CategoryId;
  descriptionEn: string;
  descriptionBn: string;
  price: number; // in BDT
  discountPrice?: number; // in BDT
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
  specsEn: { [key: string]: string };
  specsBn: { [key: string]: string };
  tags?: string[];
  isNewArrival?: boolean;
}

export interface Category {
  id: CategoryId;
  nameEn: string;
  nameBn: string;
  iconName: string;
  image: string;
  descriptionEn: string;
  descriptionBn: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export type Page = 'home' | 'shop' | 'product-details' | 'cart' | 'wishlist' | 'about' | 'contact' | '404' | 'admin';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'name-asc' | 'name-desc';

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or CategoryId
  minPrice: number;
  maxPrice: number;
  sortBy: SortOption;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

export interface StorefrontSettings {
  storeNameEn: string;
  storeNameBn: string;
  taglineEn: string;
  taglineBn: string;
  logoUrl?: string;
  announcementEn: string;
  announcementBn: string;
  hotline: string;
  email: string;
  addressEn: string;
  addressBn: string;
  hoursEn: string;
  hoursBn: string;
  // Hero CMS
  heroBadgeEn: string;
  heroBadgeBn: string;
  heroTitleEn: string;
  heroTitleBn: string;
  heroSubtitleEn: string;
  heroSubtitleBn: string;
  heroImageUrl: string;
  heroCtaTextEn: string;
  heroCtaTextBn: string;
  heroCtaDestination: string;
  // Section Headings
  featuredTitleEn: string;
  featuredTitleBn: string;
  featuredSubtitleEn: string;
  featuredSubtitleBn: string;
  dealsTitleEn: string;
  dealsTitleBn: string;
  dealsSubtitleEn: string;
  dealsSubtitleBn: string;
  // About Content
  aboutStoryTitleEn: string;
  aboutStoryTitleBn: string;
  aboutStoryP1En: string;
  aboutStoryP1Bn: string;
  aboutStoryP2En: string;
  aboutStoryP2Bn: string;
  // Shipping & Rates
  freeShippingThreshold: number;
  deliveryFeeDhaka: number;
  deliveryFeeOutside: number;
  // Social & Footer
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  footerDisclaimerEn: string;
  footerDisclaimerBn: string;

  // Payment Methods & Gateway Configuration
  paymentCodEnabled: boolean;
  paymentBkashEnabled: boolean;
  paymentNagadEnabled: boolean;
  paymentBkashNumber: string;
  paymentNagadNumber: string;
  paymentBkashInstructionsEn: string;
  paymentBkashInstructionsBn: string;
  paymentNagadInstructionsEn: string;
  paymentNagadInstructionsBn: string;
  paymentRequireTrxId: boolean;
  paymentDemoMode: 'manual' | 'gateway_placeholder';
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export interface AdminActivity {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'system';
}

export interface StoreBackupData {
  version: number;
  exportedAt: string;
  products: Product[];
  categories: Category[];
  settings: StorefrontSettings;
  activityLog?: AdminActivity[];
}
