import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load translations
const loadTranslations = (lang) => {
  const filePath = path.join(__dirname, `../src/i18n/locales/${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Language configuration
const languages = {
  en: { name: 'English', flag: '🇬🇧', path: '' },
  fr: { name: 'Français', flag: '🇫🇷', path: 'fr.html' },
  ja: { name: '日本語', flag: '🇯🇵', path: 'ja.html' }
};

const baseUrl = 'https://firestar300.github.io/wp-kakitai/landing';

/**
 * Generate hreflang links
 */
function generateHreflangLinks(currentLang) {
  const links = [];

  for (const [lang, config] of Object.entries(languages)) {
    const href = config.path ? `${baseUrl}/${config.path}` : baseUrl;
    links.push(`  <link rel="alternate" hreflang="${lang}" href="${href}">`);
  }

  // Add x-default
  links.push(`  <link rel="alternate" hreflang="x-default" href="${baseUrl}">`);

  return links.join('\n');
}

/**
 * Translate meta tags
 */
function translateMetaTags(dom, translations, lang) {
  const doc = dom.window.document;

  // Title
  const title = doc.querySelector('title');
  if (title) {
    title.textContent = `Kakitai - ${translations.hero.title.line1} ${translations.hero.title.line2}`;
  }

  // Meta description
  const metaDescription = doc.querySelector('meta[name="description"]');
  if (metaDescription) {
    // Remove HTML tags from description
    const cleanDescription = translations.hero.description.replace(/<[^>]*>/g, '');
    metaDescription.setAttribute('content', `Kakitai - ${cleanDescription}`);
  }

  // Open Graph title
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', `Kakitai - ${translations.hero.title.line1} ${translations.hero.title.line2}`);
  }

  // Open Graph description
  const ogDescription = doc.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    const cleanDescription = translations.hero.description.replace(/<[^>]*>/g, '');
    ogDescription.setAttribute('content', cleanDescription);
  }

  // Twitter title
  const twitterTitle = doc.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', `Kakitai - ${translations.hero.title.line1} ${translations.hero.title.line2}`);
  }

  // Twitter description
  const twitterDescription = doc.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    const cleanDescription = translations.hero.description.replace(/<[^>]*>/g, '');
    twitterDescription.setAttribute('content', cleanDescription);
  }

  // Set html lang attribute
  doc.documentElement.setAttribute('lang', lang);
}

/**
 * Get nested value from object by path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Translate content with data-i18n attributes
 */
function translateContent(dom, translations) {
  const doc = dom.window.document;

  // Translate elements with data-i18n
  const elements = doc.querySelectorAll('[data-i18n]');

  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedValue(translations, key);

    if (translation) {
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
}

/**
 * Remove i18n scripts and unnecessary attributes
 */
function cleanupForStatic(dom) {
  const doc = dom.window.document;

  // Remove data-i18n attributes (no longer needed in static version)
  const elements = doc.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    el.removeAttribute('data-i18n');
    el.removeAttribute('data-i18n-html');
  });

  // Note: We keep the script tag for main.js as it still handles animations, etc.
  // The i18n system will still work for client-side language switching
}

/**
 * Add language indicator to body
 */
function addLanguageIndicator(dom, lang) {
  const doc = dom.window.document;
  doc.body.setAttribute('data-lang', lang);
}

/**
 * Generate static HTML for a language
 */
function generateLanguagePage(templateHtml, lang) {
  const translations = loadTranslations(lang);
  const dom = new JSDOM(templateHtml);

  // Translate meta tags
  translateMetaTags(dom, translations, lang);

  // Add hreflang links
  const hreflangLinks = generateHreflangLinks(lang);
  const head = dom.window.document.querySelector('head');
  const metaCharset = head.querySelector('meta[charset]');

  // Insert hreflang after charset
  const hreflangFragment = JSDOM.fragment(hreflangLinks);
  metaCharset.after(hreflangFragment);

  // Translate content
  translateContent(dom, translations);

  // Add language indicator
  addLanguageIndicator(dom, lang);

  // Cleanup (remove data-i18n attributes)
  cleanupForStatic(dom);

  return dom.serialize();
}

/**
 * Main generation function
 */
function generatePages() {
  console.log('🌍 Generating multilingual pages...\n');

  const distDir = path.join(__dirname, '../../dist');
  const templatePath = path.join(distDir, 'index.html');

  // Check if dist/index.html exists
  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Read template
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // Generate English version (update index.html)
  console.log('📄 Generating index.html (English)...');
  const enHtml = generateLanguagePage(templateHtml, 'en');
  fs.writeFileSync(templatePath, enHtml, 'utf-8');
  console.log('✅ index.html generated');

  // Generate French version
  console.log('📄 Generating fr.html (Français)...');
  const frHtml = generateLanguagePage(templateHtml, 'fr');
  const frPath = path.join(distDir, 'fr.html');
  fs.writeFileSync(frPath, frHtml, 'utf-8');
  console.log('✅ fr.html generated');

  // Generate Japanese version
  console.log('📄 Generating ja.html (日本語)...');
  const jaHtml = generateLanguagePage(templateHtml, 'ja');
  const jaPath = path.join(distDir, 'ja.html');
  fs.writeFileSync(jaPath, jaHtml, 'utf-8');
  console.log('✅ ja.html generated');

  console.log('\n🎉 All pages generated successfully!');
  console.log(`\n📍 Pages created:`);
  console.log(`   - ${templatePath}`);
  console.log(`   - ${frPath}`);
  console.log(`   - ${jaPath}`);
}

// Run generation
generatePages();
