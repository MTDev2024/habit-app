import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Habit } from '../store/useHabitsStore';
import { isCompletedToday } from '../utils/dateUtils';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/app';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

/**
 * Ligne d'habitude avec case à cocher animée.
 *
 * Animations :
 *   - Coche → scale bounce sur la ligne entière (satisfaction de complétion)
 *   - Checkmark (✓) → apparition progressive avec spring
 *   - Fond de la checkbox → remplissage coloré quand cochée
 */
export default function HabitItem({ habit, onToggle }: HabitItemProps) {
  const isCompleted = isCompletedToday(habit.completedDates);

  // Valeurs animées
  const rowScale = useSharedValue(1);
  const checkScale = useSharedValue(isCompleted ? 1 : 0);
  const checkOpacity = useSharedValue(isCompleted ? 1 : 0);
  const bgOpacity = useSharedValue(isCompleted ? 1 : 0);

  // Synchronise l'état visuel quand isCompleted change (depuis le store)
  useEffect(() => {
    if (isCompleted) {
      // Animation d'entrée : le check apparaît avec un rebond
      checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      checkOpacity.value = withTiming(1, { duration: 150 });
      bgOpacity.value = withTiming(1, { duration: 200 });
      // Micro-bounce sur la ligne
      rowScale.value = withSequence(
        withTiming(1.03, { duration: 80 }),
        withSpring(1, { damping: 15 }),
      );
    } else {
      // Animation de sortie : le check disparaît
      checkScale.value = withTiming(0, { duration: 150 });
      checkOpacity.value = withTiming(0, { duration: 120 });
      bgOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [isCompleted]);

  // Styles animés
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
    <Pressable onPress={() => onToggle(habit.id)} accessibilityRole="checkbox">
      <Animated.View style={[styles.row, rowAnimatedStyle]}>

        {/* Checkbox */}
        <View style={[styles.checkbox, { borderColor: habit.color }]}>
          {/* Fond coloré (visible quand cochée) */}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: habit.color, borderRadius: BORDER_RADIUS.sm },
              checkboxBgAnimatedStyle,
            ]}
          />
          {/* Symbole ✓ animé */}
          <Animated.Text style={[styles.checkmark, checkAnimatedStyle]}>
            ✓
          </Animated.Text>
        </View>

        {/* Nom et catégorie */}
        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              isCompleted && styles.nameCompleted,
            ]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
        </View>

        {/* Indicateur de couleur de catégorie (barre à droite) */}
        <View style={[styles.categoryDot, { backgroundColor: habit.color }]} />

      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    // Ombre légère (style "card épurée" du CLAUDE.md)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: SPACING.sm,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    lineHeight: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: '#1A1A1A',
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  nameCompleted: {
    // Texte barré et atténué quand complété
    textDecorationLine: 'line-through',
    color: '#A0A0A0',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
