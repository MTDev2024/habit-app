import { useState } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useToastStore } from '../../store/useToastStore';
import { getCategoryByKey } from '../../constants/categories';
import HabitForm, { HabitFormValues } from '../../components/HabitForm';
import ConfirmModal from '../../components/ConfirmModal';
import { COLORS } from '../../constants/app';

/**
 * Écran d'édition d'une habitude existante.
 * Long press depuis HabitItem → cet écran.
 * Bouton "Supprimer" dans le header → modale de confirmation.
 * Reset de l'historique → accessible depuis l'écran Statistiques.
 */
export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { habits, updateHabit, removeHabit } = useHabitsStore();
  const { show } = useToastStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const habit = habits.find((h) => h.id === id);

  // Sur web, router.back() plante si la pile est vide. On utilise replace vers la racine.
  if (!habit) {
    router.replace('/');
    return null;
  }

  const handleSubmit = (values: HabitFormValues) => {
    updateHabit(id, {
      name: values.name,
      description: values.description,
      category: values.category,
      frequency: values.frequency,
      weekDays: values.weekDays,
      reminderTime: values.reminderTime,
      color: getCategoryByKey(values.category).color,
    });
    show(t('today.habitUpdated'), 'success');
    router.back();
  };

  const handleDelete = () => {
    removeHabit(id);
    show(t('today.habitDeleted'), 'info');
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('habit.edit'),
          headerShown: true,
          headerBackTitle: '',
          headerRight: () => (
            <Pressable
              onPress={() => setDeleteModalVisible(true)}
              style={{ paddingHorizontal: 8 }}
            >
              <Text style={{ color: COLORS.error, fontSize: 15, fontWeight: '500' }}>
                {t('habit.delete')}
              </Text>
            </Pressable>
          ),
        }}
      />

      <HabitForm
        initialValues={{
          name: habit.name,
          description: habit.description ?? '',
          category: habit.category,
          frequency: habit.frequency,
          weekDays: habit.weekDays ?? [],
          reminderTime: habit.reminderTime ?? '',
        }}
        submitLabel={t('habit.save')}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        title={t('habit.deleteTitle')}
        message={t('habit.deleteConfirm', { name: habit.name })}
        confirmLabel={t('habit.deleteConfirmBtn')}
        cancelLabel={t('habit.deleteCancel')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        destructive
      />
    </>
  );
}
