import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

// Client IDs Google (issus de google-services.json)
export const GOOGLE_ANDROID_CLIENT_ID = '241501315547-erkhd9fpihtea78h69ovkp351s7iaf0i.apps.googleusercontent.com';
export const GOOGLE_WEB_CLIENT_ID = '241501315547-qpev4o9rbadnjlocfbn1anjv2tubv9pt.apps.googleusercontent.com';

/**
 * Connecte ou crée un compte via Google (id_token issu de expo-auth-session).
 */
export async function signInWithGoogle(idToken: string): Promise<User> {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

/**
 * Crée un nouveau compte utilisateur avec email + mot de passe.
 * Retourne l'utilisateur Firebase ou lève une erreur.
 */
export async function registerWithEmail(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Connecte un utilisateur existant avec email + mot de passe.
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Met à jour le displayName de l'utilisateur connecté (prénom visible dans l'app).
 */
export async function updateUserDisplayName(displayName: string): Promise<void> {
  if (!auth.currentUser) return;
  await updateProfile(auth.currentUser, { displayName });
}

/**
 * Déconnecte l'utilisateur courant.
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Écoute les changements d'état d'authentification (connexion / déconnexion).
 * Retourne la fonction de désabonnement à appeler dans le cleanup.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
