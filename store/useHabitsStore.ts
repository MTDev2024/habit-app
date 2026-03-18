import { create } from 'zustand';
import { CategoryKey } from '../constants/categories';
import { CATEGORY_COLORS } from '../constants/app';
import { getTodayKey } from '../utils/dateUtils';

// ── Type d'une habitude ──────────────────────────────────────────────────────
export interface Habit {
  id: string;
  name: string;
  category: CategoryKey;
  color: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // liste de dates YYYY-MM-DD
  isPremiumFeature: boolean;
  createdAt: number; // timestamp ms
}

// ── Actions et sélecteurs du store ──────────────────────────────────────────
interface HabitsState {
  habits: Habit[];

  // Ajouter une nouvelle habitude
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;

  // Supprimer une habitude par id
  removeHabit: (id: string) => void;

  // Cocher / décocher une habitude pour la date du jour
  toggleHabit: (id: string) => void;

  // Retourner les habitudes du jour (quotidiennes)
  getTodayHabits: () => Habit[];

  // Retourner le taux de complétion du jour (0 à 1)
  getTodayCompletionRate: () => number;
}

// ── Données d'exemple issues de la liste des 50 habitudes (CLAUDE.md) ────────
const SAMPLE_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Boire de l\'eau',
    category: 'health',
    color: CATEGORY_COLORS.health,
    frequency: 'daily',
    completedDates: [],
    isPremiumFeature: false,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Méditation',
    category: 'health',
    color: CATEGORY_COLORS.health,
    frequency: 'daily',
    completedDates: [],
    isPremiumFeature: false,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Lire 20 min',
    category: 'personal',
    color: CATEGORY_COLORS.personal,
    frequency: 'daily',
    completedDates: [],
    isPremiumFeature: false,
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Sport 20 min',
    category: 'health',
    color: CATEGORY_COLORS.health,
    frequency: 'daily',
    completedDates: [],
    isPremiumFeature: false,
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Planifier sa journée',
    category: 'productivity',
    color: CATEGORY_COLORS.productivity,
    frequency: 'daily',
    completedDates: [],
    isPremiumFeature: false,
    createdAt: Date.now(),
  },
];

// ── Store Zustand ────────────────────────────────────────────────────────────
/**
 * Store principal des habitudes.
 *
 * Phase 2 : données locales uniquement (pas de Firebase).
 * Phase 3 : on ajoutera la persistance Firestore et la sync multi-appareils.
 *
 * Utilisation dans un composant :
 *   const { habits, toggleHabit, getTodayCompletionRate } = useHabitsStore();
 */
export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: SAMPLE_HABITS,

  addHabit: (habit) =>
    set((state) => ({
      habits: [
        ...state.habits,
        {
          ...habit,
          id: String(Date.now()),
          createdAt: Date.now(),
        },
      ],
    })),

  removeHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),

  toggleHabit: (id) => {
    const today = getTodayKey();
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h.id !== id) return h;
        const already = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: already
            ? h.completedDates.filter((d) => d !== today) // décocher
            : [...h.completedDates, today],               // cocher
        };
      }),
    }));
  },

  getTodayHabits: () =>
    get().habits.filter((h) => h.frequency === 'daily'),

  getTodayCompletionRate: () => {
    const daily = get().getTodayHabits();
    if (daily.length === 0) return 0;
    const today = getTodayKey();
    const done = daily.filter((h) => h.completedDates.includes(today)).length;
    return done / daily.length;
  },
}));
