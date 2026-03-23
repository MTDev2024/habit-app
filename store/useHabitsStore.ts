import { create } from 'zustand';
import { CategoryKey } from '../constants/categories';
import { getTodayKey, getCurrentStreak, getCurrentStreakWeekly } from '../utils/dateUtils';
import {
  fetchHabits,
  saveHabit,
  patchHabit,
  deleteHabit,
} from '../services/habits';
import {
  logHabitCompleted,
  logHabitCreated,
  logStreakMilestone,
} from '../services/analytics';

// ── Type d'une habitude ──────────────────────────────────────────────────────
export interface Habit {
  id: string;
  name: string;
  category: CategoryKey;
  color: string;
  frequency: 'daily' | 'weekly';
  // Jours actifs pour les habitudes hebdomadaires (0=lundi, 6=dimanche, convention EU)
  weekDays?: number[];
  completedDates: string[]; // liste de dates YYYY-MM-DD
  isPremiumFeature: boolean;
  createdAt: number; // timestamp ms
  // Champs optionnels ajoutés Phase 2b
  description?: string;       // note libre sur l'habitude
  reminderTime?: string;      // format "HH:MM" — utilisé en Phase 4 (notifications)
}

// ── Actions et sélecteurs du store ──────────────────────────────────────────
interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  // userId courant — nécessaire pour écrire dans Firestore sans passer par useAuthStore
  userId: string | null;

  // Charge les habitudes depuis Firestore au login
  loadHabits: (userId: string) => Promise<void>;

  // Réinitialise le store à la déconnexion
  clearHabits: () => void;

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  updateHabit: (id: string, changes: Partial<Omit<Habit, 'id' | 'createdAt' | 'completedDates'>>) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;

  resetHabitHistory: (id: string) => Promise<void>;

  getTodayHabits: () => Habit[];
  getTodayCompletionRate: () => number;
}

// ── Store Zustand ────────────────────────────────────────────────────────────
export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  userId: null,

  /**
   * Appelé juste après la connexion Firebase.
   * Récupère les habitudes Firestore et les charge dans le store local.
   */
  loadHabits: async (userId: string) => {
    set({ isLoading: true, userId });
    try {
      const habits = await fetchHabits(userId);
      set({ habits });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Vide le store à la déconnexion — évite que les données
   * d'un utilisateur soient visibles après logout.
   */
  clearHabits: () => set({ habits: [], userId: null }),

  addHabit: async (habit) => {
    const { userId } = get();
    const newHabit: Habit = {
      ...habit,
      id: String(Date.now()),
      createdAt: Date.now(),
    };
    // Mise à jour optimiste : l'UI réagit immédiatement
    set((state) => ({ habits: [...state.habits, newHabit] }));
    // Persistance Firestore + analytics en arrière-plan
    if (userId) await saveHabit(userId, newHabit);
    logHabitCreated(newHabit.name, newHabit.category);
  },

  removeHabit: async (id) => {
    const { userId } = get();
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    if (userId) await deleteHabit(userId, id);
  },

  updateHabit: async (id, changes) => {
    const { userId } = get();
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...changes } : h
      ),
    }));
    if (userId) await patchHabit(userId, id, changes);
  },

  toggleHabit: async (id) => {
    const today = getTodayKey();
    const { userId } = get();

    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;

    const already = habit.completedDates.includes(today);
    const newDates = already
      ? habit.completedDates.filter((d) => d !== today)
      : [...habit.completedDates, today];

    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, completedDates: newDates } : h
      ),
    }));

    if (userId) await patchHabit(userId, id, { completedDates: newDates });

    // Analytics uniquement à la complétion (pas au décoché)
    if (!already) {
      logHabitCompleted(habit.name, habit.category);
      const streak = habit.frequency === 'weekly'
        ? getCurrentStreakWeekly(newDates, habit.weekDays ?? [])
        : getCurrentStreak(newDates);
      logStreakMilestone(habit.name, streak);
    }
  },

  resetHabitHistory: async (id) => {
    const { userId } = get();
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, completedDates: [] } : h
      ),
    }));
    if (userId) await patchHabit(userId, id, { completedDates: [] });
  },

  getTodayHabits: () => {
    // Jour de la semaine courant en convention EU (0=lundi, 6=dimanche)
    const jsDay = new Date().getDay(); // 0=dim, 1=lun, ...
    const todayEU = jsDay === 0 ? 6 : jsDay - 1;

    return get().habits.filter((h) => {
      if (h.frequency === 'daily') return true;
      if (h.frequency === 'weekly') return (h.weekDays ?? []).includes(todayEU);
      return false;
    });
  },

  getTodayCompletionRate: () => {
    const daily = get().getTodayHabits();
    if (daily.length === 0) return 0;
    const today = getTodayKey();
    const done = daily.filter((h) => h.completedDates.includes(today)).length;
    return done / daily.length;
  },
}));
