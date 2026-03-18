import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '../../store/useHabitsStore';
import { getCategoryByKey } from '../../constants/categories';
import HabitForm, { HabitFormValues } from '../../components/HabitForm';

/**
 * Écran de modification d'une habitude existante.
 *
 * Expo Router injecte l'`id` depuis l'URL (ex : /habit/42).
 * Le formulaire est pré-rempli avec les valeurs actuelles de l'habitude.
 * Un bouton "Supprimer" dans le header permet de la retirer définitivement.
 */
export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { habits, updateHabit, removeHabit } = useHabitsStore();

  // Recherche de l'habitude dans le store
  const habit = habits.find((h) => h.id === id);

  // Si l'habitude n'existe plus (supprimée entre-temps), on revient en arrière
  if (!habit) {
    router.back();
    return null;
  }

  const handleSubmit = (values: HabitFormValues) => {
    updateHabit(id, {
      name: values.name,
      category: values.category,
      frequency: values.frequency,
      color: getCategoryByKey(values.category).color,
    });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      t('habit.deleteTitle'),
      t('habit.deleteConfirm', { name: habit.name }),
      [
        { text: t('habit.deleteCancel'), style: 'cancel' },
        {
          text: t('habit.deleteConfirmBtn'),
          style: 'destructive',
          onPress: () => {
            removeHabit(id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('habit.edit'),
          headerShown: true,
          headerBackTitle: '',
          // Bouton "Supprimer" dans le header à droite
          headerRight: () => (
            <DeleteButton onPress={handleDelete} label={t('habit.delete')} />
          ),
        }}
      />

      <HabitForm
        initialValues={{
          name: habit.name,
          category: habit.category,
          frequency: habit.frequency,
        }}
        submitLabel={t('habit.save')}
        onSubmit={handleSubmit}
      />
    </>
  );
}

// ── Bouton suppression dans le header ────────────────────────────────────────
import { Pressable, Text } from 'react-native';

function DeleteButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 8 }}>
      <Text style={{ color: '#E53935', fontSize: 15, fontWeight: '500' }}>{label}</Text>
    </Pressable>
  );
}
