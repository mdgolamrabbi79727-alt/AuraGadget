import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 text-white';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;

        if (toast.type === 'error') {
          bgColor = 'bg-rose-950 text-rose-50 border border-rose-800';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'info') {
          bgColor = 'bg-slate-900 text-white border border-slate-700';
          icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl transition-all animate-in slide-in-from-bottom-3 duration-200 ${bgColor}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
