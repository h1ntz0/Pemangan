import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none no-print">
      {toasts.map(t => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        };

        const bgBorders = {
          success: 'bg-emerald-50/95 border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
          warning: 'bg-amber-50/95 border-amber-200 dark:bg-amber-950/90 dark:border-amber-800 text-amber-900 dark:text-amber-100',
          error: 'bg-rose-50/95 border-rose-200 dark:bg-rose-950/90 dark:border-rose-800 text-rose-900 dark:text-rose-100',
          info: 'bg-blue-50/95 border-blue-200 dark:bg-blue-950/90 dark:border-blue-800 text-blue-900 dark:text-blue-100'
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bgBorders[t.type]}`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{t.title}</h4>
              {t.message && <p className="text-xs mt-0.5 opacity-90">{t.message}</p>}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
