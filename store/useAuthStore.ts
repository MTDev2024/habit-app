import { create } from 'zustand';
import { User } from 'firebase/auth';
import { onAuthChange, updateUserDisplayName } from '../services/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  // Démarre l'écoute Firebase Auth (appelé une seule fois au montage de l'app)
  init: () => () => void;
  setUser: (user: User | null) => void;
  // Met à jour le prénom Firebase et force un re-render dans le store
  updateDisplayName: (displayName: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

  updateDisplayName: async (displayName: string) => {
    const { user } = get();
    if (!user) return;
    await updateUserDisplayName(displayName);
    // updateProfile modifie auth.currentUser en place — même référence objet.
    // On crée un nouvel objet qui hérite du prototype Firebase (méthodes préservées)
    // pour que Zustand détecte le changement et déclenche un re-render.
    const updated = Object.create(Object.getPrototypeOf(user)) as User;
    Object.assign(updated, user, { displayName });
    set({ user: updated });
  },
}));
