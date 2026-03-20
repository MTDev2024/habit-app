import { Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore, FREE_HABIT_LIMIT } from '../../store/usePremiumStore';
import { useToastStore } from '../../store/useToastStore';
import { getCategoryByKey } from '../../constants/categories';
import HabitForm, { HabitFormValues } from '../../components/HabitForm';

/**
 * Écran de création d'une nouvelle habitude.
 * Vérifie la limite freemium avant de créer.
 * Phase 5 : remplacer le toast limite par la modale paywall.
 */
export default function NewHabitScreen() {
  const { t } = useTranslation();
  const { addHabit, getTodayHabits } = useHabitsStore();
  const { isPremium } = usePremiumStore();
  const { show } = useToastStore();

  const handleSubmit = (values: HabitFormValues) => {
    const currentCount = getTodayHabits().length;
    if (!isPremium && currentCount >= FREE_HABIT_LIMIT) {
      show(t('today.limitReached'), 'error');
      return;
    }

    addHabit({
      name: values.name,
      description: values.description,
      category: values.category,
      frequency: values.frequency,
      weekDays: values.weekDays,
      reminderTime: values.reminderTime,
      color: getCategoryByKey(values.category).color,
      completedDates: [],
      isPremiumFeature: false,
    });

    show(t('today.habitCreated'), 'success');
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('habit.new'),
          headerShown: true,
          headerBackTitle: '',
        }}
      />
      <HabitForm submitLabel={t('habit.create')} onSubmit={handleSubmit} />
    </>
  );
}
