import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TYPOGRAPHY, COLORS } from '../constants/app';

// Permet d'animer les props du composant SVG Circle via Reanimated
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;     // 0 à 1
  done: number;         // nombre d'habitudes complétées
  total: number;        // nombre total d'habitudes
  size?: number;        // diamètre du cercle en px
  strokeWidth?: number; // épaisseur de l'anneau
  color?: string;       // couleur de l'arc de progression
  trackColor?: string;  // couleur de la piste (fond de l'anneau)
}

/**
 * Anneau de progression circulaire animé.
 *
 * Utilise react-native-svg + react-native-reanimated pour animer
 * le strokeDashoffset du Circle SVG quand la progression change.
 *
 * La technique strokeDasharray/strokeDashoffset :
 *   - strokeDasharray = circonférence totale du cercle
 *   - strokeDashoffset = portion NON remplie = circonférence × (1 - progress)
 *   → quand progress = 1 : offset = 0 → cercle entièrement rempli
 *   → quand progress = 0 : offset = circonférence → cercle vide
 */
export default function ProgressRing({
  progress,
  done,
  total,
  size = 120,
  strokeWidth = 10,
  color = COLORS.primary,
  trackColor = COLORS.border,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  // Valeur animée de la progression (0 → 1)
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  // Props SVG calculées depuis la valeur animée
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Piste de fond */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Arc de progression animé — démarre à 12h (rotation -90°) */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation={-90}
          origin={`${cx}, ${cy}`}
        />
      </Svg>

      {/* Texte centré à l'intérieur du cercle */}
      <View style={[styles.center, { width: size, height: size }]}>
        <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
        <Text style={styles.count}>
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    lineHeight: 26,
  },
  count: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
