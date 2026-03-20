import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CATEGORIES, CategoryKey } from '../constants/categories';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../constants/app';
import { useThemeStore } from '../store/useThemeStore';

// ── Types ────────────────────────────────────────────────────────────────────

export interface HabitFormValues {
  name: string;
  category: CategoryKey;
  frequency: 'daily' | 'weekly';
  weekDays: number[];
  description: string;
  reminderTime: string; // "HH:MM" ou "" si pas de rappel
}

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>;
  submitLabel: string;
  onSubmit: (values: HabitFormValues) => void;
}

const MAX_NAME_LENGTH = 50;
const MAX_DESC_LENGTH = 200;

// Créneaux horaires disponibles pour le rappel (toutes les 30 min)
const TIME_SLOTS: string[] = [];
for (let h = 0; h < 24; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

/**
 * Formulaire réutilisable pour la création et l'édition d'une habitude.
 *
 * Champs :
 *   - Nom (obligatoire, 50 car. max)
 *   - Description (optionnelle, 200 car. max)
 *   - Catégorie (avec couleur)
 *   - Fréquence daily / weekly + jours de la semaine si weekly
 *   - Horaire de rappel — UI Phase 2b, fonctionnel en Phase 4 (notifications)
 */
export default function HabitForm({ initialValues, submitLabel, onSubmit }: HabitFormProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [category, setCategory] = useState<CategoryKey>(initialValues?.category ?? 'health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(initialValues?.frequency ?? 'daily');
  const [weekDays, setWeekDays] = useState<number[]>(initialValues?.weekDays ?? []);
  const [reminderTime, setReminderTime] = useState(initialValues?.reminderTime ?? '');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [nameError, setNameError] = useState('');
  const [weekDaysError, setWeekDaysError] = useState('');

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const selectedCategory = CATEGORIES.find((c) => c.key === category)!;

  const toggleDay = (dayIndex: number) => {
    setWeekDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
    if (weekDaysError) setWeekDaysError('');
  };

  const validate = (): boolean => {
    const trimmed = name.trim();
    if (trimmed.length === 0) { setNameError(t('habit.nameRequired')); return false; }
    if (trimmed.length < 2) { setNameError(t('habit.nameTooShort')); return false; }
    setNameError('');
    if (frequency === 'weekly' && weekDays.length === 0) {
      setWeekDaysError(t('habit.weekDaysRequired')); return false;
    }
    setWeekDaysError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      frequency,
      weekDays: frequency === 'weekly' ? weekDays : [],
      reminderTime,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bgColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Nom ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.nameLabel')}</Text>
          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder={t('habit.namePlaceholder')}
              placeholderTextColor={COLORS.textLight}
              value={name}
              onChangeText={(text) => { setName(text); if (nameError) setNameError(''); }}
              maxLength={MAX_NAME_LENGTH}
              returnKeyType="done"
              autoFocus
            />
            <Text style={styles.counter}>{t('habit.nameCounter', { count: name.length })}</Text>
          </View>
          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
        </View>

        {/* ── Description ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.descriptionLabel')}</Text>
          <View style={[styles.inputWrapper, styles.textareaWrapper, { backgroundColor: surfaceColor, borderColor }]}>
            <TextInput
              style={[styles.input, styles.textarea, { color: textColor }]}
              placeholder={t('habit.descriptionPlaceholder')}
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, MAX_DESC_LENGTH))}
              maxLength={MAX_DESC_LENGTH}
              multiline
              numberOfLines={3}
              returnKeyType="default"
            />
          </View>
          <Text style={[styles.descCounter, { color: COLORS.textLight }]}>
            {description.length}/{MAX_DESC_LENGTH}
          </Text>
        </View>

        {/* ── Catégorie ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.categoryLabel')}</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = cat.key === category;
              return (
                <Pressable
                  key={cat.key}
                  style={[
                    styles.categoryBtn,
                    { borderColor: cat.color },
                    isSelected && { backgroundColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[styles.categoryLabel, { color: isSelected ? '#FFFFFF' : cat.color }]}
                    numberOfLines={2}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Fréquence ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.frequencyLabel')}</Text>
          <View style={[styles.toggleGroup, { backgroundColor: surfaceColor }]}>
            {(['daily', 'weekly'] as const).map((freq) => {
              const isActive = frequency === freq;
              return (
                <Pressable
                  key={freq}
                  style={[styles.toggleBtn, isActive && { backgroundColor: selectedCategory.color }]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[styles.toggleText, { color: isActive ? '#FFFFFF' : COLORS.textSecondary }]}>
                    {t(`habit.${freq}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Jours de la semaine ── */}
        {frequency === 'weekly' && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.weekDaysLabel')}</Text>
            <View style={styles.daysRow}>
              {(t('habit.days', { returnObjects: true }) as string[]).map((dayLabel, index) => {
                const isSelected = weekDays.includes(index);
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.dayBtn,
                      { borderColor: selectedCategory.color },
                      isSelected && { backgroundColor: selectedCategory.color },
                    ]}
                    onPress={() => toggleDay(index)}
                  >
                    <Text style={[styles.dayLabel, { color: isSelected ? '#FFFFFF' : selectedCategory.color }]}>
                      {dayLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {weekDaysError ? <Text style={styles.error}>{weekDaysError}</Text> : null}
          </View>
        )}

        {/* ── Horaire de rappel ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: COLORS.textSecondary }]}>{t('habit.reminderLabel')}</Text>
          <Text style={[styles.reminderHint, { color: COLORS.textSecondary }]}>{t('habit.reminderHint')}</Text>

          <Pressable
            style={[
              styles.reminderToggle,
              { backgroundColor: surfaceColor, borderColor },
              reminderTime !== '' && { borderColor: selectedCategory.color },
            ]}
            onPress={() => {
              if (reminderTime !== '') {
                setReminderTime('');
                setShowTimePicker(false);
              } else {
                setReminderTime('08:00');
                setShowTimePicker(true);
              }
            }}
          >
            <Text style={{ fontSize: 18 }}>⏰</Text>
            <Text style={[styles.reminderToggleText, { color: reminderTime !== '' ? selectedCategory.color : COLORS.textSecondary }]}>
              {reminderTime !== '' ? `${t('habit.reminderAt')} ${reminderTime}` : t('habit.reminderNone')}
            </Text>
            <Text style={[styles.reminderChevron, { color: COLORS.textSecondary }]}>
              {reminderTime !== '' ? '✕' : '+'}
            </Text>
          </Pressable>

          {/* Sélecteur d'heure horizontal */}
          {showTimePicker && reminderTime !== '' && (
            <View style={[styles.timePicker, { backgroundColor: surfaceColor, borderColor }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeList}>
                {TIME_SLOTS.map((slot) => {
                  const isActive = slot === reminderTime;
                  return (
                    <Pressable
                      key={slot}
                      style={[
                        styles.timeSlot,
                        { borderColor },
                        isActive && { backgroundColor: selectedCategory.color, borderColor: selectedCategory.color },
                      ]}
                      onPress={() => setReminderTime(slot)}
                    >
                      <Text style={[styles.timeSlotText, { color: isActive ? '#FFFFFF' : textColor }]}>
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* ── Bouton soumission ── */}
        <Pressable
          style={({ pressed }) => [
            styles.submitBtn,
            { backgroundColor: selectedCategory.color },
            pressed && styles.submitPressed,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>{submitLabel}</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  field: { gap: SPACING.xs },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  textareaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm + 2,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizeMD,
    paddingVertical: 4,
  },
  textarea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
  },
  descCounter: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    textAlign: 'right',
    marginTop: 2,
  },
  error: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.error,
    marginTop: 2,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    minWidth: '45%',
    flexShrink: 1,
  },
  categoryIcon: { fontSize: 16 },
  categoryLabel: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
    flexShrink: 1,
  },

  toggleGroup: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm + 2,
  },
  toggleText: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.xs,
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },

  reminderHint: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    marginBottom: 2,
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  reminderToggleText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizeMD,
  },
  reminderChevron: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
  timePicker: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  timeList: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  timeSlot: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  },

  submitBtn: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  submitPressed: { opacity: 0.88 },
  submitText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
