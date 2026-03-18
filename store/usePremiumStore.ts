import { create } from 'zustand';

// Nombre maximum d'habitudes pour un compte gratuit
export const FREE_HABIT_LIMIT = 6;

interface PremiumState {
  isPremium: boolean;

  // Phase 5 : cette action sera appelée après un achat Google Play Billing validé
  setPremium: (value: boolean) => void;
}

/**
 * Store du statut premium de l'utilisateur.
 *
 * Phase 2 : flag local à false par défaut (mode gratuit simulé).
 * Phase 5 : setPremium() sera appelé après validation de l'achat
 *           via Google Play Billing et confirmation Firestore.
 *
 * Toutes les vérifications de features premium dans l'app
 * passent par ce store — jamais de vérification en dur dans les composants.
 *
 * Utilisation :
 *   const { isPremium } = usePremiumStore();
 *   if (!isPremium && habits.length >= FREE_HABIT_LIMIT) { // afficher paywall }
 */
export const usePremiumStore = create<PremiumState>((set) => ({
  isPremium: false,
  setPremium: (value) => set({ isPremium: value }),
}));
