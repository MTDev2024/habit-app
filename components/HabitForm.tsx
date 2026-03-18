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
}

interface HabitFormProps {
  // Valeurs initiales (mode édition) — défaut : health + daily
  initialValues?: Partial<HabitFormValues>;
  // Label du bouton de soumission (varie selon création / édition)
  submitLabel: string;
  // Callback appelé après validation réussie
  onSubmit: (values: HabitFormValues) => void;
}

const MAX_NAME_LENGTH = 50;

/**
 * Formulaire réutilisable pour la création et l'édition d'une habitude.
 *
 * Utilisé dans :
 *   - app/habit/new.tsx  (création)
 *   - app/habit/[id].tsx (édition — Phase 2b)
 *
 * Gère :
 *   - Saisie du nom avec compteur de caractères
 *   - Sélection de catégorie avec couleur associée
 *   - Toggle fréquence quotidienne / hebdomadaire
 *   - Validation inline avant soumission
 */
export default function HabitForm({ initialValues, submitLabel, onSubmit }: HabitFormProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  // ── État local du formulaire ──────────────────────────────────────────────
  const [name, setName] = useState(initialValues?.name ?? '');
  const [category, setCategory] = useState<CategoryKey>(initialValues?.category ?? 'health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(initialValues?.frequency ?? 'daily');
  const [nameError, setNameError] = useState('');

  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const surfaceColor = isDarkMode ? COLORS.surfaceDark : COLORS.surface;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;
  const selectedCategory = CATEGORIES.find((c) => c.key === category)!;

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setNameError(t('habit.nameRequired'));
      return false;
    }
    if (trimmed.length < 2) {
      setNameError(t('habit.nameTooShort'));
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      category,
      frequency,
    });
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────
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

        {/* ── Champ Nom ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>{t('habit.nameLabel')}</Text>
          <View style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder={t('habit.namePlaceholder')}
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError(''); // efface l'erreur à la saisie
              }}
              maxLength={MAX_NAME_LENGTH}
              returnKeyType="done"
              autoFocus
            />
            {/* Compteur de caractères */}
            <Text style={styles.counter}>
              {t('habit.nameCounter', { count: name.length })}
            </Text>
          </View>
          {/* Message d'erreur inline */}
          {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
        </View>

        {/* ── Sélecteur de catégorie ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>{t('habit.categoryLabel')}</Text>
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
                    style={[
                      styles.categoryLabel,
                      { color: isSelected ? '#FFFFFF' : cat.color },
                    ]}
                    numberOfLines={2}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Toggle fréquence ── */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: textColor }]}>{t('habit.frequencyLabel')}</Text>
          <View style={[styles.toggleGroup, { backgroundColor: surfaceColor }]}>
            {(['daily', 'weekly'] as const).map((freq) => {
              const isActive = frequency === freq;
              return (
                <Pressable
                  key={freq}
                  style={[
                    styles.toggleBtn,
                    isActive && { backgroundColor: selectedCategory.color },
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      { color: isActive ? '#FFFFFF' : COLORS.textSecondary },
                    ]}
                  >
                    {t(`habit.${freq}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Bouton de soumission ── */}
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

  // ── Champs ──
  field: { gap: SPACING.xs },
  label: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
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
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSizeMD,
    paddingVertical: 4,
  },
  counter: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    color: COLORS.textSecondary,
  },
  error: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: '#E53935',
    marginTop: 2,
  },

  // ── Catégories ──
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

  // ── Fréquence ──
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

  // ── Soumission ──
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
