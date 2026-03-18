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
 * Calcule le streak actuel d'une habitude (jours consécutifs jusqu'à aujourd'hui).
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
