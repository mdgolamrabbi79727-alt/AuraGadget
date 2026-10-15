/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminPage } from './pages/admin/AdminPage';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  // If on Admin page, keep admin UI separate from public storefront shell
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
        <AdminPage />
        <ToastContainer />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product-details':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case '404':
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />

      {/* Global Modals & Notifications */}
      <QuickViewModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
