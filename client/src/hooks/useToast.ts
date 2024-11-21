import { useState, useCallback } from 'react';
import { ToastType } from '../components/Toast';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(current => [...current, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}