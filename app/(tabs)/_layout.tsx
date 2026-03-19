import { Tabs, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { COLORS } from '../../constants/app';

/**
 * Layout de navigation par onglets (bottom tabs).
 *
 * Expo Router mappe automatiquement chaque fichier dans ce dossier (tabs)
 * à un onglet. Les 3 onglets sont : Today (index), Stats, Profile.
 *
 * Pourquoi des tabs en bas ? C'est le pattern dominant sur mobile Android/iOS
 * pour les apps avec 3–5 sections principales — accès rapide en un pouce.
 */
export default function TabsLayout() {
  const { isDarkMode } = useThemeStore();
  const { t } = useTranslation();
  const { user, isLoading } = useAuthStore();

  // Tant que Firebase vérifie la session, on attend (évite un flash)
  if (isLoading) return null;

  // Non connecté → écran de connexion
  if (!user) return <Redirect href="/auth/login" />;

  const tabBarBackground = isDarkMode ? COLORS.surfaceDark : COLORS.background;
  const tabBarActive = COLORS.primary;
  const tabBarInactive = isDarkMode ? COLORS.textSecondaryDark : COLORS.textSecondary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopColor: isDarkMode ? COLORS.borderDark : COLORS.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: tabBarActive,
        tabBarInactiveTintColor: tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.today'),
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('tabs.stats'),
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
