import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import fr from '../locales/fr.json';
import en from '../locales/en.json';

/**
 * Configuration de l'internationalisation (i18n).
 *
 * Fonctionnement :
 * 1. `expo-localization` lit la langue configurée sur le téléphone (ex: "fr-FR", "en-US")
 * 2. i18next sélectionne automatiquement la bonne traduction
 * 3. Si la langue n'est pas supportée, on tombe sur le fallback : "fr"
 *
 * Pour utiliser dans un composant :
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation();
 *   <Text>{t('profile.darkMode')}</Text>
 */

// Langue du téléphone — getLocales() retourne un tableau trié par préférence
const deviceLanguage = getLocales()[0]?.languageCode ?? 'fr';

i18n
  .use(initReactI18next) // connecte i18next aux hooks React
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: deviceLanguage,       // langue détectée automatiquement
    fallbackLng: 'fr',         // si langue inconnue → français
    interpolation: {
      escapeValue: false,      // React échappe déjà les valeurs, pas besoin de double-échappement
    },
    compatibilityJSON: 'v4',   // format JSON compatible React Native (pas de pluriels complexes)
  });

export default i18n;
