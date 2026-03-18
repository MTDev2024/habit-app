import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { Season } from '../../hooks/useTimeAndSeason';

// ── Types ────────────────────────────────────────────────────────────────────

interface ParticleConfig {
  x: number;       // position horizontale fixe (px)
  delay: number;   // délai avant démarrage (ms)
  duration: number; // durée d'une chute complète (ms)
  size: number;    // taille de la particule (px)
  swayAmount: number; // amplitude du balancement horizontal (px)
}

interface SeasonParticlesProps {
  season: Season;
  width: number;
  height: number;
}

// ── Configs prédéfinies des particules ──────────────────────────────────────
// Positions distribuées horizontalement, avec variation de délai et durée
// pour éviter que toutes les particules tombent en même temps

const WINTER_PARTICLES: ParticleConfig[] = [
  { x: 32,  delay: 0,    duration: 4200, size: 4, swayAmount: 0 },
  { x: 85,  delay: 700,  duration: 3600, size: 3, swayAmount: 0 },
  { x: 148, delay: 1400, duration: 4800, size: 5, swayAmount: 0 },
  { x: 210, delay: 300,  duration: 3900, size: 3, swayAmount: 0 },
  { x: 268, delay: 1000, duration: 4400, size: 4, swayAmount: 0 },
  { x: 330, delay: 1700, duration: 3700, size: 5, swayAmount: 0 },
  { x: 375, delay: 500,  duration: 5000, size: 3, swayAmount: 0 },
  { x: 120, delay: 800,  duration: 4100, size: 4, swayAmount: 0 },
];

const SPRING_PARTICLES: ParticleConfig[] = [
  { x: 40,  delay: 0,    duration: 5000, size: 6, swayAmount: 18 },
  { x: 95,  delay: 900,  duration: 4400, size: 5, swayAmount: 14 },
  { x: 158, delay: 1600, duration: 5500, size: 7, swayAmount: 20 },
  { x: 218, delay: 400,  duration: 4800, size: 5, swayAmount: 16 },
  { x: 275, delay: 1200, duration: 5200, size: 6, swayAmount: 18 },
  { x: 335, delay: 2000, duration: 4600, size: 5, swayAmount: 14 },
  { x: 380, delay: 600,  duration: 5800, size: 7, swayAmount: 22 },
  { x: 128, delay: 1000, duration: 5100, size: 6, swayAmount: 16 },
];

const AUTUMN_PARTICLES: ParticleConfig[] = [
  { x: 38,  delay: 0,    duration: 4600, size: 8,  swayAmount: 22 },
  { x: 92,  delay: 800,  duration: 4000, size: 7,  swayAmount: 18 },
  { x: 152, delay: 1500, duration: 5200, size: 9,  swayAmount: 25 },
  { x: 215, delay: 350,  duration: 4300, size: 7,  swayAmount: 20 },
  { x: 272, delay: 1100, duration: 4800, size: 8,  swayAmount: 22 },
  { x: 338, delay: 1800, duration: 4100, size: 9,  swayAmount: 24 },
  { x: 382, delay: 550,  duration: 5400, size: 7,  swayAmount: 18 },
  { x: 125, delay: 900,  duration: 4500, size: 8,  swayAmount: 20 },
];

// ── Composant particule individuelle ────────────────────────────────────────

interface SingleParticleProps {
  config: ParticleConfig;
  height: number;
  season: 'winter' | 'spring' | 'autumn';
}

function SingleParticle({ config, height, season }: SingleParticleProps) {
  const { x, delay, duration, size, swayAmount } = config;

  const translateY = useSharedValue(-size * 2);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Chute verticale en boucle infinie
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + size * 2, { duration, easing: Easing.linear }),
        -1,
        false,
      ),
    );

    // Balancement horizontal (printemps et automne)
    if (swayAmount > 0) {
      translateX.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(swayAmount, { duration: duration * 0.35 }),
            withTiming(-swayAmount, { duration: duration * 0.65 }),
          ),
          -1,
          true,
        ),
      );
    }

    // Rotation (feuilles d'automne uniquement)
    if (season === 'autumn') {
      rotate.value = withDelay(
        delay,
        withRepeat(
          withTiming(360, { duration: 2200, easing: Easing.linear }),
          -1,
          false,
        ),
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  // ── Formes selon la saison ──────────────────────────────────────────────

  if (season === 'winter') {
    // Flocon : cercle blanc semi-transparent
    return (
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            left: x - size / 2,
            top: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
          },
        ]}
      />
    );
  }

  if (season === 'spring') {
    // Pétale : ellipse rose/blanc orientée
    return (
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            left: x - size / 2,
            top: 0,
            width: size,
            height: size * 0.55,
            borderRadius: size / 2,
            backgroundColor: 'rgba(255, 182, 193, 0.80)',
          },
        ]}
      />
    );
  }

  if (season === 'autumn') {
    // Feuille : rectangle arrondi orange/marron
    return (
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            left: x - size / 2,
            top: 0,
            width: size,
            height: size * 0.65,
            borderRadius: 3,
            backgroundColor: 'rgba(210, 90, 20, 0.78)',
          },
        ]}
      />
    );
  }

  return null;
}

// ── Composant principal ──────────────────────────────────────────────────────

export default function SeasonParticles({ season, width: _width, height }: SeasonParticlesProps) {
  // L'été n'a pas de particules (ciel dégagé et clair)
  if (season === 'summer') return null;

  const particleConfigs =
    season === 'winter' ? WINTER_PARTICLES :
    season === 'spring' ? SPRING_PARTICLES :
    AUTUMN_PARTICLES;

  return (
    // pointer-events none : les particules ne capturent pas les touches
    <View style={styles.container} pointerEvents="none">
      {particleConfigs.map((pc, i) => (
        <SingleParticle
          key={i}
          config={pc}
          height={height}
          season={season as 'winter' | 'spring' | 'autumn'}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
