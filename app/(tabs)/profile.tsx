import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore, FREE_HABIT_LIMIT } from '../../store/usePremiumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { logout } from '../../services/auth';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';

/**
 * Écran Profil / Paramètres.
 *
 * Phase 2 : toggle dark mode + statut abonnement (gratuit / premium).
 * Phase 3 : connexion Firebase, avatar, déconnexion.
 * Phase 5 : bouton "Passer Premium" → Google Play Billing.
 */
export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { getTodayHabits } = useHabitsStore();
  const { isPremium } = usePremiumStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  async function handleLogout() {
    await logout();
    // La redirection vers /auth/login est automatique via le Redirect dans (tabs)/_layout.tsx
  }

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;

  const habitCount = getTodayHabits().length;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>

      {/* ── Paramètres ── */}
      <View style={[styles.section, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.textSecondary }]}>
          {t('profile.settings')}
        </Text>

        {/* Toggle dark mode */}
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: textColor }]}>{t('profile.darkMode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* ── Statut abonnement ── */}
      <View style={[styles.planCard, isPremium ? styles.planCardPremium : styles.planCardFree]}>
        <View style={styles.planHeader}>
          <Text style={styles.planIcon}>{isPremium ? '⭐' : '🆓'}</Text>
          <View style={styles.planInfo}>
            <Text style={styles.planTitle}>
              {isPremium ? t('profile.planPremium') : t('profile.planFree')}
            </Text>
            {!isPremium && (
              <Text style={styles.planUsage}>
                {t('profile.habitUsage', { count: habitCount, max: FREE_HABIT_LIMIT })}
              </Text>
            )}
          </View>
        </View>

        {/* Barre de progression des habitudes (plan gratuit uniquement) */}
        {!isPremium && (
          <View style={styles.usageBarBg}>
            <View
              style={[
                styles.usageBarFill,
                {
                  width: `${Math.min((habitCount / FREE_HABIT_LIMIT) * 100, 100)}%`,
                  backgroundColor: habitCount >= FREE_HABIT_LIMIT ? '#E53935' : COLORS.primary,
                },
              ]}
            />
          </View>
        )}

        {/* CTA upgrade (plan gratuit uniquement) — Phase 5 : ouvre le paywall */}
        {!isPremium && (
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>{t('profile.upgrade')}</Text>
          </Pressable>
        )}
      </View>

      {/* Email de l'utilisateur connecté */}
      {user?.email && (
        <Text style={[styles.userEmail, { color: COLORS.textSecondary }]}>
          {user.email}
        </Text>
      )}

      {/* Bouton déconnexion */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>{t('profile.logoutBtn')}</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
  },

  // ── Plan card ──
  planCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  planCardFree: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planCardPremium: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFD54F',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  planIcon: { fontSize: 28 },
  planInfo: { flex: 1, gap: 2 },
  planTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
  },
  planUsage: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },

  // Barre de progression habitudes
  usageBarBg: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },

  // Bouton upgrade
  upgradeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  // ── Section paramètres ──
  section: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  note: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    textAlign: 'center',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
});
