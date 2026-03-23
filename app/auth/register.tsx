import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path } from 'react-native-svg';
import { registerWithEmail } from '../../services/auth';
import { useThemeStore } from '../../store/useThemeStore';
import { APP_NAME, COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants/app';

/**
 * Icône de l'app : cercle primaire avec un ✓ blanc.
 */
function AppIcon() {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Circle cx={36} cy={36} r={36} fill={COLORS.primary} />
      <Path
        d="M22 36 L31 45 L50 27"
        stroke="#FFFFFF"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

/**
 * Traduit les codes d'erreur Firebase en clés i18n lisibles.
 */
function getErrorKey(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'auth.errorInvalidEmail';
    case 'auth/email-already-in-use':
      return 'auth.errorEmailInUse';
    case 'auth/weak-password':
      return 'auth.errorWeakPassword';
    default:
      return 'auth.errorGeneric';
  }
}

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  const bgColor = isDarkMode ? COLORS.backgroundDark : COLORS.background;
  const cardColor = isDarkMode ? COLORS.surfaceDark : '#fff';
  const textColor = isDarkMode ? COLORS.textDark : COLORS.text;
  const inputBg = isDarkMode ? '#2A2A2A' : COLORS.surface;
  const borderColor = isDarkMode ? COLORS.borderDark : COLORS.border;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password);
    } catch (e: any) {
      setError(t(getErrorKey(e.code)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bgColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── En-tête : icône + nom + tagline ── */}
        <View style={styles.header}>
          <AppIcon />
          <Text style={[styles.appName, { color: textColor }]}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{t('auth.tagline')}</Text>
        </View>

        {/* ── Carte formulaire ── */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <Text style={[styles.screenTitle, { color: textColor }]}>{t('auth.registerTitle')}</Text>

          {/* Champ email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.emailLabel')}</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor }]}
              placeholder={t('auth.emailPlaceholder')}
              placeholderTextColor={COLORS.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          {/* Champ mot de passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.passwordLabel')}</Text>
            <TextInput
              style={[styles.input, { color: textColor, backgroundColor: inputBg, borderColor }]}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor={COLORS.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />
          </View>

          {/* Message d'erreur */}
          {error && <Text style={styles.error}>{error}</Text>}

          {/* Bouton inscription */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>{t('auth.registerBtn')}</Text>
            }
          </TouchableOpacity>
        </View>

        {/* ── Lien connexion ── */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>{t('auth.alreadyAccount')} </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.switchLink}>{t('auth.signInLink')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    gap: SPACING.lg,
  },

  // ── En-tête ──
  header: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSizeXXL,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    letterSpacing: -0.5,
    marginTop: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSizeSM,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // ── Carte formulaire ──
  card: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  screenTitle: {
    fontSize: TYPOGRAPHY.fontSizeLG,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  // ── Champs ──
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSizeXS,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: TYPOGRAPHY.fontSizeMD,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  error: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },

  // ── Bouton ──
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: SPACING.xs,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: TYPOGRAPHY.fontSizeMD,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    letterSpacing: 0.3,
  },

  // ── Lien connexion ──
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSizeSM,
  },
  switchLink: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSizeSM,
    fontWeight: TYPOGRAPHY.fontWeightBold,
  },
});
