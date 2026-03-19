import { Stack, router } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore, FREE_HABIT_LIMIT } from '../../store/usePremiumStore';
import { getCategoryByKey } from '../../constants/categories';
import HabitForm, { HabitFormValues } from '../../components/HabitForm';

/**
 * Écran de création d'une nouvelle habitude.
 *
 * Vérifie la limite de 5 habitudes pour les users gratuits avant de créer.
 * Phase 5 : le bloc Alert sera remplacé par une modale paywall élégante.
 */
export default function NewHabitScreen() {
  const { t } = useTranslation();
  const { addHabit, getTodayHabits } = useHabitsStore();
  const { isPremium } = usePremiumStore();

  const handleSubmit = (values: HabitFormValues) => {
    // Vérification de la limite free avant création
    const currentCount = getTodayHabits().length;
    if (!isPremium && currentCount >= FREE_HABIT_LIMIT) {
      // Phase 5 : remplacer par la modale paywall
      Alert.alert(
        '🔒 Limite atteinte',
        `Le plan gratuit est limité à ${FREE_HABIT_LIMIT} habitudes. Passez Premium pour en ajouter autant que vous voulez.`,
        [{ text: 'OK' }],
      );
      return;
    }

    addHabit({
      name: values.name,
      category: values.category,
      frequency: values.frequency,
      weekDays: values.weekDays,
      color: getCategoryByKey(values.category).color,
      completedDates: [],
      isPremiumFeature: false,
    });
    router.back();
  };

  return (
    <>
      {/* Configuration du header Stack pour cet écran uniquement */}
      <Stack.Screen
        options={{
          title: t('habit.new'),
          headerShown: true,
          headerBackTitle: '',
        }}
      />

      <HabitForm
        submitLabel={t('habit.create')}
        onSubmit={handleSubmit}
      />
    </>
  );
}
