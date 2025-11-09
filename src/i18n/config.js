import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enForm from './locales/en/form.json';
import esCommon from './locales/es/common.json';
import esForm from './locales/es/form.json';
import frCommon from './locales/fr/common.json';
import frForm from './locales/fr/form.json';
import hiCommon from './locales/hi/common.json';
import hiForm from './locales/hi/form.json';
import guCommon from './locales/gu/common.json';
import guForm from './locales/gu/form.json';

const resources = {
  en: {
    common: enCommon,
    form: enForm,
  },
  es: {
    common: esCommon,
    form: esForm,
  },
  fr: {
    common: frCommon,
    form: frForm,
  },
  hi: {
    common: hiCommon,
    form: hiForm,
  },
  gu: {
    common: guCommon,
    form: guForm,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'form'],
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
