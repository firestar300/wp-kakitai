<?php
/**
 * Plugin Name:       Kakitai - Japanese Furigana
 * Description:       Provide Furigana for Japanese text.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            firestar300
 * Author URI:        https://github.com/firestar300
 * Plugin URI:        https://github.com/firestar300/wp-kakitai
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       kakitai
 *
 * @package WP_Kakitai
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Plugin constants
define( 'WP_KAKITAI_VERSION', '1.0.0' );
define( 'WP_KAKITAI_URL', plugin_dir_url( __FILE__ ) );
define( 'WP_KAKITAI_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_KAKITAI_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Load required classes
require_once WP_KAKITAI_DIR . 'includes/class-dictionary-manager.php';
require_once WP_KAKITAI_DIR . 'includes/class-admin-page.php';
require_once WP_KAKITAI_DIR . 'includes/class-activation.php';

// Register activation hook
register_activation_hook( __FILE__, array( 'WP_Kakitai_Activation', 'activate' ) );

// Initialize admin functionality
if ( is_admin() ) {
	WP_Kakitai_Admin_Page::init();
	add_action( 'admin_notices', array( 'WP_Kakitai_Activation', 'activation_notice' ) );
}

// Add admin notice if dictionaries are not installed
add_action( 'admin_notices', 'wp_kakitai_dict_notice' );

/**
 * Display admin notice if dictionaries are not installed.
 *
 * @return void
 */
function wp_kakitai_dict_notice() {
	// Only show on edit screens
	$screen = get_current_screen();
	if ( ! $screen || ! in_array( $screen->base, array( 'post', 'page' ), true ) ) {
		return;
	}

	// Check if dictionaries are installed
	if ( ! WP_Kakitai_Dictionary_Manager::are_dictionaries_installed() ) {
		$settings_url = admin_url( 'options-general.php?page=kakitai' );
		?>
		<div class="notice notice-warning">
			<p>
				<strong><?php esc_html_e( 'Kakitai:', 'kakitai' ); ?></strong>
				<?php
				printf(
					/* translators: %s: settings page URL */
					wp_kses_post( __( 'Japanese dictionaries are not installed. <a href="%s">Install them now</a> to use furigana features.', 'kakitai' ) ),
					esc_url( $settings_url )
				);
				?>
			</p>
		</div>
		<?php
	}
}

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
		'var wpKakitai = ' . wp_json_encode(
			array(
				'pluginUrl' => WP_KAKITAI_URL,
				'pluginDir' => WP_KAKITAI_DIR,
			)
		) . ';',
		'before'
	);

	wp_set_script_translations(
		'wp-kakitai',
		'kakitai',
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
function wp_kakitai_allow_ruby_attributes( $tags, $context ) {
	if ( 'post' === $context ) {
		$tags['ruby'] = [];
		$tags['rp']   = [];
		$tags['rt']   = [];
	}

	return $tags;
}

add_filter( 'wp_kses_allowed_html', 'wp_kakitai_allow_ruby_attributes', 10, 2 );
