import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/app';

/**
 * Écran Statistiques.
 *
 * Phase 1 : placeholder.
 * Phase 2 : heatmap calendrier, graphique barres, streak counters.
 */
export default function StatsScreen() {
  const { isDarkMode } = useThemeStore();
  const { t } = useTranslation();

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('stats.title')}</Text>
      <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
        {t('stats.subtitle')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    textAlign: 'center',
  },
});
