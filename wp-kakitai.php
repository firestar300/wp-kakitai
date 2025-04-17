<?php
/**
 * Plugin Name:       WP Kakitai
 * Description:       Provide Furigana for Japanese text.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            firestar300
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-kakitai
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin constants
define( 'WP_KAKITAI_VERSION', '1.0.0' );
define( 'WP_KAKITAI_URL', plugin_dir_url( __FILE__ ) );
define( 'WP_KAKITAI_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_KAKITAI_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Registers the plugin script.
 *
 * @return void
 */
function wp_kakitai_register_script(): void {
	$asset_file = include WP_KAKITAI_DIR . 'build/index.asset.php';

	wp_register_script(
		'wp-kakitai',
		WP_KAKITAI_URL . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		false
	);

	wp_add_inline_script(
		'wp-kakitai',
		'var wpKakitai = ' . json_encode(
			array(
				'pluginUrl' => WP_KAKITAI_URL,
				'pluginDir' => WP_KAKITAI_DIR,
			)
		) . ';',
		'before'
	);

	wp_set_script_translations(
		'wp-kakitai',
		'wp-kakitai',
		WP_KAKITAI_DIR . 'languages'
	);
}
add_action( 'init', 'wp_kakitai_register_script' );

/**
 * Enqueues the plugin script.
 *
 * @return void
 */
function wp_kakitai_enqueue_script(): void {
	wp_enqueue_script( 'wp-kakitai' );
}

add_action( 'enqueue_block_editor_assets', 'wp_kakitai_enqueue_script' );

/**
 * Allow additional HTML attributes in KSES.
 *
 * Without this, the attributes are stripped from the post content for users without the `unfiltered_html` capability.
 * This break the block in the editor since the saved content doesn't match the output of the block's `save` function.
 *
 * @param array $tags
 * @param string $context
 *
 * @return array
 */
function allow_ruby_attributes( $tags, $context ) {
	if ( 'post' === $context ) {
		$tags['ruby'] = [];
		$tags['rp']   = [];
		$tags['rt']   = [];
	}

	return $tags;
}

add_filter( 'wp_kses_allowed_html', 'allow_ruby_attributes', 10, 2 );
