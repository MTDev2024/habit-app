import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { getUserProfile } from '../../services/user';
import { useBadgesStore } from '../../store/useBadgesStore';
import BadgeModal from '../../components/BadgeModal';
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
  const { pendingBadge, clearPendingBadge, loadEarnedBadges, clearBadges } = useBadgesStore();

  // Vérifie si l'onboarding a déjà été vu (null = vérification en cours)
  const [onboardingChecked, setOnboardingChecked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    const cacheKey = `hasSeenOnboarding_${user.uid}`;

    async function checkOnboarding() {
      // Cache local d'abord — évite une lecture Firestore à chaque démarrage
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached === 'true') {
        setOnboardingChecked(true);
        return;
      }
      // Pas en cache → lecture Firestore (premier lancement ou nouvel appareil)
      try {
        const profile = await getUserProfile(user!.uid);
        const seen = profile?.hasSeenOnboarding ?? false;
        if (seen) {
          await AsyncStorage.setItem(cacheKey, 'true');
        }
        // Charge les badges déjà gagnés dans le store
        loadEarnedBadges(profile?.earnedBadges ?? []);
        setOnboardingChecked(seen);
      } catch {
        setOnboardingChecked(true);
      }
    }

    checkOnboarding();
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      loadHabits(user.uid);
    } else {
      clearHabits();
      clearBadges();
    }
  }, [user?.uid]);

  const loaderStyle = { flex: 1, justifyContent: 'center' as const, alignItems: 'center' as const };

  // Spinner pendant la vérification Firebase Auth
  if (authLoading) {
    return (
      <View style={[loaderStyle, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) return <Redirect href="/auth/login" />;

  // Spinner pendant la vérification AsyncStorage / Firestore
  if (onboardingChecked === null) {
    return (
      <View style={[loaderStyle, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Premier lancement → onboarding
  if (!onboardingChecked) return <Redirect href="/onboarding" />;

  // Spinner pendant le chargement initial des habitudes Firestore
  if (habitsLoading) {
    return (
      <View style={[loaderStyle, { backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const tabBarBackground = isDarkMode ? COLORS.surfaceDark : COLORS.background;
  const tabBarActive = COLORS.primary;
  const tabBarInactive = isDarkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  return (
    <>
      <BadgeModal badge={pendingBadge} onClose={clearPendingBadge} />
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
    </>
  );
}
