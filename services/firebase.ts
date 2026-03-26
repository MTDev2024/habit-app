import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, Persistence } from 'firebase/auth';

// getReactNativePersistence est présent dans le bundle React Native de firebase/auth
// au runtime (Metro le résout vers le bundle RN), mais absent des types TypeScript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuration Firebase.
 * Ces valeurs sont publiques par conception (la sécurité repose sur les règles Firestore).
 * En dev local, les variables d'environnement (.env.local) ont la priorité.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyAr8RJHwUAOdld2BXQd6NfXyUUvNdaInSY',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'habit-app-76a97.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'habit-app-76a97',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'habit-app-76a97.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '241501315547',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '1:241501315547:web:772e21e69a641e4fa147fe',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-QC0BGB7ETJ',
};

// Évite la double initialisation en mode hot-reload
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Initialise Firebase Auth avec persistance AsyncStorage.
 * La session survit aux redémarrages de l'app — l'utilisateur reste connecté
 * jusqu'à ce qu'il se déconnecte explicitement.
 * Le try/catch évite le crash si Auth est déjà initialisé (ex: hot reload).
 */
function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}
export const auth = createAuth();

export const db = getFirestore(app);
