import { CategoryKey } from './categories';

export interface SuggestedHabit {
  id: string;
  emoji: string;
  fr: string;
  en: string;
  category: CategoryKey;
}

export const SUGGESTED_HABITS: SuggestedHabit[] = [
  // ── Santé & Bien-être ─────────────────────────────────────────────────────
  { id: 'drink-water',    emoji: '💧', fr: 'Boire de l\'eau',          en: 'Drink water',            category: 'health' },
  { id: 'medication',     emoji: '💊', fr: 'Prendre ses médicaments',   en: 'Take medication',         category: 'health' },
  { id: 'walk-10k',       emoji: '🚶', fr: 'Marcher 10 000 pas',        en: 'Walk 10,000 steps',       category: 'health' },
  { id: 'exercise',       emoji: '🏃', fr: 'Sport 20 min',              en: 'Exercise 20 min',         category: 'health' },
  { id: 'meditation',     emoji: '🧘', fr: 'Méditation',                en: 'Meditation',              category: 'health' },
  { id: 'stretching',     emoji: '🤸', fr: 'Étirements',                en: 'Stretching',              category: 'health' },
  { id: 'sleep-schedule', emoji: '😴', fr: 'Dormir à heure fixe',       en: 'Sleep on schedule',       category: 'health' },
  { id: 'breakfast',      emoji: '🥗', fr: 'Petit-déjeuner équilibré',  en: 'Balanced breakfast',      category: 'health' },
  { id: 'stairs',         emoji: '🪜', fr: 'Prendre l\'escalier',       en: 'Take the stairs',         category: 'health' },
  { id: 'limit-sugar',    emoji: '🍬', fr: 'Limiter le sucre',          en: 'Limit sugar',             category: 'health' },
  { id: 'brush-teeth',    emoji: '🦷', fr: 'Se brosser les dents',      en: 'Brush teeth',             category: 'health' },
  { id: 'relaxing-bath',  emoji: '🛁', fr: 'Bain relaxant',             en: 'Relaxing bath',           category: 'health' },

  // ── Développement personnel ───────────────────────────────────────────────
  { id: 'read-20min',     emoji: '📚', fr: 'Lire 20 min',               en: 'Read 20 min',             category: 'personal' },
  { id: 'journal',        emoji: '📓', fr: 'Journal intime',            en: 'Personal journal',        category: 'personal' },
  { id: 'gratitude',      emoji: '🙏', fr: 'Gratitude (3 choses)',      en: 'Gratitude (3 things)',    category: 'personal' },
  { id: 'language',       emoji: '🌍', fr: 'Apprendre une langue',      en: 'Learn a language',        category: 'personal' },
  { id: 'review-goals',   emoji: '🎯', fr: 'Réviser ses objectifs',     en: 'Review goals',            category: 'personal' },
  { id: 'edu-video',      emoji: '🎥', fr: 'Vidéo éducative',           en: 'Educational video',       category: 'personal' },
  { id: 'podcast',        emoji: '🎙️', fr: 'Écouter un podcast',        en: 'Listen to a podcast',     category: 'personal' },
  { id: 'online-course',  emoji: '💻', fr: 'Formation en ligne',        en: 'Online course',           category: 'personal' },
  { id: 'plan-day',       emoji: '📋', fr: 'Planifier sa journée',      en: 'Plan your day',           category: 'personal' },
  { id: 'evening-review', emoji: '🌙', fr: 'Réflexion du soir',         en: 'Evening reflection',      category: 'personal' },
  { id: 'take-notes',     emoji: '📝', fr: 'Prendre des notes',         en: 'Take notes',              category: 'personal' },
  { id: 'follow-news',    emoji: '📰', fr: 'Suivre l\'actualité',       en: 'Follow the news',         category: 'personal' },

  // ── Loisirs & Créativité ──────────────────────────────────────────────────
  { id: 'guitar',         emoji: '🎸', fr: 'Jouer de la guitare',       en: 'Play guitar',             category: 'leisure' },
  { id: 'draw',           emoji: '✏️', fr: 'Dessiner',                  en: 'Draw',                    category: 'leisure' },
  { id: 'write-article',  emoji: '✍️', fr: 'Écrire un article',         en: 'Write an article',        category: 'leisure' },
  { id: 'code-project',   emoji: '🖥️', fr: 'Coder un projet perso',     en: 'Code a side project',     category: 'leisure' },
  { id: 'photo',          emoji: '📷', fr: 'Prendre une photo',         en: 'Take a photo',            category: 'leisure' },
  { id: 'gardening',      emoji: '🌱', fr: 'Jardinage',                 en: 'Gardening',               category: 'leisure' },
  { id: 'diy',            emoji: '🔧', fr: 'DIY',                       en: 'DIY',                     category: 'leisure' },
  { id: 'music',          emoji: '🎵', fr: 'Écouter de la musique',     en: 'Listen to music',         category: 'leisure' },
  { id: 'new-hobby',      emoji: '🎨', fr: 'Essayer un nouveau loisir', en: 'Try a new hobby',         category: 'leisure' },
  { id: 'read-novel',     emoji: '📖', fr: 'Lire un roman',             en: 'Read a novel',            category: 'leisure' },

  // ── Productivité & Organisation ───────────────────────────────────────────
  { id: 'sort-emails',    emoji: '📧', fr: 'Trier ses emails',          en: 'Sort emails',             category: 'productivity' },
  { id: 'tidy-space',     emoji: '🧹', fr: 'Ranger son espace',         en: 'Tidy up space',           category: 'productivity' },
  { id: 'meal-prep',      emoji: '🍱', fr: 'Préparer ses repas',        en: 'Meal prep',               category: 'productivity' },
  { id: 'todo-list',      emoji: '✅', fr: 'Faire sa liste de tâches',  en: 'Make a to-do list',       category: 'productivity' },
  { id: 'sort-clothes',   emoji: '👕', fr: 'Trier ses vêtements',       en: 'Sort clothes',            category: 'productivity' },
  { id: 'prepare-things', emoji: '🎒', fr: 'Préparer ses affaires',     en: 'Prepare your things',     category: 'productivity' },
  { id: '3-priorities',   emoji: '🏆', fr: 'Définir 3 priorités',       en: 'Define 3 priorities',     category: 'productivity' },
  { id: 'clean-desk',     emoji: '🖥️', fr: 'Nettoyer son bureau',       en: 'Clean desk',              category: 'productivity' },
  { id: 'finances',       emoji: '💰', fr: 'Finances personnelles',     en: 'Personal finances',       category: 'productivity' },
  { id: 'social-detox',   emoji: '📵', fr: 'Déconnexion réseaux sociaux', en: 'Social media detox',   category: 'productivity' },

  // ── Habitudes simples ─────────────────────────────────────────────────────
  { id: 'wake-time',      emoji: '⏰', fr: 'Se lever à heure fixe',     en: 'Wake up on time',         category: 'simple' },
  { id: 'breathe',        emoji: '🌬️', fr: 'Respiration profonde',      en: 'Deep breathing',          category: 'simple' },
  { id: 'phone-off',      emoji: '🌙', fr: 'Téléphone éteint à 22h',    en: 'Phone off at 10pm',       category: 'simple' },
  { id: 'smile-hello',    emoji: '😊', fr: 'Sourire et dire bonjour',   en: 'Smile and say hello',     category: 'simple' },
  { id: 'water-morning',  emoji: '🥤', fr: 'Verre d\'eau au réveil',    en: 'Water on waking',         category: 'simple' },
  { id: 'wash-hands',     emoji: '🧼', fr: 'Se laver les mains',        en: 'Wash hands',              category: 'simple' },
];
