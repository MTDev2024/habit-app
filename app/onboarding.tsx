import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, APP_NAME } from '../constants/app';
import { SUGGESTED_HABITS } from '../constants/suggestedHabits';
import { getCategoryByKey } from '../constants/categories';
import { useHabitsStore } from '../store/useHabitsStore';
import { useAuthStore } from '../store/useAuthStore';
import { markOnboardingSeen } from '../services/user';
import { requestNotificationPermissions } from '../services/notifications';
import AppLogo from '../components/AppLogo';

const TOTAL_STEPS = 3;

/**
 * Écran d'onboarding — affiché uniquement au premier lancement.
 * 3 étapes : bienvenue → notifications → sélection d'habitudes.
 */
export default function OnboardingScreen() {
  const { t, i18n } = useTranslation();
  const { addHabit } = useHabitsStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Langue courante pour afficher les noms d'habitudes
  const lang = i18n.language.startsWith('fr') ? 'fr' : 'en';

  function toggleHabit(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleNotifStep() {
    // Demande la permission (silencieux si refusé)
    await requestNotificationPermissions().catch(() => {});
    setStep(2);
  }

  function markSeen() {
    if (!user) return;
    const cacheKey = `hasSeenOnboarding_${user.uid}`;
    // AsyncStorage est immédiat — la navigation ne sera pas bloquée
    AsyncStorage.setItem(cacheKey, 'true').catch(() => {});
    // Firestore en arrière-plan — une erreur réseau ne bloque pas l'utilisateur
    markOnboardingSeen(user.uid).catch(() => {});
  }

  async function handleFinish() {
    markSeen();
    // Ajoute les habitudes sélectionnées au store
    const selected = SUGGESTED_HABITS.filter((h) => selectedIds.has(h.id));
    for (const habit of selected) {
      await addHabit({
        name: habit[lang],
        category: habit.category,
        color: getCategoryByKey(habit.category).color,
        frequency: 'daily',
        weekDays: [],
        completedDates: [],
        isPremiumFeature: false,
        reminderTime: undefined,
      });
    }
    router.replace('/');
  }

  function handleSkip() {
    markSeen();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Indicateur de progression */}
      <View style={styles.progressRow}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <View
            key={i}
            style={[styles.progressDot, i === step && styles.progressDotActive]}
          />
        ))}
      </View>

      {/* ── Écran 1 : Bienvenue ── */}
      {step === 0 && (
        <View style={styles.screen}>
          <View style={styles.centerContent}>
            <AppLogo size={80} bgColor={COLORS.primary} checkColor="#fff" />
            <Text style={styles.appName}>{APP_NAME}</Text>
            <Text style={styles.title}>{t('onboarding.welcomeTitle')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.welcomeSubtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(1)}>
            <Text style={styles.primaryBtnText}>{t('onboarding.welcomeBtn')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Écran 2 : Notifications ── */}
      {step === 1 && (
        <View style={styles.screen}>
          <View style={styles.centerContent}>
            <Text style={styles.emoji}>🔔</Text>
            <Text style={styles.title}>{t('onboarding.notifTitle')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.notifSubtitle')}</Text>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleNotifStep}>
              <Text style={styles.primaryBtnText}>{t('onboarding.notifBtn')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={() => setStep(2)}>
              <Text style={styles.skipText}>{t('onboarding.notifSkip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Écran 3 : Sélection d'habitudes ── */}
      {step === 2 && (
        <View style={styles.screen}>
          <Text style={styles.title}>{t('onboarding.habitsTitle')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.habitsSubtitle')}</Text>

          <ScrollView
            style={styles.habitsList}
            contentContainerStyle={styles.habitsGrid}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {SUGGESTED_HABITS.map((habit) => {
              const selected = selectedIds.has(habit.id);
              const color = getCategoryByKey(habit.category).color;
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitChip,
                    selected && { backgroundColor: color, borderColor: color },
                  ]}
                  onPress={() => toggleHabit(habit.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                  <Text
                    style={[styles.habitName, selected && { color: '#fff', fontWeight: '600' }]}
                    numberOfLines={2}
                  >
                    {habit[lang]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={[styles.primaryBtn, selectedIds.size === 0 && styles.primaryBtnDisabled]}
              onPress={handleFinish}
            >
              <Text style={styles.primaryBtnText}>
                {selectedIds.size > 0
                  ? `${t('onboarding.habitsBtn')} (${selectedIds.size})`
                  : t('onboarding.habitsBtn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
              <Text style={styles.skipText}>{t('onboarding.habitsSkip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  screen: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSizeXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING.sm,
  },

  // ── Liste des habitudes ──
  habitsList: {
    flex: 1,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  habitEmoji: {
    fontSize: 16,
  },
  habitName: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.text,
    maxWidth: 120,
  },

  // ── Boutons ──
  btnGroup: {
    gap: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 0.3,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
});
