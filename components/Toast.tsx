import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useToastStore, ToastType } from '../store/useToastStore';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, COLORS } from '../constants/app';

const TOAST_COLORS: Record<ToastType, string> = {
  success: '#2E7D32',
  error: '#C62828',
  info: COLORS.primary,
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
};

/**
 * Toast de feedback — s'affiche en bas de l'écran pendant 2,5 secondes.
 * À placer une seule fois dans le layout tabs.
 */
export default function Toast() {
  const { message, type, visible } = useToastStore();

  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(80, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColor = TOAST_COLORS[type];

  return (
    <Animated.View
      style={[styles.toast, { backgroundColor: bgColor }, animatedStyle]}
      pointerEvents="none"
    >
      <Text style={styles.icon}>{TOAST_ICONS[type]}</Text>
      <Text style={styles.message} numberOfLines={2}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90, // au-dessus de la tab bar
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    width: 20,
    textAlign: 'center',
  },
  message: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: '500',
  },
});
