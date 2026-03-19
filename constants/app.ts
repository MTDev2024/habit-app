// Nom de l'app — à remplacer ici quand le nom final est choisi
export const APP_NAME = 'habit-app';

// Couleurs par catégorie d'habitude (définies dans CLAUDE.md)
export const CATEGORY_COLORS = {
  health: '#4CAF50',      // Santé & Bien-être
  personal: '#9C27B0',    // Développement personnel
  leisure: '#FF9800',     // Loisirs & Créativité
  productivity: '#2196F3', // Productivité
  simple: '#FF5252',      // Habitudes simples
} as const;

// Palette générale de l'app
export const COLORS = {
  primary: '#2196F3',
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#F5F5F5',
  surfaceDark: '#1E1E1E',
  text: '#1A1A1A',
  textDark: '#F0F0F0',
  textSecondary: '#757575',
  textSecondaryDark: '#A0A0A0',
  border: '#E0E0E0',
  borderDark: '#333333',
  textLight: '#BDBDBD',
  error: '#D32F2F',
} as const;

// Typographie
export const TYPOGRAPHY = {
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 18,
  fontSizeXL: 22,
  fontSizeXXL: 28,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightBold: '700' as const,
} as const;

// Espacements
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Rayons de bordure
export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
} as const;
