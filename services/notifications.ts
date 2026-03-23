import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure le comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Identifiant réservé pour la notification de motivation quotidienne
const MOTIVATION_NOTIF_ID = 'ritmo-motivation-daily';

/**
 * Crée les canaux Android (obligatoire Android 8+).
 * Les canaux permettent à l'utilisateur de gérer les notifs par catégorie.
 */
export async function setupAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('habits', {
    name: 'Rappels d\'habitudes',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2196F3',
  });

  await Notifications.setNotificationChannelAsync('motivation', {
    name: 'Motivation quotidienne',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Demande la permission d'envoyer des notifications (Android 13+, iOS).
 * Retourne true si la permission est accordée.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Planifie une notification quotidienne récurrente pour une habitude.
 * Si une notification existait déjà pour cet ID, elle est remplacée.
 * N'agit pas si l'habitude n'a pas d'heure de rappel.
 */
export async function scheduleHabitReminder(
  habitId: string,
  habitName: string,
  reminderTime: string | null | undefined,
): Promise<void> {
  // Annule toujours l'ancienne notif en premier
  await cancelHabitReminder(habitId);

  if (!reminderTime) return;

  const [hours, minutes] = reminderTime.split(':').map(Number);

  await Notifications.scheduleNotificationAsync({
    identifier: `habit-${habitId}`,
    content: {
      title: 'Ritmo',
      body: habitName,
      sound: true,
      data: { habitId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
      channelId: 'habits',
    },
  });
}

/**
 * Annule le rappel d'une habitude.
 * Silencieux si aucune notification n'existait.
 */
export async function cancelHabitReminder(habitId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
  } catch {
    // Notification inexistante — pas d'erreur à remonter
  }
}

/**
 * Planifie la notification de motivation à 20h.
 * Appelée au démarrage et réinitialisée chaque jour.
 * À annuler dès que toutes les habitudes du jour sont complétées.
 */
export async function scheduleMotivationNotification(body: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(MOTIVATION_NOTIF_ID);

  await Notifications.scheduleNotificationAsync({
    identifier: MOTIVATION_NOTIF_ID,
    content: {
      title: 'Ritmo',
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
      channelId: 'motivation',
    },
  });
}

/**
 * Annule la notification de motivation (ex: toutes les habitudes complétées).
 */
export async function cancelMotivationNotification(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(MOTIVATION_NOTIF_ID);
  } catch {
    // Silencieux
  }
}
