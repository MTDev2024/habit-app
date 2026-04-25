import { create } from 'zustand';
import { BadgeDefinition, getBadgeForStreak } from '../constants/badges';
import { addEarnedBadge } from '../services/user';

interface BadgesState {
  // IDs des badges déjà gagnés par l'utilisateur
  earnedBadgeIds: string[];
  // Badge en attente d'affichage (null = rien à afficher)
  pendingBadge: BadgeDefinition | null;

  // Initialise les badges au login depuis le profil Firestore
  loadEarnedBadges: (badgeIds: string[]) => void;

  // Vérifie si un streak débloque un nouveau badge et le sauvegarde
  checkAndUnlock: (streak: number, userId: string) => Promise<void>;

  // Appelé quand l'utilisateur ferme la modale
  clearPendingBadge: () => void;

  // Réinitialise le store à la déconnexion
  clearBadges: () => void;
}

export const useBadgesStore = create<BadgesState>((set, get) => ({
  earnedBadgeIds: [],
  pendingBadge: null,

  loadEarnedBadges: (badgeIds) => {
    set({ earnedBadgeIds: badgeIds });
  },

  checkAndUnlock: async (streak, userId) => {
    const badge = getBadgeForStreak(streak);
    if (!badge) return;

    // Badge déjà gagné → ne rien faire
    if (get().earnedBadgeIds.includes(badge.id)) return;

    // Nouveau badge — mise à jour locale immédiate puis persistance Firestore
    set((state) => ({
      earnedBadgeIds: [...state.earnedBadgeIds, badge.id],
      pendingBadge: badge,
    }));

    await addEarnedBadge(userId, badge.id).catch(() => {});
  },

  clearPendingBadge: () => set({ pendingBadge: null }),

  clearBadges: () => set({ earnedBadgeIds: [], pendingBadge: null }),
}));
