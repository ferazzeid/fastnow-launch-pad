import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enForms from './locales/en/forms.json';
import arCommon from './locales/ar/common.json';
import arNavigation from './locales/ar/navigation.json';
import arForms from './locales/ar/forms.json';
import ruCommon from './locales/ru/common.json';
import ruNavigation from './locales/ru/navigation.json';
import ruForms from './locales/ru/forms.json';
import deCommon from './locales/de/common.json';
import deNavigation from './locales/de/navigation.json';
import deForms from './locales/de/forms.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    forms: enForms,
  },
  ar: {
    common: arCommon,
    navigation: arNavigation,
    forms: arForms,
  },
  ru: {
    common: ruCommon,
    navigation: ruNavigation,
    forms: ruForms,
  },
  de: {
    common: deCommon,
    navigation: deNavigation,
    forms: deForms,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;