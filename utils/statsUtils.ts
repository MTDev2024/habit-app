import { Habit } from '../store/useHabitsStore';

// ── Types ────────────────────────────────────────────────────────────────────

export interface DayStats {
  date: string;   // YYYY-MM-DD
  done: number;
  total: number;
  rate: number;   // 0–1
}

// ── Helpers de date ──────────────────────────────────────────────────────────

/**
 * Retourne les 7 dernières clés de date (aujourd'hui inclus), du plus ancien au plus récent.
 */
export const getLast7DaysKeys = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

/**
 * Retourne toutes les clés de date du mois en cours.
 */
export const getCurrentMonthKeys = (): string[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const keys: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    keys.push(dateStr);
  }
  return keys;
};

/**
 * Retourne le jour de la semaine d'une date (0 = lundi, 6 = dimanche).
 * Convention européenne : semaine commence le lundi.
 */
export const getWeekdayEU = (dateKey: string): number => {
  const day = new Date(dateKey).getDay(); // 0=dim, 1=lun, ...
  return day === 0 ? 6 : day - 1;         // → 0=lun, ..., 6=dim
};

// ── Calculs de stats ─────────────────────────────────────────────────────────

/**
 * Taux de complétion pour chacun des 7 derniers jours.
 */
export const getLast7DaysStats = (habits: Habit[]): DayStats[] => {
  const daily = habits.filter((h) => h.frequency === 'daily');
  return getLast7DaysKeys().map((date) => {
    const done = daily.filter((h) => h.completedDates.includes(date)).length;
    const total = daily.length;
    return { date, done, total, rate: total === 0 ? 0 : done / total };
  });
};

/**
 * Taux de complétion pour chaque jour du mois en cours.
 * Retourne un Map date → rate (0–1).
 */
export const getMonthCompletionMap = (habits: Habit[]): Map<string, number> => {
  const daily = habits.filter((h) => h.frequency === 'daily');
  const map = new Map<string, number>();
  for (const date of getCurrentMonthKeys()) {
    const done = daily.filter((h) => h.completedDates.includes(date)).length;
    const total = daily.length;
    map.set(date, total === 0 ? 0 : done / total);
  }
  return map;
};

/**
 * Label de jour abrégé selon la langue (semaine commence lundi).
 */
export const getDayLabel = (dateKey: string, lang: string): string => {
  const fr = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  const en = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const labels = lang.startsWith('en') ? en : fr;
  return labels[getWeekdayEU(dateKey)];
};
