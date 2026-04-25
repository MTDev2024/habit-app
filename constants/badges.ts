export interface BadgeDefinition {
  id: string;
  emoji: string;
  streakThreshold: number; // nombre de jours consécutifs requis
  labelFr: string;
  labelEn: string;
  descriptionFr: string;
  descriptionEn: string;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'streak-7',
    emoji: '🔥',
    streakThreshold: 7,
    labelFr: '7 jours de feu',
    labelEn: '7-day streak',
    descriptionFr: 'Tu as maintenu une habitude 7 jours de suite !',
    descriptionEn: 'You kept a habit for 7 days in a row!',
  },
  {
    id: 'streak-30',
    emoji: '⚡',
    streakThreshold: 30,
    labelFr: 'Un mois inarrêtable',
    labelEn: 'Unstoppable month',
    descriptionFr: '30 jours consécutifs. Tu es inarrêtable !',
    descriptionEn: '30 days in a row. You\'re unstoppable!',
  },
  {
    id: 'streak-100',
    emoji: '🏆',
    streakThreshold: 100,
    labelFr: 'Centenaire',
    labelEn: 'Centurion',
    descriptionFr: '100 jours consécutifs. Tu es une légende !',
    descriptionEn: '100 days in a row. You\'re a legend!',
  },
];

// Retourne le badge correspondant à un palier de streak, ou null
export function getBadgeForStreak(streak: number): BadgeDefinition | null {
  return BADGES.find((b) => b.streakThreshold === streak) ?? null;
}
