import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/app';
import { getCurrentMonthKeys, getWeekdayEU } from '../utils/statsUtils';

interface HeatmapCalendarProps {
  // Map date (YYYY-MM-DD) → taux de complétion (0–1)
  completionMap: Map<string, number>;
  color?: string;
  lang?: string;
}

const CELL_SIZE = 34;
const CELL_GAP = 4;

// Labels des jours (semaine commence lundi)
const DAY_LABELS_FR = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const DAY_LABELS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * Retourne la couleur d'une cellule selon le taux de complétion.
 * Style "GitHub contributions" : de gris (vide) à bleu intense (100%).
 */
const getCellColor = (rate: number, baseColor: string, isFuture: boolean): string => {
  if (isFuture) return 'transparent';
  if (rate === 0) return COLORS.border;
  if (rate < 0.5) return `${baseColor}55`;   // ~33% opacité
  if (rate < 0.75) return `${baseColor}99`;  // ~60% opacité
  if (rate < 1) return `${baseColor}cc`;     // ~80% opacité
  return baseColor;                           // 100% — couleur pleine
};

/**
 * Heatmap calendrier du mois en cours, style GitHub contributions.
 *
 * Chaque case = un jour du mois.
 * La couleur reflète le taux de complétion de ce jour :
 *   gris → bleu pâle → bleu → bleu foncé → couleur principale (100%)
 */
export default function HeatmapCalendar({
  completionMap,
  color = COLORS.primary,
  lang = 'fr',
}: HeatmapCalendarProps) {
  const dayLabels = lang.startsWith('en') ? DAY_LABELS_EN : DAY_LABELS_FR;
  const monthKeys = getCurrentMonthKeys();
  const today = new Date().toISOString().split('T')[0];

  // Nom du mois localisé
  const now = new Date();
  const monthName = now.toLocaleDateString(lang.startsWith('en') ? 'en-US' : 'fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  // Construction de la grille : tableau de semaines, chaque semaine = 7 cases
  // Les jours vides avant le 1er du mois sont des null
  const firstDayOfWeek = getWeekdayEU(monthKeys[0]); // 0=lun, 6=dim
  const grid: (string | null)[] = [
    ...Array(firstDayOfWeek).fill(null), // cellules vides avant le 1er
    ...monthKeys,
  ];
  // Compléter la dernière semaine
  while (grid.length % 7 !== 0) grid.push(null);

  // Découpage en semaines
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {/* Titre du mois */}
      <Text style={styles.monthTitle}>{monthName}</Text>

      {/* En-têtes des jours */}
      <View style={styles.row}>
        {dayLabels.map((label) => (
          <View key={label} style={styles.cell}>
            <Text style={styles.dayHeader}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Grille des semaines */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((date, di) => {
            if (!date) {
              // Cellule vide (avant le 1er du mois)
              return <View key={`empty-${wi}-${di}`} style={styles.cell} />;
            }

            const rate = completionMap.get(date) ?? 0;
            const isFuture = date > today;
            const isToday = date === today;
            const cellColor = getCellColor(rate, color, isFuture);
            const dayNum = parseInt(date.split('-')[2], 10);

            return (
              <View key={date} style={styles.cell}>
                <View
                  style={[
                    styles.square,
                    { backgroundColor: isFuture ? 'transparent' : cellColor },
                    isToday && styles.todayBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      isFuture && styles.futureText,
                      rate === 1 && !isFuture && styles.fullDayText,
                    ]}
                  >
                    {dayNum}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      {/* Légende */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>0%</Text>
        {[0, 0.4, 0.7, 1].map((r) => (
          <View
            key={r}
            style={[
              styles.legendSquare,
              { backgroundColor: r === 0 ? COLORS.border : getCellColor(r + 0.01, color, false) },
            ]}
          />
        ))}
        <Text style={styles.legendLabel}>100%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: CELL_GAP,
  },
  monthTitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    textTransform: 'capitalize',
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeader: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  square: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayNum: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },
  futureText: {
    color: COLORS.border,
  },
  fullDayText: {
    color: '#FFFFFF',
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  // Légende en bas
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
    justifyContent: 'flex-end',
  },
  legendSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});
