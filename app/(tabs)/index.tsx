import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';
import { formatDisplayDate } from '../../utils/dateUtils';
import LandscapeHeader from '../../components/LandscapeHeader';
import ProgressRing from '../../components/ProgressRing';
import HabitItem from '../../components/HabitItem';

/**
 * Écran principal "Aujourd'hui" (Dashboard).
 *
 * Compose :
 *  - LandscapeHeader : paysage dynamique selon heure + saison
 *  - ProgressRing    : anneau animé de complétion journalière
 *  - Liste HabitItem : habitudes du jour avec cases à cocher animées
 *  - FAB "+"         : navigue vers la création d'une habitude
 */
export default function TodayScreen() {
  const { isDarkMode } = useThemeStore();
  const { getTodayHabits, getTodayCompletionRate, toggleHabit } = useHabitsStore();
  const { t, i18n } = useTranslation();
  const displayDate = formatDisplayDate(new Date(), i18n.language);

  const todayHabits = getTodayHabits();
  const completionRate = getTodayCompletionRate();
  const done = todayHabits.filter(
    (h) => h.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  const total = todayHabits.length;

  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>

      {/* ── Header paysage dynamique ── */}
      <LandscapeHeader />

      {/* ── Contenu scrollable ── */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Anneau de progression */}
        <View style={[styles.ringSection, { backgroundColor: surfaceColor }]}>
          <ProgressRing
            progress={completionRate}
            done={done}
            total={total}
            color={COLORS.primary}
            trackColor={isDarkMode ? COLORS.borderDark : COLORS.border}
          />
          {completionRate === 1 && total > 0 && (
            <Text style={[styles.allDoneText, { color: COLORS.primary }]}>
              {t('today.allDone')}
            </Text>
          )}
        </View>

        {/* Liste des habitudes */}
        <View style={styles.habitsSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            {t('today.habitsTitle')}
          </Text>
          <Text style={styles.dateText}>{displayDate}</Text>

          {todayHabits.length === 0 ? (
            // État vide
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('today.noHabits')}</Text>
              <Text style={styles.emptyHint}>{t('today.addFirst')}</Text>
            </View>
          ) : (
            todayHabits.map((habit) => (
              <HabitItem key={habit.id} habit={habit} onToggle={toggleHabit} />
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Bouton flottant "+" ── */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/habit/new')}
        accessibilityLabel={t('habit.new')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl + SPACING.xl, // espace pour le FAB
    gap: SPACING.md,
  },

  // ── Anneau de progression ──
  ringSection: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  allDoneText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textAlign: 'center',
  },

  // ── Section habitudes ──
  habitsSection: {
    gap: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },

  // ── État vide ──
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.xs,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
  },
  emptyHint: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },

  // ── Bouton flottant ──
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // Ombre
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
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
    lineHeight: 32,
  },
});
