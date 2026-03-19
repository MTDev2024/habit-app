/**
 * Formate une date pour l'affichage selon la langue active.
 *   Français → DD-MM-YYYY  (ex : 18-03-2026)
 *   Anglais  → YYYY-MM-DD  (ex : 2026-03-18)
 *
 * Le paramètre `lang` vient de `i18n.language` (react-i18next).
 * Le stockage interne utilise toujours YYYY-MM-DD via getTodayKey().
 */
export const formatDisplayDate = (date: Date = new Date(), lang: string = 'fr'): string => {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();

  if (lang.startsWith('en')) {
    return `${y}-${m}-${d}`;
  }
  // Français et toute autre langue → DD-MM-YYYY
  return `${d}-${m}-${y}`;
};

/**
 * Retourne la date du jour au format YYYY-MM-DD.
 * Ce format est utilisé comme clé dans completedDates des habitudes.
 */
export const getTodayKey = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Vérifie si une habitude est complétée aujourd'hui.
 */
export const isCompletedToday = (completedDates: string[]): boolean => {
  return completedDates.includes(getTodayKey());
};

/**
 * Calcule le streak actuel d'une habitude quotidienne (jours consécutifs).
 */
export const getCurrentStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse(); // du plus récent au plus ancien
  const today = getTodayKey();

  let streak = 0;
  let current = new Date(today);

  for (const date of sorted) {
    const expected = current.toISOString().split('T')[0];
    if (date === expected) {
      streak++;
      // On recule d'un jour pour le prochain test
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calcule le streak actuel d'une habitude hebdomadaire.
 *
 * Logique : on génère toutes les occurrences prévues dans le passé
 * (dates où le jour de la semaine est dans weekDays), puis on remonte
 * depuis la plus récente en comptant les occurrences consécutives complétées.
 *
 * Le streak ne casse pas si aujourd'hui n'est pas un jour prévu.
 *
 * @param completedDates - Liste de dates YYYY-MM-DD où l'habitude a été faite
 * @param weekDays - Jours actifs (0=lundi, 6=dimanche, convention EU)
 */
export const getCurrentStreakWeekly = (
  completedDates: string[],
  weekDays: number[]
): number => {
  if (completedDates.length === 0 || weekDays.length === 0) return 0;

  const completedSet = new Set(completedDates);

  // Génère toutes les occurrences prévues des 365 derniers jours (limite raisonnable)
  const scheduled: string[] = [];
  // Midi local évite les ambiguïtés de fuseau horaire et DST
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const jsDay = cursor.getDay(); // 0=dim, 1=lun, ...
    const dayEU = jsDay === 0 ? 6 : jsDay - 1; // 0=lun, 6=dim

    if (weekDays.includes(dayEU)) {
      // Utilise les méthodes locales (pas toISOString) pour éviter le décalage UTC
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, '0');
      const d = String(cursor.getDate()).padStart(2, '0');
      scheduled.push(`${y}-${m}-${d}`);
    }

    cursor.setDate(cursor.getDate() - 1);
  }

  // scheduled est déjà trié du plus récent au plus ancien
  // On compte les occurrences consécutives complétées depuis la plus récente
  let streak = 0;
  for (const date of scheduled) {
    if (completedSet.has(date)) {
      streak++;
    } else {
      break; // première occurrence ratée → on arrête
    }
  }

  return streak;
};
