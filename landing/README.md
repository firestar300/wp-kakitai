# WP Kakitai Landing Page

Modern, animated landing page for WP Kakitai WordPress plugin.

## 🛠️ Tech Stack

- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library with ScrollTrigger
- **Vanilla JavaScript** - No framework overhead

## 🚀 Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The landing page will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `../dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Structure

```
landing/
├── index.html          # Main HTML file
├── src/
│   ├── main.js         # JavaScript entry point with GSAP animations
│   └── style.css       # Tailwind CSS with custom styles
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## 🎨 Features

- **Hero Section** - Animated introduction with gradient text
- **Demo Section** - Interactive furigana demonstration
- **Features Grid** - 6 key features with icons
- **Screenshots** - Plugin screenshots from WordPress.org assets
- **CTA Section** - Download and documentation links
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - GSAP-powered scroll animations
- **Fast Loading** - Optimized build with Vite

## 🌐 Deployment

The landing page is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

**Live URL**: `https://firestar300.github.io/wp-kakitai/`

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
colors: {
  primary: {
    600: '#0073aa', // Main blue
    700: '#005177', // Darker blue
  },
}
```

### Animations

Edit `src/main.js` to modify GSAP animations:

```javascript
gsap.timeline()
  .to('#hero-title', { opacity: 1, duration: 0.8 })
  .to('#hero-description', { opacity: 1, duration: 0.8 }, '-=0.6');
```

### Content

Edit `index.html` to change text content, links, and structure.

## 📄 License

GPL-2.0-or-later - Same as WP Kakitai plugin

