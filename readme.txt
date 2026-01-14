=== WP Kakitai ===
Contributors:      firestar300
Tags:              japanese, furigana, kanji, gutenberg
Requires at least: 6.7
Tested up to:      6.9
Requires PHP:      7.4
Stable tag:        1.0.0-alpha.6
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Automatically add furigana (pronunciation guides) to Japanese kanji in the Gutenberg editor.

== Description ==

**WP Kakitai** makes reading Japanese easier by automatically adding furigana (pronunciation guides in hiragana) to kanji characters. Perfect for Japanese learners, educators, and content creators.

= Features =

* **One-click furigana**: Select Japanese text and add furigana with a single click
* **Toggle functionality**: Click again to remove furigana
* **Seamless integration**: Button directly in the Gutenberg editor toolbar
* **Standard HTML**: Uses `<ruby>`, `<rt>`, and `<rp>` tags for maximum compatibility
* **Accurate analysis**: Powered by Kuromoji.js morphological analyzer
* **Optimized performance**: Client-side processing with intelligent caching
* **Block support**: Works with Paragraph and Heading blocks

= How It Works =

WP Kakitai uses Kuromoji.js, a powerful Japanese morphological analyzer, to automatically detect kanji and add their hiragana readings. The plugin generates standard HTML ruby tags that are supported by all modern browsers.

= Example =

**Before**: 今日は良い天気です

**After**: <ruby>今日<rt>きょう</rt></ruby>は<ruby>良<rt>よ</rt></ruby>い<ruby>天気<rt>てんき</rt></ruby>です

= Use Cases =

* **Language learning websites**: Help students learn kanji readings
* **Educational content**: Make Japanese text more accessible
* **Bilingual content**: Provide pronunciation guides for non-native readers
* **Children's books**: Add furigana to make content more readable

== Installation ==

= Automatic Installation =

1. Go to Plugins → Add New in your WordPress admin
2. Search for "WP Kakitai"
3. Click "Install Now" and then "Activate"
4. **Important**: Go to Settings → WP Kakitai and click "Download & Install Dictionaries" to download the Japanese language data (~18 MB)

= Manual Installation =

1. Download the plugin ZIP file
2. Go to Plugins → Add New → Upload Plugin
3. Choose the ZIP file and click "Install Now"
4. Activate the plugin
5. **Important**: Go to Settings → WP Kakitai and click "Download & Install Dictionaries" to download the Japanese language data (~18 MB)

= Why the Additional Download? =

To keep the plugin lightweight and within WordPress.org size limits, the Japanese dictionary files (~18 MB) are not included in the plugin package. They are automatically downloaded from GitHub on first use.

This is a one-time download that persists across plugin updates.

== Usage ==

1. Open the Gutenberg editor
2. Create or edit a Paragraph or Heading block
3. Type or paste Japanese text containing kanji
4. Select the text you want to add furigana to
5. Click the **Furigana** button (🌐 icon) in the editor toolbar
6. The furigana will be automatically added!
7. Click the button again to remove the furigana

== Frequently Asked Questions ==

= Do I need to download anything after installing? =

Yes, after activating the plugin, you need to download the Japanese dictionary files (~18 MB). Go to Settings → WP Kakitai and click "Download & Install Dictionaries". This is a one-time download that happens automatically.

= Why aren't the dictionaries included? =

To comply with WordPress.org's 10 MB plugin size limit, we host the dictionary files separately on GitHub. This keeps the plugin lightweight while still providing full functionality.

= What are furigana? =

Furigana (振り仮名) are small hiragana characters placed above or beside kanji to show pronunciation. They're commonly used in children's books, language learning materials, and texts with difficult kanji.

= Which blocks are supported? =

Currently, WP Kakitai supports Paragraph and Heading blocks (H1-H6). Support for more blocks may be added in future versions.

= Does this work with any Japanese text? =

Yes! The plugin uses Kuromoji.js for morphological analysis, which handles a wide range of Japanese text, including different kanji compounds and readings.

= Will furigana appear on the front-end? =

Yes! The plugin uses standard HTML `<ruby>` tags that are natively supported by all modern browsers. No additional CSS or JavaScript is needed on the front-end.

= Does this slow down my site? =

No. The morphological analysis happens in the editor only (admin side). The front-end simply displays the HTML ruby tags with no additional processing.

= Can I customize the appearance? =

Yes! You can style the `<ruby>`, `<rt>`, and `<rp>` tags with CSS in your theme. The furigana uses standard HTML elements.

= Is this compatible with page builders? =

The plugin is designed for the Gutenberg editor. Compatibility with other page builders has not been tested.

== Screenshots ==

1. The Furigana button in the Gutenberg toolbar
2. Selecting Japanese text in the editor
3. Furigana automatically added to kanji
4. Final result with furigana displayed

== Changelog ==

= 1.0.0 - 2025-10-26 =
* Initial release
* Automatic furigana generation using Kuromoji.js
* Toggle functionality to add/remove furigana
* Support for Paragraph and Heading blocks
* Native Gutenberg editor integration
* Client-side morphological analysis with caching

== Upgrade Notice ==

= 1.0.0 =
Initial release. Enjoy automatic furigana for your Japanese content!

== Technical Details ==

= Requirements =
* WordPress 6.7 or higher
* PHP 7.4 or higher
* Modern browser with JavaScript enabled (for editor)

= Built With =
* WordPress Gutenberg Block API
* React and React Hooks
* Kuromoji.js for Japanese morphological analysis
* Webpack 5 with Node.js polyfills
* @wordpress/scripts build tools

= Privacy =
This plugin does not collect or transmit any user data. All text processing happens locally in the browser.

= Support =
For bug reports and feature requests, please visit the [GitHub repository](https://github.com/firestar300/wp-kakitai).

== Credits ==

* Developed by firestar300
* Powered by [Kuromoji.js](https://github.com/takuyaa/kuromoji.js)
* Built with WordPress Gutenberg
