import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Floating Toast Container */}
      <div className="fixed top-20 right-5 z-[100] space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-md border shadow-xl transition-all duration-300 transform translate-y-0 font-mono text-xs ${
              toast.type === 'error'
                ? 'bg-rust/95 text-white border-rust'
                : toast.type === 'info'
                ? 'bg-navy/95 text-paper border-navy'
                : 'bg-teal-deep/95 text-paper border-teal'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-gold flex-none" />
              ) : (
                <CheckCircle className="w-4 h-4 text-gold flex-none" />
              )}
              <span className="font-semibold">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-paper/70 hover:text-paper"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
