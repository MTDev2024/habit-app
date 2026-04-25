import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { BadgeDefinition } from '../constants/badges';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/app';

interface BadgeModalProps {
  badge: BadgeDefinition | null;
  onClose: () => void;
}

/**
 * Modale de débloquage de badge avec animation bounce + apparition progressive.
 * S'affiche automatiquement quand `badge` est non-null.
 */
export default function BadgeModal({ badge, onClose }: BadgeModalProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  // Valeurs animées
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);

  useEffect(() => {
    if (!badge) return;

    // Réinitialise avant chaque animation
    scale.value = 0;
    opacity.value = 0;
    emojiScale.value = 0;

    // Fond + carte : fade-in
    opacity.value = withTiming(1, { duration: 300 });

    // Carte : bounce in
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });

    // Emoji : bounce avec délai pour l'effet "pop"
    emojiScale.value = withDelay(
      200,
      withSequence(
        withSpring(1.4, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );
  }, [badge]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  if (!badge) return null;

  const label = lang === 'fr' ? badge.labelFr : badge.labelEn;
  const description = lang === 'fr' ? badge.descriptionFr : badge.descriptionEn;
  const congratsText = lang === 'fr' ? 'Badge débloqué !' : 'Badge unlocked!';
  const closeText = lang === 'fr' ? 'Super !' : 'Awesome!';

  return (
    <Modal transparent animationType="none" visible={!!badge} onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Animated.View style={[styles.card, cardStyle]}>

          {/* Emoji animé */}
          <Animated.Text style={[styles.emoji, emojiStyle]}>
            {badge.emoji}
          </Animated.Text>

          {/* Textes */}
          <Text style={styles.congrats}>{congratsText}</Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Bouton fermeture */}
          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>{closeText}</Text>
          </TouchableOpacity>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.sm,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  emoji: {
    fontSize: 72,
    marginBottom: SPACING.sm,
  },
  congrats: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    textAlign: 'center',
  },
  description: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 13,
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xs,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 0.3,
  },
});
