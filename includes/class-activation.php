<?php
/**
 * Plugin activation handler.
 *
 * @package WP_Kakitai
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Handles plugin activation.
 *
 * @since 1.0.0
 */
class WP_Kakitai_Activation {
	/**
	 * Run activation tasks.
	 *
	 * @return void
	 */
	public static function activate() {
		// Check minimum PHP version.
		if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );
			wp_die(
				esc_html__( 'Kakitai requires PHP 7.4 or higher.', 'kakitai' ),
				esc_html__( 'Plugin Activation Error', 'kakitai' ),
				array( 'back_link' => true )
			);
		}

		// Check minimum WordPress version.
		if ( version_compare( get_bloginfo( 'version' ), '6.7', '<' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );
			wp_die(
				esc_html__( 'Kakitai requires WordPress 6.7 or higher.', 'kakitai' ),
				esc_html__( 'Plugin Activation Error', 'kakitai' ),
				array( 'back_link' => true )
			);
		}

		// Set activation flag to show admin notice.
		set_transient( 'wp_kakitai_activation_notice', true, 60 );
	}

	/**
	 * Display admin notice after activation.
	 *
	 * @return void
	 */
	public static function activation_notice() {
		if ( ! get_transient( 'wp_kakitai_activation_notice' ) ) {
			return;
		}

		delete_transient( 'wp_kakitai_activation_notice' );

		$status = WP_Kakitai_Dictionary_Manager::get_status();

		if ( ! $status['installed'] ) {
			$settings_url = admin_url( 'options-general.php?page=kakitai' );
			?>
			<div class="notice notice-warning is-dismissible">
				<p>
					<strong><?php esc_html_e( 'Kakitai is almost ready!', 'kakitai' ); ?></strong>
				</p>
				<p>
					<?php
					printf(
						/* translators: %s: settings page URL */
						wp_kses_post( __( 'To use the plugin, you need to download the Japanese dictionaries (~18 MB). <a href="%s">Go to settings</a> to install them now.', 'kakitai' ) ),
						esc_url( $settings_url )
					);
					?>
				</p>
			</div>
			<?php
		} else {
			?>
			<div class="notice notice-success is-dismissible">
				<p>
					<strong><?php esc_html_e( 'Kakitai activated successfully!', 'kakitai' ); ?></strong>
				</p>
				<p>
					<?php esc_html_e( 'You can now add furigana to Japanese text in the Gutenberg editor.', 'kakitai' ); ?>
				</p>
			</div>
			<?php
		}
	}
}
