import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

// Structure du profil utilisateur stocké dans Firestore
export interface UserProfile {
  email: string;
  hasSeenOnboarding: boolean;
  subscriptionStatus: 'free' | 'premium';
  theme: 'light' | 'dark';
  createdAt: number;
  earnedBadges: string[]; // liste des badge IDs débloqués
}

function profileDoc(userId: string) {
  return doc(db, 'users', userId, 'profile', 'data');
}

/**
 * Crée le profil Firestore d'un nouvel utilisateur.
 * Appelé juste après l'inscription.
 */
export async function createUserProfile(userId: string, email: string): Promise<void> {
  const profile: UserProfile = {
    email,
    hasSeenOnboarding: false,
    subscriptionStatus: 'free',
    theme: 'light',
    createdAt: Date.now(),
    earnedBadges: [],
  };
  await setDoc(profileDoc(userId), profile);
}

/**
 * Récupère le profil d'un utilisateur depuis Firestore.
 * Retourne null si le profil n'existe pas encore.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(profileDoc(userId));
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
}

/**
 * Marque l'onboarding comme vu dans Firestore.
 * setDoc avec merge:true = upsert — fonctionne même si le document n'existe pas encore.
 */
export async function markOnboardingSeen(userId: string): Promise<void> {
  await setDoc(profileDoc(userId), { hasSeenOnboarding: true }, { merge: true });
}

/**
 * Ajoute un badge gagné au profil Firestore (arrayUnion évite les doublons).
 * setDoc avec merge:true = upsert — fonctionne même si le document n'existe pas encore.
 */
export async function addEarnedBadge(userId: string, badgeId: string): Promise<void> {
  await setDoc(profileDoc(userId), { earnedBadges: arrayUnion(badgeId) }, { merge: true });
}
