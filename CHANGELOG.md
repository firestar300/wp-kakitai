# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-alpha.2] - 2025-10-27

### Added

- **Landing Page**: Complete landing page with modern design
  - Sakura Tech color palette (pink/violet/cyan)
  - Multilingual support (English, French, Japanese)
  - Automatic language detection from browser
  - Static HTML pages for SEO optimization
  - Language selector dropdown in navbar
- **Animations**: Interactive typing animations in demo section
  - Character-by-character typing effect
  - Blinking cursor animation
  - Furigana pop-up animations with bounce effect
  - Scroll-triggered animations
- **Video Demo**: Autoplay video demonstration
  - Muted and looping
  - Shows plugin in action
- **Design System**: Modern Sakura Tech design
  - Rose to violet gradient on hero title
  - Pink borders on feature cards with hover effects
  - Gradient backgrounds on CTA section
  - Custom scrollbar styling

### Changed

- Updated Japanese font to "Mochiy Pop P One"
- Improved typography with adjusted colors (gray-600)
- Replaced box-shadows with colored borders on feature cards
- Enhanced language switcher with proper `hreflang` and `lang` attributes

### Fixed

- Language selector no longer duplicates in development
- Multilingual functionality works correctly in production
- Prevents FOUC (Flash of Unstyled Content) in demo animations
- Proper language detection from static pages

### Technical

- Implemented static page generation for multilingual SEO
- Added Vite post-build script for i18n page generation
- Uses semantic `<a>` links instead of buttons in language selector
- Progressive enhancement: works without JavaScript
- Automated release workflow with version bumping from git tags

## [1.0.0-alpha.1] - 2025-10-26

### Added - Initial Alpha Release

- Automatic furigana addition for Japanese kanji using Kuromoji.js
- Toggle functionality to add/remove furigana
- Integration with Gutenberg editor toolbar
- Support for Paragraph and Heading blocks
- Uses standard HTML `<ruby>`, `<rt>`, and `<rp>` tags
- Client-side morphological analysis with caching
- Hiragana conversion from katakana readings
- Webpack configuration with Node.js polyfills for browser compatibility
- Dictionary files bundled with the plugin

### Technical Details

- Built with WordPress Gutenberg Block API
- React hooks for state management
- Kuromoji.js for Japanese tokenization
- Webpack 5 with custom configuration
- Node.js polyfills: path, zlib, stream, buffer, util
- Dictionary files automatically copied to build directory

[Unreleased]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.2...HEAD
[1.0.0-alpha.2]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.1...v1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/firestar300/wp-kakitai/releases/tag/v1.0.0-alpha.1
