import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

const COLORS_LIST = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5252', '#FFD700', '#00BCD4'];

// Génère 30 confettis aléatoires
const PARTICLES: Particle[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100, // position horizontale en %
  color: COLORS_LIST[i % COLORS_LIST.length],
  delay: Math.random() * 600,
  size: 6 + Math.random() * 6,
  rotation: Math.random() * 360,
}));

function ConfettiParticle({ particle }: { particle: Particle }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(particle.rotation);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(700, { duration: 1800, easing: Easing.out(Easing.quad) })
    );
    opacity.value = withDelay(
      particle.delay + 1200,
      withTiming(0, { duration: 600 })
    );
    rotate.value = withDelay(
      particle.delay,
      withRepeat(withTiming(particle.rotation + 360, { duration: 800 }), 3, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          left: `${particle.x}%` as any,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: particle.id % 3 === 0 ? particle.size / 2 : 2,
        },
      ]}
    />
  );
}

interface Props {
  visible: boolean;
}

/**
 * Pluie de confettis — s'affiche quand toutes les habitudes du jour sont complétées.
 * L'animation dure ~2,5 secondes puis disparaît.
 */
export default function ConfettiOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {PARTICLES.map((p) => (
        <ConfettiParticle key={p.id} particle={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: 0,
  },
});
