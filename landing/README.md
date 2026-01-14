# Kakitai Landing Page

Landing page for the Kakitai WordPress plugin with SEO-friendly multilingual support.

## Features

- 🌍 **3 Languages**: English, French (Français), Japanese (日本語)
- 🚀 **SEO-Optimized**: Static HTML pages for each language
- 🎨 **Modern Design**: Built with Tailwind CSS and GSAP animations
- 📱 **Responsive**: Works perfectly on all devices
- ⚡ **Fast**: Optimized build with Vite

## Multilingual System

The landing page uses a hybrid approach for optimal SEO and UX:

### SEO Benefits

✅ **Static HTML pages** for each language (index.html, fr.html, ja.html)
✅ **hreflang tags** in all pages for international SEO
✅ **Translated meta tags** (title, description, Open Graph, Twitter Cards)
✅ **Proper lang attributes** on HTML elements
✅ **Crawlable content** for search engines

### User Experience

✅ **Dynamic language switcher** in navigation
✅ **Automatic browser language detection**
✅ **localStorage persistence** for language preference
✅ **Instant switching** without page reload

## Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd landing
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the landing page.

### Build

```bash
npm run build
```

This will:

1. Build the site with Vite
2. Create `.nojekyll` for GitHub Pages
3. **Generate 3 static HTML pages** with translations:
   - `dist/index.html` (English - default)
   - `dist/fr.html` (French)
   - `dist/ja.html` (Japanese)

### Preview Built Site

```bash
npm run preview
```

## Project Structure

```
landing/
├── src/
│   ├── main.js                 # Main JavaScript entry point
│   ├── style.css               # Tailwind CSS
│   └── i18n/
│       ├── translations.js     # i18n system core
│       ├── language-selector.js # Language dropdown component
│       └── locales/
│           ├── en.json         # English translations
│           ├── fr.json         # French translations
│           └── ja.json         # Japanese translations
├── scripts/
│   ├── generate-i18n-pages.js  # Static pages generator
│   └── postbuild.js            # Post-build tasks
├── public/
│   └── wp-kakitai-demo.mp4     # Demo video
├── index.html                  # Main HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json
```

## Adding/Editing Translations

### 1. Edit JSON Files

Translations are stored in `src/i18n/locales/`:

- `en.json` - English
- `fr.json` - French
- `ja.json` - Japanese

Example structure:

```json
{
  "nav": {
    "features": "Features",
    "demo": "Demo"
  },
  "hero": {
    "title": {
      "line1": "Kanji to Furigana,",
      "line2": "Instantly"
    }
  }
}
```

### 2. Use in HTML

Add `data-i18n` attribute with the translation key:

```html
<h1 data-i18n="hero.title.line1">Kanji to Furigana,</h1>
```

For HTML content (like spans, links), add `data-i18n-html`:

```html
<p data-i18n="hero.description" data-i18n-html>
  Text with <span>HTML</span>
</p>
```

### 3. Rebuild

After editing translations:

```bash
npm run build
```

The static pages will be automatically regenerated with new translations.

## SEO Configuration

### hreflang Links

Automatically added to all pages:

```html
<link rel="alternate" hreflang="en" href="https://.../">
<link rel="alternate" hreflang="fr" href="https://.../fr.html">
<link rel="alternate" hreflang="ja" href="https://.../ja.html">
<link rel="alternate" hreflang="x-default" href="https://.../">
```

### Meta Tags

Each page has translated:

- `<title>`
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta name="twitter:title">`
- `<meta name="twitter:description">`

### URL Structure

```
Landing Page URL/           → English (default)
Landing Page URL/fr.html    → French
Landing Page URL/ja.html    → Japanese
```

## Deployment

### GitHub Pages

The project is configured for GitHub Pages deployment:

1. Push to your repository
2. Enable GitHub Pages in repository settings
3. Select the `main` branch and `/dist` folder
4. Your site will be available at: `https://username.github.io/wp-kakitai/landing/`

The build process automatically:

- Creates `.nojekyll` to prevent Jekyll processing
- Generates all language versions
- Sets correct base path in `vite.config.js`

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies

- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **jsdom** - HTML parsing for static generation
- **Vanilla JavaScript** - No framework dependencies

## License

GPL-2.0 - Same as WordPress

## Author

[@firestar300](https://github.com/firestar300)
