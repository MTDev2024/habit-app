import { CATEGORY_COLORS } from './app';

// Définition des catégories d'habitudes avec leur couleur associée
export type CategoryKey = 'health' | 'personal' | 'leisure' | 'productivity' | 'simple';

export interface Category {
  key: CategoryKey;
  label: string;
  color: string;
  icon: string; // emoji de référence visuelle
}

export const CATEGORIES: Category[] = [
  {
    key: 'health',
    label: 'Santé & Bien-être',
    color: CATEGORY_COLORS.health,
    icon: '💚',
  },
  {
    key: 'personal',
    label: 'Développement perso',
    color: CATEGORY_COLORS.personal,
    icon: '📚',
  },
  {
    key: 'leisure',
    label: 'Loisirs & Créativité',
    color: CATEGORY_COLORS.leisure,
    icon: '🎨',
  },
  {
    key: 'productivity',
    label: 'Productivité',
    color: CATEGORY_COLORS.productivity,
    icon: '⚡',
  },
  {
    key: 'simple',
    label: 'Habitudes simples',
    color: CATEGORY_COLORS.simple,
    icon: '✨',
  },
];

// Helper : retrouver une catégorie par sa clé
export const getCategoryByKey = (key: CategoryKey): Category => {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
};
