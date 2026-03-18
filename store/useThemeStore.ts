import { create } from 'zustand';

// Types du store de thème
interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

/**
 * Store Zustand pour gérer le thème clair/sombre.
 *
 * Zustand fonctionne comme un "état global" accessible depuis n'importe quel composant
 * sans avoir besoin de passer des props. C'est beaucoup plus simple que Redux.
 *
 * Utilisation dans un composant :
 *   const { isDarkMode, toggleTheme } = useThemeStore();
 */
export const useThemeStore = create<ThemeState>((set) => ({
  // État initial : mode clair par défaut (comme défini dans CLAUDE.md)
  isDarkMode: false,

  // Bascule entre clair et sombre
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  // Définit la valeur directement (utile pour charger la préférence sauvegardée)
  setDarkMode: (value: boolean) => set({ isDarkMode: value }),
}));
