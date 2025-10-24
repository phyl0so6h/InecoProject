import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import hy from './locales/hy.json'
import en from './locales/en.json'

const getInitialLanguage = (): string => {
    try {
        const saved = localStorage.getItem('lng');
        if (saved) return saved;
    } catch {}
    return 'hy';
}

i18n
    .use(initReactI18next)
    .init({
        resources: {
        hy: { translation: hy },
        en: { translation: en },
        },
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    })

export default i18n


