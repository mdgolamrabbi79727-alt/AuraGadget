import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, navigateTo } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-16 shadow-xs space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 font-mono">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.notFoundTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {t.notFoundSubtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.notFoundHomeBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.notFoundShopBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
