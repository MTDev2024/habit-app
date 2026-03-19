import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getApps } from 'firebase/app';

/**
 * Retourne l'instance Analytics si disponible (web + navigateur).
 * Sur certains environnements (Expo Go, simulateur natif) Analytics n'est pas supporté.
 * Silencieux en cas d'erreur — analytics est non critique.
 */
async function getAnalyticsInstance() {
  try {
    const supported = await isSupported();
    if (!supported) return null;
    return getAnalytics(getApps()[0]);
  } catch {
    return null;
  }
}

/**
 * Événement : une habitude a été complétée (cochée).
 * Ne se déclenche pas lors d'un décoché.
 */
export async function logHabitCompleted(habitName: string, category: string): Promise<void> {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'habit_completed', { habit_name: habitName, category });
}

/**
 * Événement : une nouvelle habitude a été créée.
 */
export async function logHabitCreated(habitName: string, category: string): Promise<void> {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'habit_created', { habit_name: habitName, category });
}

/**
 * Événement : un palier de streak atteint (7j, 30j ou 100j).
 * Ne se déclenche que sur les valeurs exactes pour éviter le spam.
 */
export async function logStreakMilestone(habitName: string, streak: number): Promise<void> {
  const milestones = [7, 30, 100];
  if (!milestones.includes(streak)) return;
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, 'streak_milestone', { habit_name: habitName, streak_days: streak });
}
