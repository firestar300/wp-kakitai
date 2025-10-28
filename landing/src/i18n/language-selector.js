import { languages, getCurrentLanguage, changeLanguage } from './translations.js';

/**
 * Get language page URL
 */
function getLanguageUrl(lang) {
  const currentPath = window.location.pathname;
  const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);

  if (lang === 'en') {
    return basePath + 'index.html';
  } else if (lang === 'fr') {
    return basePath + 'fr.html';
  } else if (lang === 'ja') {
    return basePath + 'ja.html';
  }
  return basePath;
}

/**
 * Create language selector dropdown
 */
export function createLanguageSelector() {
  const currentLang = getCurrentLanguage();
  const currentLanguage = languages[currentLang];

  const selector = document.createElement('div');
  selector.className = 'language-selector relative';
  selector.innerHTML = `
    <button
      class="language-selector-button flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Select language"
      aria-expanded="false"
      aria-haspopup="true"
      type="button"
    >
      <span class="text-xl">${currentLanguage.flag}</span>
      <span class="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">${currentLanguage.name}</span>
      <svg aria-hidden="true" focusable="false" class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <nav class="language-selector-dropdown hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50" aria-label="Language selection">
      ${Object.entries(languages).map(([code, lang]) => `
        <a
          href="${getLanguageUrl(code)}"
          class="language-option flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${code === currentLang ? 'bg-primary-50 dark:bg-primary-900/30' : ''}"
          hreflang="${code}"
          lang="${code}"
          ${code === currentLang ? 'aria-current="page"' : ''}
        >
          <span class="text-xl">${lang.flag}</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">${lang.name}</span>
          ${code === currentLang ? '<svg aria-hidden="true" focusable="false" class="w-4 h-4 text-primary-600 dark:text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
        </a>
      `).join('')}
    </nav>
  `;

  return selector;
}

/**
 * Attach event listeners to selector
 */
function attachSelectorEvents(selector) {
  const button = selector.querySelector('.language-selector-button');
  const dropdown = selector.querySelector('.language-selector-dropdown');
  const arrow = button.querySelector('svg');

  function openDropdown() {
    dropdown.classList.remove('hidden');
    button.setAttribute('aria-expanded', 'true');
    arrow.style.transform = 'rotate(180deg)';
  }

  function closeDropdown() {
    dropdown.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
    arrow.style.transform = 'rotate(0deg)';
  }

  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('hidden');

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Close dropdown when clicking outside
  const closeOnOutsideClick = (e) => {
    if (!selector.contains(e.target)) {
      closeDropdown();
    }
  };
  document.addEventListener('click', closeOnOutsideClick);

  // Handle link clicks
  selector.querySelectorAll('.language-option').forEach(link => {
    link.addEventListener('click', (e) => {
      closeDropdown();

      // In dev mode (localhost), prevent default and use dynamic content switching
      // In production (static pages exist), let native navigation work
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        e.preventDefault();
        const lang = link.getAttribute('lang');

        // Change language dynamically in dev mode
        changeLanguage(lang);

        // Update desktop selector UI
        const container = document.getElementById('language-selector-container');
        if (container) {
          container.innerHTML = '';
          const newSelector = createLanguageSelector();
          container.appendChild(newSelector);
          attachSelectorEvents(newSelector);
        }

        // Update mobile selector UI
        const mobileContainer = document.getElementById('mobile-language-selector-container');
        if (mobileContainer) {
          mobileContainer.innerHTML = '';
          const newMobileSelector = createLanguageSelector();
          mobileContainer.appendChild(newMobileSelector);
          attachSelectorEvents(newMobileSelector);
        }
      }
      // In production, native <a> navigation works (no preventDefault)
    });
  });
}

/**
 * Initialize language selector functionality
 */
export function initLanguageSelector() {
  // Desktop language selector
  const container = document.getElementById('language-selector-container');
  if (container) {
    const selector = createLanguageSelector();
    container.appendChild(selector);
    attachSelectorEvents(selector);
  }

  // Mobile language selector
  const mobileContainer = document.getElementById('mobile-language-selector-container');
  if (mobileContainer) {
    const mobileSelector = createLanguageSelector();
    mobileContainer.appendChild(mobileSelector);
    attachSelectorEvents(mobileSelector);
  }

  if (!container && !mobileContainer) {
    console.warn('Language selector containers not found');
  }
}
