import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/app';

/**
 * Écran de création d'une nouvelle habitude.
 * Phase 2b : formulaire complet (nom, catégorie, fréquence, rappel).
 */
export default function NewHabitScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('habit.new')}</Text>
      <Text style={styles.note}>{t('habit.comingSoon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  note: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
