/**
 * Dark Mode Management
 */

import { t } from './i18n/translations.js';

const STORAGE_KEY = 'wp-kakitai-theme';

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem(STORAGE_KEY, theme);
  updateNavbarBackground();
}

/**
 * Update navbar background based on current theme and scroll position
 */
function updateNavbarBackground() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const currentScroll = window.pageYOffset;
  const isDark = document.documentElement.classList.contains('dark');

  if (currentScroll > 100) {
    nav.style.background = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 0.95)';
  } else {
    nav.style.background = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 0.8)';
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
}

/**
 * Create dark mode toggle button
 */
function createDarkModeToggle() {
  const isDark = document.documentElement.classList.contains('dark');

  const button = document.createElement('button');
  button.className = 'dark-mode-toggle p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
  button.setAttribute('aria-label', isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode'));

  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode');

  button.innerHTML = isDark
    ? `<svg aria-hidden="true" focusable="false" class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>`
    : `<svg aria-hidden="true" focusable="false" class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>`;

  button.appendChild(span);

  button.addEventListener('click', () => {
    const newTheme = toggleTheme();
    // Update all toggle buttons (desktop and mobile)
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
      updateToggleIcon(btn, newTheme === 'dark');
      // Update aria-label and screen reader text
      const isDark = newTheme === 'dark';
      btn.setAttribute('aria-label', isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode'));
      const srSpan = btn.querySelector('.sr-only');
      if (srSpan) {
        srSpan.textContent = isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode');
      }
    });
  });

  return button;
}

/**
 * Update toggle icon based on theme
 */
function updateToggleIcon(button, isDark) {
  button.innerHTML = isDark
    ? `<svg aria-hidden="true" focusable="false" class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>`
    : `<svg aria-hidden="true" focusable="false" class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>`;
}

/**
 * Export updateNavbarBackground for use in scroll handler
 */
export { updateNavbarBackground };

/**
 * Initialize dark mode
 */
export function initDarkMode() {
  // Insert toggle button in desktop navbar
  const container = document.getElementById('dark-mode-toggle-container');
  if (container) {
    const toggle = createDarkModeToggle();
    container.appendChild(toggle);
  }

  // Insert toggle button in mobile navbar (next to hamburger menu)
  const mobileContainer = document.getElementById('mobile-dark-mode-toggle-container');
  if (mobileContainer) {
    const mobileToggle = createDarkModeToggle();
    mobileContainer.appendChild(mobileToggle);
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
      // Update all toggle buttons (desktop and mobile)
      document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
        updateToggleIcon(btn, e.matches);
        // Update aria-label and screen reader text
        btn.setAttribute('aria-label', e.matches ? t('nav.switchToLightMode') : t('nav.switchToDarkMode'));
        const srSpan = btn.querySelector('.sr-only');
        if (srSpan) {
          srSpan.textContent = e.matches ? t('nav.switchToLightMode') : t('nav.switchToDarkMode');
        }
      });
    }
  });

  // Listen for language changes to update button labels
  window.addEventListener('languageChanged', () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode'));
      const srSpan = btn.querySelector('.sr-only');
      if (srSpan) {
        srSpan.textContent = isDark ? t('nav.switchToLightMode') : t('nav.switchToDarkMode');
      }
    });
  });
}
