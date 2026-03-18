import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants/app';

/**
 * Écran Profil / Paramètres.
 *
 * Phase 1 : toggle dark mode fonctionnel (test du store Zustand).
 * Phase 3 : connexion Firebase, statut abonnement, déconnexion.
 */
export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { t } = useTranslation();

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('profile.title')}</Text>

      {/* Toggle dark mode — test du store Zustand */}
      <View style={[styles.row, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.rowLabel, { color: textColor }]}>{t('profile.darkMode')}</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Text style={[styles.note, { color: COLORS.textSecondary }]}>
        {t('profile.firebaseNote')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  note: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    marginTop: SPACING.xl,
    textAlign: 'center',
  },
});
