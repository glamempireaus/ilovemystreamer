import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  isDark?: boolean;
}

export default function Toast({ message, type, onClose, isDark }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    const baseStyles = `
      fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg
      transform transition-all duration-300 ease-in-out
    `;

    if (type === 'success') {
      return isDark
        ? `${baseStyles} bg-green-900/80 text-green-100 border border-green-700`
        : `${baseStyles} bg-green-100 text-green-800 border border-green-200`;
    }

    return isDark
      ? `${baseStyles} bg-red-900/80 text-red-100 border border-red-700`
      : `${baseStyles} bg-red-100 text-red-800 border border-red-200`;
  };

  return (
    <div className={getStyles()}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}