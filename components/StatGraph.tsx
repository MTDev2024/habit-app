import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { DayStats } from '../utils/statsUtils';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/app';

interface StatGraphProps {
  data: DayStats[];        // 7 entrées (une par jour)
  dayLabels: string[];     // labels abrégés ['Lu','Ma',...]
  color?: string;
}

const BAR_MAX_HEIGHT = 90;
const BAR_WIDTH = 32;

// ── Barre animée individuelle ────────────────────────────────────────────────

interface AnimatedBarProps {
  rate: number;
  color: string;
  delay: number;
}

function AnimatedBar({ rate, color, delay }: AnimatedBarProps) {
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withTiming(rate * BAR_MAX_HEIGHT, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [rate]);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
    backgroundColor: height.value < 1 ? COLORS.border : color,
    // Barre vide : juste un trait en bas
    minHeight: 3,
    borderRadius: BORDER_RADIUS.sm,
  }));

  return (
    <View style={styles.barContainer}>
      {/* Espace vide au-dessus — pousse la barre vers le bas */}
      <View style={{ flex: 1 }} />
      <Animated.View style={[styles.bar, animStyle]} />
    </View>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────

/**
 * Graphique en barres des 7 derniers jours.
 *
 * Chaque barre représente le taux de complétion d'une journée.
 * Les barres s'animent en montant à l'affichage (withTiming + stagger).
 */
export default function StatGraph({
  data,
  dayLabels,
  color = COLORS.primary,
}: StatGraphProps) {
  return (
    <View style={styles.container}>
      {/* Barres */}
      <View style={styles.barsRow}>
        {data.map((day, i) => (
          <View key={day.date} style={styles.column}>
            {/* Pourcentage au-dessus */}
            <Text style={styles.percentLabel}>
              {day.rate > 0 ? `${Math.round(day.rate * 100)}%` : ''}
            </Text>
            <AnimatedBar rate={day.rate} color={color} delay={i * 60} />
            {/* Label du jour en-dessous */}
            <Text style={styles.dayLabel}>{dayLabels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.sm,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barContainer: {
    width: BAR_WIDTH,
    height: BAR_MAX_HEIGHT,
    flexDirection: 'column',
  },
  bar: {
    width: BAR_WIDTH,
  },
  percentLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    height: 14,
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
});
