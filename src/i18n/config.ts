import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    te: { translation: te },
    kn: { translation: kn },
    ta: { translation: ta },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
