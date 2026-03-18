import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useTimeAndSeason } from '../../hooks/useTimeAndSeason';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/app';
import LandscapeHeader from '../../components/LandscapeHeader';

/**
 * Écran principal "Aujourd'hui" (Dashboard).
 *
 * Phase 1 : header paysage dynamique + carte de debug.
 * Phase 2 : anneau de progression + liste des habitudes + bouton +.
 */
export default function TodayScreen() {
  const { isDarkMode } = useThemeStore();
  const { landscapeKey, timeSlot, season } = useTimeAndSeason();
  const { t } = useTranslation();

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      {/* Header paysage dynamique — l'élément signature */}
      <LandscapeHeader />

      {/* Contenu scrollable sous le header */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Carte de debug — affiche le paysage actif (à retirer en Phase 2) */}
        <View style={styles.debugCard}>
          <Text style={styles.debugLabel}>{t('today.debugLabel')}</Text>
          <Text style={styles.debugValue}>{landscapeKey}</Text>
          <Text style={styles.debugSub}>
            {t('today.debugSlot')} : {timeSlot} · {t('today.debugSeason')} : {season}
          </Text>
        </View>

        {/* Placeholder contenu Phase 2 */}
        <Text style={[styles.placeholder, { color: COLORS.textSecondary }]}>
          {t('today.subtitle')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.md,
  },
  debugCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    width: '100%',
    gap: 4,
  },
  debugLabel: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: '#666',
  },
  debugValue: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
  },
  debugSub: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: '#999',
  },
  placeholder: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});
