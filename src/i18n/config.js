import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

const resources = {
  ar: { translation: ar },
  fr: { translation: fr }
};

const savedLanguage = localStorage.getItem('app_language') || 'ar';

export const updateDocumentDirection = (lang) => {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  if (dir === 'rtl') {
    document.documentElement.classList.add('rtl');
    document.documentElement.classList.remove('ltr');
  } else {
    document.documentElement.classList.add('ltr');
    document.documentElement.classList.remove('rtl');
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

updateDocumentDirection(savedLanguage);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app_language', lng);
  updateDocumentDirection(lng);
});

export default i18n;
