import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS } from '../constants/app';

// Initialise i18n au démarrage de l'app — doit être importé ici, une seule fois
import '../utils/i18n';


/**
 * Layout racine de l'application.
 *
 * Expo Router lit ce fichier en premier. Il définit la structure globale
 * de navigation (ici un Stack, car les tabs seront imbriqués dedans).
 * Le Stack permet aussi de gérer des écrans modaux par-dessus les tabs
 * (ex : création d'une habitude).
 */
export default function RootLayout() {
  const { isDarkMode } = useThemeStore();
  const { init } = useAuthStore();

  // Démarre l'écoute Firebase Auth dès le montage de l'app
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe; // nettoyage au démontage
  }, []);

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          // On masque le header du Stack racine — les tabs ont leur propre navigation
          headerShown: false,
          // Fond adapté au thème
          contentStyle: {
            backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.background,
          },
        }}
      />
    </>
  );
}
