# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-10-26

### Added

- Initial release
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
[1.0.0]: https://github.com/firestar300/wp-kakitai/releases/tag/v1.0.0
