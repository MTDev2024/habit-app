import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Layout pour les écrans d'authentification (login + inscription).
 * Si l'utilisateur est déjà connecté, on le redirige directement vers les tabs.
 */
export default function AuthLayout() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;

  // Déjà connecté → dashboard
  if (user) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
