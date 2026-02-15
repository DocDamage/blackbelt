/**
 * Internationalization (i18n) Configuration
 * 
 * Sets up react-i18next for multi-language support.
 * Currently supports English (en) with infrastructure for additional languages.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

// Detect browser language
const detectLanguage = (): string => {
    const stored = localStorage.getItem('language');
    if (stored) return stored;

    const browserLang = navigator.language.split('-')[0];
    return browserLang || 'en';
};

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
    },
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // React already escapes values
    },
    react: {
        useSuspense: false, // Avoid suspense for simpler loading
    },
});

// Persist language preference
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;

// Type-safe translation keys
export type TranslationKey = keyof typeof en;