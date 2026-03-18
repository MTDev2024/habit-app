import { useState, useEffect } from 'react';

// Créneaux horaires de la journée
export type TimeSlot =
  | 'night'       // 00h–05h
  | 'dawn'        // 05h–08h
  | 'morning'     // 08h–12h
  | 'noon'        // 12h–15h
  | 'afternoon'   // 15h–18h
  | 'evening'     // 18h–21h
  | 'lateEvening'; // 21h–00h

// Saisons (hémisphère nord, dates du CLAUDE.md)
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

// Objet retourné par le hook
export interface TimeAndSeason {
  timeSlot: TimeSlot;
  season: Season;
  // Identifiant unique pour les 28 combinaisons (ex: "morning_spring")
  landscapeKey: `${TimeSlot}_${Season}`;
  hour: number;
}

/**
 * Détermine la saison à partir de la date fournie (hémisphère nord).
 * Les dates sont celles spécifiées dans CLAUDE.md.
 */
const getSeason = (date: Date): Season => {
  const month = date.getMonth() + 1; // 1–12
  const day = date.getDate();

  // Hiver : 21 déc → 20 mars
  if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day <= 20)) {
    return 'winter';
  }
  // Printemps : 21 mars → 20 juin
  if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
    return 'spring';
  }
  // Été : 21 juin → 22 sept
  if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day <= 22)) {
    return 'summer';
  }
  // Automne : 23 sept → 20 déc
  return 'autumn';
};

/**
 * Détermine le créneau horaire à partir de l'heure.
 */
const getTimeSlot = (hour: number): TimeSlot => {
  if (hour >= 0 && hour < 5) return 'night';
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 15) return 'noon';
  if (hour >= 15 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 21) return 'evening';
  return 'lateEvening';
};

/**
 * Hook principal pour le header paysage dynamique.
 *
 * Retourne l'heure, la saison, le créneau et un `landscapeKey` unique
 * parmi les 28 combinaisons possibles (7 créneaux × 4 saisons).
 *
 * Se met à jour automatiquement toutes les minutes.
 */
export const useTimeAndSeason = (): TimeAndSeason => {
  const getState = (): TimeAndSeason => {
    const now = new Date();
    const hour = now.getHours();
    const timeSlot = getTimeSlot(hour);
    const season = getSeason(now);
    return {
      timeSlot,
      season,
      landscapeKey: `${timeSlot}_${season}`,
      hour,
    };
  };

  const [state, setState] = useState<TimeAndSeason>(getState);

  useEffect(() => {
    // Mise à jour toutes les 60 secondes
    const interval = setInterval(() => {
      setState(getState());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return state;
};
