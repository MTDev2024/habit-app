import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePremiumStore, FREE_HABIT_LIMIT } from '../../store/usePremiumStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';
import { getTodayKey, formatDisplayDate } from '../../utils/dateUtils';
import LandscapeHeader, { LANDSCAPE_HEADER_HEIGHT } from '../../components/LandscapeHeader';
import AppLogo from '../../components/AppLogo';
import ProgressRing from '../../components/ProgressRing';
import HabitItem from '../../components/HabitItem';
import ConfettiOverlay from '../../components/ConfettiOverlay';

// Format 24h — Bonjour 05h-12h, Salut 12h-18h, Bonsoir 18h-05h
function getGreeting(hour: number, t: (key: string) => string): string {
  if (hour >= 5 && hour < 12) return t('today.greetingMorning');
  if (hour >= 12 && hour < 18) return t('today.greetingAfternoon');
  return t('today.greetingEvening');
}

/**
 * Écran principal "Aujourd'hui" (Dashboard).
 */
export default function TodayScreen() {
  const { isDarkMode } = useThemeStore();
  const { getTodayHabits, getTodayCompletionRate, toggleHabit, habits } = useHabitsStore();
  const { user } = useAuthStore();
  const { isPremium } = usePremiumStore();
  const { t, i18n } = useTranslation();

  const displayDate = formatDisplayDate(new Date(), i18n.language);
  const hour = new Date().getHours();
  const greeting = getGreeting(hour, t);
  // Prénom uniquement depuis le displayName Firebase (jamais depuis l'email)
  const firstName = user?.displayName ? user.displayName.split(' ')[0] : '';

  const todayHabits = getTodayHabits();
  // La limite porte sur le total des habitudes (pas seulement celles affichées aujourd'hui)
  const isAtLimit = !isPremium && habits.length >= FREE_HABIT_LIMIT;
  const completionRate = getTodayCompletionRate();
  const today = getTodayKey();
  const done = todayHabits.filter((h) => h.completedDates.includes(today)).length;
  const total = todayHabits.length;
  const allDone = completionRate === 1 && total > 0;

  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>

      {/* ── Hero : paysage + overlay salutation ── */}
      <View style={styles.hero}>
        <LandscapeHeader />
        {/* Dégradé sombre en bas pour que le texte soit lisible sur le paysage */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.52)']}
          style={styles.heroGradient}
          pointerEvents="none"
        />
        <View style={styles.heroOverlay} pointerEvents="none">
          <AppLogo size={32} bgColor="#FFFFFF" checkColor={COLORS.primary} />
          <View>
            <Text style={styles.heroGreeting}>
              {greeting}{firstName ? `, ${firstName}` : ''}
            </Text>
            <Text style={styles.heroDate}>{displayDate}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Anneau de progression */}
        <View style={[styles.ringSection, { backgroundColor: surfaceColor }]}>
          <ProgressRing
            progress={completionRate}
            done={done}
            total={total}
            color={COLORS.primary}
            trackColor={isDarkMode ? COLORS.borderDark : COLORS.border}
          />
        </View>

        {/* Section habitudes */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                {t('today.habitsTitle')}
              </Text>
              <Text style={styles.dateText}>{displayDate}</Text>
            </View>
            {total > 0 && (
              <View style={[styles.countBadge, { backgroundColor: COLORS.primary + '18' }]}>
                <Text style={[styles.countText, { color: COLORS.primary }]}>{done}/{total}</Text>
              </View>
            )}
          </View>

          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✦</Text>
              <Text style={[styles.emptyText, { color: textColor }]}>{t('today.noHabits')}</Text>
              <Text style={styles.emptyHint}>{t('today.addFirst')}</Text>
            </View>
          ) : (
            todayHabits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
            ))
          )}
        </View>

      </ScrollView>

      {/* FAB "+" */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: isAtLimit ? COLORS.textSecondary : COLORS.primary },
          pressed && styles.fabPressed,
        ]}
        onPress={() => router.push('/habit/new')}
        accessibilityLabel={t('habit.new')}
      >
        <Text style={styles.fabIcon}>{isAtLimit ? '🔒' : '+'}</Text>
      </Pressable>

      {/* Confettis — affichés quand toutes les habitudes sont complétées */}
      <ConfettiOverlay visible={allDone} />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingBottom: SPACING.xxl + SPACING.xl,
    gap: SPACING.md,
  },

  // ── Hero paysage avec overlay ──
  hero: {
    height: LANDSCAPE_HEADER_HEIGHT,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: LANDSCAPE_HEADER_HEIGHT * 0.65,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heroGreeting: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroDate: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: TYPOGRAPHY.fontSizeSM,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  ringSection: {
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },

  habitsSection: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  countBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  countText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.xs,
  },
  emptyIcon: {
    fontSize: 32,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  emptyHint: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },

  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    lineHeight: 34,
  },
});
