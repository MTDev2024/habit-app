import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore } from '../../store/usePremiumStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';
import { getLast7DaysStats, getMonthCompletionMap, getDayLabel } from '../../utils/statsUtils';
import { getCurrentStreak, getCurrentStreakWeekly } from '../../utils/dateUtils';
import StatGraph from '../../components/StatGraph';
import HeatmapCalendar from '../../components/HeatmapCalendar';

/**
 * Écran Statistiques.
 * - Streaks : cards visuelles avec barre de couleur + streak mis en avant
 * - Graphique 7 jours : premium
 * - Heatmap mensuelle : premium
 */
export default function StatsScreen() {
  const { isDarkMode } = useThemeStore();
  const { habits } = useHabitsStore();
  const { isPremium } = usePremiumStore();
  const { t, i18n } = useTranslation();

  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;
  const lang = i18n.language;

  const last7Stats = getLast7DaysStats(habits);
  const dayLabels = last7Stats.map((d) => getDayLabel(d.date, lang));
  const monthMap = getMonthCompletionMap(habits);

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={[styles.title, { color: textColor }]}>{t('stats.title')}</Text>

        {/* ── Streaks ── */}
        <Text style={[styles.sectionLabel, { color: COLORS.textSecondary }]}>
          {t('stats.streakTitle').toUpperCase()}
        </Text>

        {habits.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>{t('today.noHabits')}</Text>
          </View>
        ) : (
          habits.map((habit) => {
            const streak = habit.frequency === 'weekly'
              ? getCurrentStreakWeekly(habit.completedDates, habit.weekDays ?? [])
              : getCurrentStreak(habit.completedDates);

            return (
              <View key={habit.id} style={[styles.streakCard, { backgroundColor: surfaceColor }]}>
                {/* Barre de couleur à gauche */}
                <View style={[styles.streakBar, { backgroundColor: habit.color }]} />

                {/* Info habitude */}
                <View style={styles.streakInfo}>
                  <Text style={[styles.streakName, { color: textColor }]} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text style={[styles.streakFreq, { color: COLORS.textSecondary }]}>
                    {t(`habit.${habit.frequency}`)}
                    {habit.frequency === 'weekly' && habit.weekDays && habit.weekDays.length > 0
                      ? ` · ${habit.weekDays.length}j/sem`
                      : ''}
                  </Text>
                </View>

                {/* Streak badge */}
                <View style={[
                  styles.streakBadge,
                  streak > 0
                    ? { backgroundColor: habit.color + '20' }
                    : { backgroundColor: COLORS.surface },
                ]}>
                  {streak > 0 ? (
                    <>
                      <Text style={styles.streakFire}>🔥</Text>
                      <Text style={[styles.streakCount, { color: habit.color }]}>
                        {t('stats.streakDays', { count: streak })}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.streakNone}>{t('stats.streakNone')}</Text>
                  )}
                </View>
              </View>
            );
          })
        )}

        {/* ── Graphique 7 jours (premium) ── */}
        <PremiumSection
          locked={!isPremium}
          title={t('stats.graphTitle')}
          premiumTitle={t('stats.premiumTitle')}
          premiumDesc={t('stats.premiumDesc')}
          upgradeLabel={t('stats.upgrade')}
          surfaceColor={surfaceColor}
          textColor={textColor}
        >
          <StatGraph data={last7Stats} dayLabels={dayLabels} color={COLORS.primary} />
        </PremiumSection>

        {/* ── Heatmap mois (premium) ── */}
        <PremiumSection
          locked={!isPremium}
          title={t('stats.heatmapTitle')}
          premiumTitle={t('stats.premiumTitle')}
          premiumDesc={t('stats.premiumDesc')}
          upgradeLabel={t('stats.upgrade')}
          surfaceColor={surfaceColor}
          textColor={textColor}
        >
          <HeatmapCalendar completionMap={monthMap} color={COLORS.primary} lang={lang} />
        </PremiumSection>

      </ScrollView>
    </View>
  );
}

// ── Section premium ──────────────────────────────────────────────────────────

interface PremiumSectionProps {
  locked: boolean;
  title: string;
  premiumTitle: string;
  premiumDesc: string;
  upgradeLabel: string;
  surfaceColor: string;
  textColor: string;
  children: React.ReactNode;
}

function PremiumSection({ locked, title, premiumTitle, premiumDesc, upgradeLabel, surfaceColor, textColor, children }: PremiumSectionProps) {
  return (
    <>
      <Text style={[styles.sectionLabel, { color: COLORS.textSecondary }]}>
        {title.toUpperCase()}
      </Text>
      <View style={[styles.card, { backgroundColor: surfaceColor, overflow: 'hidden' }]}>
        <View style={locked ? styles.lockedContent : undefined}>
          {children}
        </View>
        {locked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={[styles.lockTitle, { color: textColor }]}>{premiumTitle}</Text>
            <Text style={styles.lockDesc}>{premiumDesc}</Text>
            <Pressable style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>{upgradeLabel}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 1,
    marginTop: SPACING.sm,
    marginBottom: 2,
  },

  emptyCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
  },

  // ── Streak card ──
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  streakBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  streakInfo: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    gap: 2,
  },
  streakName: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  streakFreq: {
    fontSize: TYPOGRAPHY.fontSizeXS,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.md,
  },
  streakFire: { fontSize: 16 },
  streakCount: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  streakNone: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },

  // ── Premium card ──
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  lockedContent: {
    opacity: 0.12,
    pointerEvents: 'none',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
  },
  lockIcon: { fontSize: 28 },
  lockTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textAlign: 'center',
  },
  lockDesc: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  upgradeBtn: {
    marginTop: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
