import { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore, FREE_HABIT_LIMIT } from '../../store/usePremiumStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { logout } from '../../services/auth';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';

/**
 * Écran Profil / Paramètres.
 *
 * - Section profil : prénom modifiable via Firebase updateProfile
 * - Toggle dark mode
 * - Statut abonnement (gratuit / premium)
 * - Déconnexion
 */
export default function ProfileScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { habits } = useHabitsStore();
  const { isPremium } = usePremiumStore();
  const { user, updateDisplayName } = useAuthStore();
  const { show } = useToastStore();
  const { t } = useTranslation();

  // Prénom local — pré-rempli depuis Firebase displayName
  const [firstName, setFirstName] = useState(
    user?.displayName ? user.displayName.split(' ')[0] : ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  // Le compte des habitudes porte sur le total (pas seulement aujourd'hui)
  const habitCount = habits.length;

  // Valeur initiale du prénom pour détecter si une modification a eu lieu
  const originalFirstName = user?.displayName ? user.displayName.split(' ')[0] : '';
  const hasChanged = firstName.trim() !== originalFirstName;

  const initial = firstName
    ? firstName.charAt(0).toUpperCase()
    : (user?.email?.charAt(0).toUpperCase() ?? '?');

  async function handleSaveName() {
    const trimmed = firstName.trim();
    if (!trimmed || !hasChanged) return;
    setIsSaving(true);
    try {
      await updateDisplayName(trimmed);
      show(t('profile.nameSaved'), 'success');
    } catch {
      show(t('auth.errorGeneric'), 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    // La redirection vers /auth/login est automatique via le Redirect dans (tabs)/_layout.tsx
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* ── Section Profil ── */}
      <View style={[styles.section, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.textSecondary }]}>
          {t('profile.profileSection').toUpperCase()}
        </Text>

        {/* Avatar + champs */}
        <View style={styles.profileRow}>
          {/* Avatar initiale */}
          <View style={[styles.avatar, { backgroundColor: COLORS.primary + '20' }]}>
            <Text style={[styles.avatarLetter, { color: COLORS.primary }]}>{initial}</Text>
          </View>

          {/* Prénom + email */}
          <View style={styles.profileFields}>
            <TextInput
              style={[styles.firstNameInput, { color: textColor, borderBottomColor: borderColor }]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('profile.firstNamePlaceholder')}
              placeholderTextColor={COLORS.textLight}
              maxLength={30}
              returnKeyType="done"
              onSubmitEditing={handleSaveName}
            />
            {user?.email ? (
              <Text style={[styles.emailText, { color: COLORS.textSecondary }]}>{user.email}</Text>
            ) : null}
          </View>
        </View>

        {/* Bouton Enregistrer — visible uniquement si le prénom a changé */}
        {hasChanged && (
          <Pressable
            style={[styles.saveNameBtn, { backgroundColor: COLORS.primary }]}
            onPress={handleSaveName}
            disabled={isSaving}
          >
            <Text style={styles.saveNameBtnText}>
              {isSaving ? '...' : t('profile.saveName')}
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Paramètres ── */}
      <View style={[styles.section, { backgroundColor: surfaceColor }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.textSecondary }]}>
          {t('profile.settings').toUpperCase()}
        </Text>

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

        {!isPremium && (
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>{t('profile.upgrade')}</Text>
          </Pressable>
        )}
      </View>

      {/* Bouton déconnexion */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>{t('profile.logoutBtn')}</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // ── Section générique ──
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

  // ── Profil ──
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  profileFields: {
    flex: 1,
    gap: 4,
  },
  firstNameInput: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  emailText: {
    fontSize: TYPOGRAPHY.fontSizeXS,
  },
  saveNameBtn: {
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  saveNameBtnText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  // ── Paramètres ──
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

  // ── Déconnexion ──
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
