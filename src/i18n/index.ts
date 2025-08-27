import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';

import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = { en: { translation: en }, ar: { translation: ar } } as const;

export function setupI18n() {
  const locales = RNLocalize.getLocales();
  const deviceLang = locales && locales.length > 0 ? locales[0].languageCode : 'en';
  const lng = deviceLang === 'ar' ? 'ar' : 'en';

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(lng === 'ar');
}

export function toggleLanguage() {
  const next = i18n.language === 'ar' ? 'en' : 'ar';
  i18n.changeLanguage(next);
  I18nManager.forceRTL(next === 'ar');
}

export default i18n;
