import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

// Jours EU (0=lundi…6=dimanche) → weekday expo-notifications (1=dim, 2=lun…7=sam)
function euDayToNotifWeekday(euDay: number): number {
  return euDay === 6 ? 1 : euDay + 2;
}

/**
 * Planifie le(s) rappel(s) pour une habitude.
 * - Habitude quotidienne : une notif DAILY à l'heure définie.
 * - Habitude hebdomadaire : une notif WEEKLY par jour configuré.
 * Remplace toute notification existante pour cet ID.
 */
export async function scheduleHabitReminder(
  habitId: string,
  habitName: string,
  reminderTime: string | null | undefined,
  frequency: 'daily' | 'weekly' = 'daily',
  weekDays: number[] = [],
): Promise<void> {
  // Annule toujours les anciennes notifs en premier
  await cancelHabitReminder(habitId);

  if (!reminderTime) return;

  const [hours, minutes] = reminderTime.split(':').map(Number);

  if (frequency === 'weekly' && weekDays.length > 0) {
    // Une notification par jour de la semaine configuré
    for (const euDay of weekDays) {
      await Notifications.scheduleNotificationAsync({
        identifier: `habit-${habitId}-day-${euDay}`,
        content: {
          title: 'Ritmo',
          body: habitName,
          sound: true,
          data: { habitId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: euDayToNotifWeekday(euDay),
          hour: hours,
          minute: minutes,
          channelId: 'habits',
        },
      });
    }
  } else {
    // Habitude quotidienne : une seule notif récurrente
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
}

/**
 * Annule tous les rappels d'une habitude (daily ou weekly multi-jours).
 * Silencieux si aucune notification n'existait.
 */
export async function cancelHabitReminder(habitId: string): Promise<void> {
  // Annule la notif quotidienne
  try {
    await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
  } catch { /* Notification inexistante */ }

  // Annule les notifs hebdomadaires (jours 0 à 6)
  for (let day = 0; day <= 6; day++) {
    try {
      await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}-day-${day}`);
    } catch { /* Notification inexistante */ }
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
