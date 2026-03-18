import { create } from 'zustand';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  // Démarre l'écoute Firebase Auth (appelé une seule fois au montage de l'app)
  init: () => () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  init: () => {
    // onAuthChange retourne la fonction de désabonnement Firebase
    const unsubscribe = onAuthChange((user) => {
      set({ user, isLoading: false });
    });
    return unsubscribe;
  },

  setUser: (user) => set({ user }),
}));
