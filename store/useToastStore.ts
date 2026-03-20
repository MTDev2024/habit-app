import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

/**
 * Store léger pour les toasts (notifications contextuelles).
 * Utilisé dans Toast.tsx — affiché en superposition dans le layout tabs.
 */
export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'success',
  visible: false,

  show: (message, type = 'success') => {
    set({ message, type, visible: true });
    // Disparition automatique après 2,5 secondes
    setTimeout(() => set({ visible: false }), 2500);
  },

  hide: () => set({ visible: false }),
}));
