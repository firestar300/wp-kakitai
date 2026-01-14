# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-14

### Changed

- Remove 'WP' from plugin name to comply with WordPress.org requirements
- Plugin name changed from 'WP Kakitai' to 'Kakitai - Japanese Furigana'
- Updated all user-facing strings and documentation
- Updated landing page with new plugin name

### Fixed

- Plugin now complies with WordPress.org naming restrictions
- All references to plugin name updated consistently across codebase
- Dictionary files are automatically decompressed after download (no compressed files in plugin)
- Use `gzdecode()` for proper .gz file decompression

## [1.0.0-alpha.7] - 2025-01-14

### Changed

- Remove 'WP' from plugin name to comply with WordPress.org requirements
- Plugin name changed from 'WP Kakitai' to 'Kakitai - Japanese Furigana'
- Updated all user-facing strings and documentation
- Updated landing page with new plugin name

### Fixed

- Plugin now complies with WordPress.org naming restrictions
- All references to plugin name updated consistently across codebase

## [1.0.0-alpha.6] - 2025-01-14

### Fixed

- Use `gzdecode()` instead of `gzuncompress()` for .gz file decompression
- Fixes "data error" warnings when downloading dictionary files
- `gzuncompress()` only works with zlib format, while .gz files use gzip format with headers

## [1.0.0-alpha.5] - 2025-01-14

### Fixed

- Decompress dictionary files automatically after download (WordPress.org doesn't allow compressed .gz files)
- Add nonce verification for admin notice redirects
- Exclude .wp-env.json from plugin ZIP
- Use wp_json_encode() instead of json_encode() for better WordPress compatibility
- Use WP_Filesystem for all file operations
- Use wp_delete_file() for proper cleanup

### Changed

- Dictionary files are now stored as uncompressed .dat files (instead of .gz)
- Improved file handling with WordPress Filesystem API

## [1.0.0-alpha.4] - 2025-01-14

### Fixed

- Fixed ZIP creation to exclude dictionary files for WordPress.org compatibility
- Plugin ZIP now under 10MB limit (dictionaries hosted separately on GitHub Releases)

### Changed

- Improved release workflow to automatically create GitHub releases on tag push
- Dictionary files are now downloaded from GitHub Releases instead of being included in plugin package

## [1.0.0-alpha.3] - 2025-01-14

### Added

- External dictionary download system for WordPress.org compatibility
- Admin page for dictionary management (Settings → Kakitai)
- Automatic dictionary download from GitHub Releases
- Dictionary installation status checking
- Admin notices for missing dictionaries

### Changed

- Dictionary files (~18MB) are now hosted separately on GitHub Releases
- Plugin package size reduced to comply with WordPress.org 10MB limit

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

[Unreleased]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.7...v1.0.0
[1.0.0-alpha.7]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.6...v1.0.0-alpha.7
[1.0.0-alpha.6]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.5...v1.0.0-alpha.6
[1.0.0-alpha.5]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.4...v1.0.0-alpha.5
[1.0.0-alpha.4]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.3...v1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.2...v1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/firestar300/wp-kakitai/compare/v1.0.0-alpha.1...v1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/firestar300/wp-kakitai/releases/tag/v1.0.0-alpha.1
