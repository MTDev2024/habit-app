import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/useThemeStore';
import { useHabitsStore } from '../../store/useHabitsStore';
import { usePremiumStore } from '../../store/usePremiumStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';
import { getLast7DaysStats, getMonthCompletionMap, getDayLabel } from '../../utils/statsUtils';
import { getCurrentStreak } from '../../utils/dateUtils';
import StatGraph from '../../components/StatGraph';
import HeatmapCalendar from '../../components/HeatmapCalendar';

/**
 * Écran Statistiques.
 *
 * Trois sections :
 *  - Streaks    : visibles pour tous (gratuit + premium)
 *  - Graphique  : 7 derniers jours — premium uniquement
 *  - Heatmap    : mois en cours — premium uniquement
 *
 * Les sections premium sont affichées en aperçu flouté + overlay cadenas.
 * Phase 5 : l'overlay ouvrira la modale paywall Google Play Billing.
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

  const dailyHabits = habits.filter((h) => h.frequency === 'daily');
  const last7Stats = getLast7DaysStats(habits);
  const dayLabels = last7Stats.map((d) => getDayLabel(d.date, lang));
  const monthMap = getMonthCompletionMap(habits);

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Titre */}
        <Text style={[styles.title, { color: textColor }]}>{t('stats.title')}</Text>

        {/* ── Section Streaks (visible pour tous) ── */}
        <View style={[styles.card, { backgroundColor: surfaceColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            {t('stats.streakTitle')}
          </Text>
          {dailyHabits.length === 0 ? (
            <Text style={styles.emptyText}>{t('today.noHabits')}</Text>
          ) : (
            dailyHabits.map((habit) => {
              const streak = getCurrentStreak(habit.completedDates);
              return (
                <View key={habit.id} style={styles.streakRow}>
                  {/* Indicateur couleur catégorie */}
                  <View style={[styles.streakDot, { backgroundColor: habit.color }]} />
                  <Text style={[styles.streakName, { color: textColor }]} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakEmoji}>{streak > 0 ? '🔥' : '—'}</Text>
                    {streak > 0 && (
                      <Text style={[styles.streakCount, { color: habit.color }]}>
                        {t('stats.streakDays', { count: streak })}
                      </Text>
                    )}
                    {streak === 0 && (
                      <Text style={styles.streakNone}>{t('stats.streakNone')}</Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* ── Section Graphique 7 jours (premium) ── */}
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

        {/* ── Section Heatmap mois (premium) ── */}
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

// ── Composant wrapper premium ────────────────────────────────────────────────

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

function PremiumSection({
  locked,
  title,
  premiumTitle,
  premiumDesc,
  upgradeLabel,
  surfaceColor,
  textColor,
  children,
}: PremiumSectionProps) {
  return (
    <View style={[styles.card, { backgroundColor: surfaceColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>

      {/* Contenu — flouté si verrouillé */}
      <View style={locked ? styles.lockedContent : undefined}>
        {children}
      </View>

      {/* Overlay verrou pour les users gratuits */}
      {locked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>{premiumTitle}</Text>
          <Text style={styles.lockDesc}>{premiumDesc}</Text>
          {/* Phase 5 : ouvre la modale Google Play Billing */}
          <Pressable style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>{upgradeLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginTop: SPACING.sm,
  },

  // ── Cards ──
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    overflow: 'hidden', // pour que l'overlay soit clippé dans la card
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  // ── Streaks ──
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    gap: SPACING.sm,
  },
  streakDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  streakName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakEmoji: { fontSize: 16 },
  streakCount: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  streakNone: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
  },

  // ── Premium lock ──
  lockedContent: {
    opacity: 0.15,
    pointerEvents: 'none',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  lockIcon: { fontSize: 32 },
  lockTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
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
