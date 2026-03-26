import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { COLORS } from '../../constants/app';

/**
 * Layout de navigation par onglets.
 * Gère : auth guard, chargement Firestore, tab bar stylée, toast global.
 */
export default function TabsLayout() {
  const { isDarkMode } = useThemeStore();
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuthStore();
  const { loadHabits, clearHabits, isLoading: habitsLoading } = useHabitsStore();

  // Vérifie si l'onboarding a déjà été vu (null = vérification en cours)
  const [onboardingChecked, setOnboardingChecked] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then((val) => {
      setOnboardingChecked(val === 'true');
    });
  }, []);

  useEffect(() => {
    if (user) {
      loadHabits(user.uid);
    } else {
      clearHabits();
    }
  }, [user?.uid]);

  // Spinner pendant la vérification Firebase Auth
  if (authLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;

  // Spinner pendant la vérification AsyncStorage
  if (onboardingChecked === null) {
    return (
      <View style={[styles.loader, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Premier lancement → onboarding
  if (!onboardingChecked) return <Redirect href="/onboarding" />;

  // Spinner pendant le chargement initial des habitudes Firestore
  if (habitsLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const tabBarBackground = isDarkMode ? COLORS.surfaceDark : COLORS.background;
  const tabBarActive = COLORS.primary;
  const tabBarInactive = isDarkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: tabBarBackground,
            borderTopColor: borderColor,
            borderTopWidth: 1,
            elevation: 0,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarActiveTintColor: tabBarActive,
          tabBarInactiveTintColor: tabBarInactive,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.today'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="today-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: t('tabs.stats'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t('tabs.profile'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
