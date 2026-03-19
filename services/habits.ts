import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Habit } from '../store/useHabitsStore';

/**
 * Référence vers la sous-collection habits d'un utilisateur.
 * Structure Firestore : users/{userId}/habits/{habitId}
 */
function habitsCol(userId: string) {
  return collection(db, 'users', userId, 'habits');
}

function habitDoc(userId: string, habitId: string) {
  return doc(db, 'users', userId, 'habits', habitId);
}

/**
 * Charge toutes les habitudes d'un utilisateur depuis Firestore.
 */
export async function fetchHabits(userId: string): Promise<Habit[]> {
  const snapshot = await getDocs(habitsCol(userId));
  return snapshot.docs.map((d) => d.data() as Habit);
}

/**
 * Crée ou remplace une habitude dans Firestore (setDoc = upsert).
 */
export async function saveHabit(userId: string, habit: Habit): Promise<void> {
  await setDoc(habitDoc(userId, habit.id), habit);
}

/**
 * Met à jour des champs spécifiques d'une habitude existante.
 */
export async function patchHabit(
  userId: string,
  habitId: string,
  changes: Partial<Habit>
): Promise<void> {
  await updateDoc(habitDoc(userId, habitId), changes as Record<string, unknown>);
}

/**
 * Supprime une habitude de Firestore.
 */
export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  await deleteDoc(habitDoc(userId, habitId));
}
