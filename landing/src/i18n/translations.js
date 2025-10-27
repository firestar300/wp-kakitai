import en from './locales/en.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';

// Available translations
const translations = {
  en,
  fr,
  ja
};

// Language configuration
const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  fr: { name: 'Français', flag: '🇫🇷' },
  ja: { name: '日本語', flag: '🇯🇵' }
};

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'wp-kakitai-lang';

/**
 * Get user's preferred language
 */
function getPreferredLanguage() {
  // Check if we're on a static language page (check body data-lang attribute)
  const bodyLang = document.body.getAttribute('data-lang');
  if (bodyLang && translations[bodyLang]) {
    return bodyLang;
  }

  // Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) {
    return stored;
  }

  // Detect browser language
  const browserLang = navigator.language.toLowerCase();

  // Check exact match
  if (translations[browserLang]) {
    return browserLang;
  }

  // Check language prefix (e.g., 'en-US' -> 'en')
  const langPrefix = browserLang.split('-')[0];
  if (translations[langPrefix]) {
    return langPrefix;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Set current language
 */
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language '${lang}' not found, falling back to ${DEFAULT_LANGUAGE}`);
    lang = DEFAULT_LANGUAGE;
  }

  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;

  return lang;
}

/**
 * Get translation value by key path
 * Example: t('hero.title.line1')
 */
function t(key, lang = null) {
  if (!lang) {
    lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
  }

  const translation = translations[lang];
  if (!translation) {
    return key;
  }

  // Navigate through nested keys
  const keys = key.split('.');
  let value = translation;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if not found
    }
  }

  return value;
}

/**
 * Update all translatable elements on the page
 */
function updatePageTranslations(lang) {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key, lang);

    // Check if element should use innerHTML or textContent
    if (element.hasAttribute('data-i18n-html')) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = t(key, lang);
  });

  // Update aria-label attributes
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria-label');
    element.setAttribute('aria-label', t(key, lang));
  });

  // Update title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    element.title = t(key, lang);
  });

  // Update document language
  document.documentElement.lang = lang;
}

/**
 * Initialize i18n system
 */
function initI18n() {
  const currentLang = getPreferredLanguage();
  setLanguage(currentLang);
  updatePageTranslations(currentLang);

  return currentLang;
}

/**
 * Change language and update page
 */
function changeLanguage(lang) {
  setLanguage(lang);
  updatePageTranslations(lang);

  // Dispatch custom event for other components
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Get current language
 */
function getCurrentLanguage() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
}

export {
  translations,
  languages,
  DEFAULT_LANGUAGE,
  initI18n,
  changeLanguage,
  getCurrentLanguage,
  t
};
