import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

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
