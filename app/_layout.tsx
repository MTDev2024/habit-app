import { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { COLORS } from '../constants/app';
import Toast from '../components/Toast';
import * as Notifications from 'expo-notifications';
import {
  setupAndroidChannels,
  requestNotificationPermissions,
  scheduleMotivationNotification,
} from '../services/notifications';

// Initialise i18n au démarrage de l'app — doit être importé ici, une seule fois
import '../utils/i18n';

/**
 * Layout racine de l'application.
 * Gère : chargement des fonts, écoute Firebase Auth, Toast global.
 */
export default function RootLayout() {
  const { isDarkMode } = useThemeStore();
  const { init } = useAuthStore();

  // Charge les fonts des icônes vectorielles (nécessaire sur web)
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // Démarre l'écoute Firebase Auth dès le montage de l'app
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, []);

  // Configure les notifications au démarrage (Android uniquement pour les canaux)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    async function initNotifications() {
      try {
        // Configure le comportement des notifs reçues en premier plan
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
        await setupAndroidChannels();
        const granted = await requestNotificationPermissions();
        if (granted) {
          // Planifie la motivation quotidienne à 20h
          await scheduleMotivationNotification(
            'Tu as encore le temps de compléter tes habitudes aujourd\'hui !'
          );
        }
      } catch (e) {
        // Les notifications ne sont pas critiques — l'app continue sans elles
        console.warn('Notification init failed:', e);
      }
    }
    initNotifications();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={styles.flex}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.background,
          },
        }}
      />
      {/* Toast global — par-dessus toute la navigation */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
