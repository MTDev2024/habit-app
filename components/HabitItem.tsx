import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Habit } from '../store/useHabitsStore';
import { isCompletedToday, getCurrentStreak, getCurrentStreakWeekly } from '../utils/dateUtils';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, COLORS } from '../constants/app';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

/**
 * Ligne d'habitude redessinée — inspiration "Done" app.
 *
 * Design :
 *   - Barre de couleur verticale à gauche (accent visuel de la catégorie)
 *   - Nom de l'habitude + description optionnelle en sous-titre
 *   - Badge streak à droite (🔥 + nombre de jours/occurrences)
 *   - Checkbox animée à l'extrême droite
 *
 * Interactions :
 *   - Tap        → toggle complétion
 *   - Long press → navigation vers l'écran d'édition
 */
export default function HabitItem({ habit, onToggle }: HabitItemProps) {
  const isCompleted = isCompletedToday(habit.completedDates);

  // Calcul du streak selon la fréquence de l'habitude
  const streak = habit.frequency === 'weekly'
    ? getCurrentStreakWeekly(habit.completedDates, habit.weekDays ?? [])
    : getCurrentStreak(habit.completedDates);

  // Valeurs animées
  const rowScale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const checkOpacity = useSharedValue(isCompleted ? 1 : 0);
  const bgOpacity = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    if (isCompleted) {
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      checkOpacity.value = withTiming(1, { duration: 150 });
      bgOpacity.value = withTiming(1, { duration: 200 });
      rowScale.value = withSequence(
        withTiming(1.02, { duration: 80 }),
        withSpring(1, { damping: 15 }),
      );
    } else {
      checkScale.value = withTiming(0, { duration: 150 });
      checkOpacity.value = withTiming(0, { duration: 120 });
      bgOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [isCompleted]);

  const rowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rowScale.value }],
  }));
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));
  const checkboxBgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Pressable
      onPress={() => onToggle(habit.id)}
      onLongPress={() => router.push(`/habit/${habit.id}`)}
      delayLongPress={400}
      accessibilityRole="checkbox"
    >
      <Animated.View style={[styles.row, rowAnimatedStyle, isCompleted && styles.rowCompleted]}>

        {/* Barre de couleur à gauche */}
        <View style={[styles.colorBar, { backgroundColor: habit.color }]} />

        {/* Nom + description */}
        <View style={styles.info}>
          <Text style={[styles.name, isCompleted && styles.nameCompleted]} numberOfLines={1}>
            {habit.name}
          </Text>
          {habit.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {habit.description}
            </Text>
          ) : null}
        </View>

        {/* Badge streak — affiché uniquement si streak > 0 */}
        {streak > 0 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}</Text>
          </View>
        )}

        {/* Checkbox */}
        <View style={[styles.checkbox, { borderColor: isCompleted ? habit.color : COLORS.border }]}>
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: habit.color, borderRadius: BORDER_RADIUS.sm },
              checkboxBgAnimatedStyle,
            ]}
          />
          <Animated.Text style={[styles.checkmark, checkAnimatedStyle]}>✓</Animated.Text>
        </View>

      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 64,
  },
  rowCompleted: {
    opacity: 0.72,
  },

  colorBar: {
    width: 4,
    alignSelf: 'stretch',
  },

  info: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm + 2,
    gap: 2,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  nameCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },

  streakBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#FFF3E0',
    marginRight: SPACING.sm,
  },
  streakText: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: '#E65100',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    lineHeight: 18,
  },
});
