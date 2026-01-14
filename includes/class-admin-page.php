<?php
/**
 * Admin page for Kakitai settings and dictionary management.
 *
 * @package WP_Kakitai
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Handles the admin settings page.
 *
 * @since 1.0.0
 */
class WP_Kakitai_Admin_Page {
	/**
	 * Initialize the admin page.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_admin_menu' ) );
		add_action( 'admin_post_wp_kakitai_install_dict', array( __CLASS__, 'handle_install_dictionaries' ) );
		add_action( 'admin_post_wp_kakitai_delete_dict', array( __CLASS__, 'handle_delete_dictionaries' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_scripts' ) );
	}

	/**
	 * Add admin menu page.
	 *
	 * @return void
	 */
	public static function add_admin_menu() {
		add_options_page(
			__( 'Kakitai Settings', 'kakitai' ),
			__( 'Kakitai', 'kakitai' ),
			'manage_options',
			'kakitai',
			array( __CLASS__, 'render_admin_page' )
		);
	}

	/**
	 * Enqueue admin scripts and styles.
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public static function enqueue_admin_scripts( $hook ) {
		if ( 'settings_page_wp-kakitai' !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'wp-kakitai-admin',
			WP_KAKITAI_URL . 'assets/admin.css',
			array(),
			WP_KAKITAI_VERSION
		);
	}

	/**
	 * Render the admin page.
	 *
	 * @return void
	 */
	public static function render_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', 'kakitai' ) );
		}

		$status = WP_Kakitai_Dictionary_Manager::get_status();
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

			<?php self::render_notices(); ?>

			<div class="wp-kakitai-admin-container">
				<div class="card">
					<h2><?php esc_html_e( 'Dictionary Status', 'kakitai' ); ?></h2>

					<table class="form-table">
						<tr>
							<th scope="row"><?php esc_html_e( 'Status', 'kakitai' ); ?></th>
							<td>
								<?php if ( $status['installed'] ) : ?>
									<span class="dashicons dashicons-yes-alt" style="color: #46b450;"></span>
									<strong style="color: #46b450;">
										<?php esc_html_e( 'Installed', 'kakitai' ); ?>
									</strong>
								<?php else : ?>
									<span class="dashicons dashicons-warning" style="color: #dc3232;"></span>
									<strong style="color: #dc3232;">
										<?php esc_html_e( 'Not Installed', 'kakitai' ); ?>
									</strong>
								<?php endif; ?>
							</td>
						</tr>

						<?php if ( $status['installed'] ) : ?>
							<tr>
								<th scope="row"><?php esc_html_e( 'Dictionary Version', 'kakitai' ); ?></th>
								<td>
									<code><?php echo esc_html( $status['dict_version'] ); ?></code>
									<?php if ( $status['needs_update'] ) : ?>
										<span class="dashicons dashicons-update" style="color: #f0b849;" title="<?php esc_attr_e( 'Update available', 'kakitai' ); ?>"></span>
									<?php endif; ?>
								</td>
							</tr>

							<tr>
								<th scope="row"><?php esc_html_e( 'Plugin Version', 'kakitai' ); ?></th>
								<td><code><?php echo esc_html( $status['current_version'] ); ?></code></td>
							</tr>

							<tr>
								<th scope="row"><?php esc_html_e( 'Installed On', 'kakitai' ); ?></th>
								<td>
									<?php
									echo esc_html(
										$status['install_date']
											? wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $status['install_date'] )
											: __( 'Unknown', 'kakitai' )
									);
									?>
								</td>
							</tr>
						<?php endif; ?>
					</table>

					<div class="wp-kakitai-actions">
						<?php if ( ! $status['installed'] || $status['needs_update'] ) : ?>
							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
								<?php wp_nonce_field( 'wp_kakitai_install_dict', 'wp_kakitai_nonce' ); ?>
								<input type="hidden" name="action" value="wp_kakitai_install_dict">
								<button type="submit" class="button button-primary">
									<?php
									if ( $status['installed'] ) {
										esc_html_e( 'Update Dictionaries', 'kakitai' );
									} else {
										esc_html_e( 'Download & Install Dictionaries', 'kakitai' );
									}
									?>
								</button>
								<p class="description">
									<?php
									esc_html_e(
										'This will download approximately 18 MB of dictionary files from GitHub.',
										'kakitai'
									);
									?>
								</p>
							</form>
						<?php endif; ?>

						<?php if ( $status['installed'] ) : ?>
							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top: 20px;">
								<?php wp_nonce_field( 'wp_kakitai_delete_dict', 'wp_kakitai_nonce' ); ?>
								<input type="hidden" name="action" value="wp_kakitai_delete_dict">
								<button type="submit" class="button button-secondary" onclick="return confirm('<?php esc_attr_e( 'Are you sure you want to delete the dictionaries?', 'kakitai' ); ?>');">
									<?php esc_html_e( 'Delete Dictionaries', 'kakitai' ); ?>
								</button>
								<p class="description">
									<?php esc_html_e( 'Free up disk space by removing dictionary files.', 'kakitai' ); ?>
								</p>
							</form>
						<?php endif; ?>
					</div>
				</div>

				<div class="card">
					<h2><?php esc_html_e( 'About Kakitai', 'kakitai' ); ?></h2>
					<p>
						<?php
						esc_html_e(
							'Kakitai automatically adds furigana (pronunciation guides) to Japanese kanji in the Gutenberg editor.',
							'kakitai'
						);
						?>
					</p>
					<p>
						<?php
						printf(
							/* translators: %s: plugin version */
							esc_html__( 'Version: %s', 'kakitai' ),
							'<code>' . esc_html( WP_KAKITAI_VERSION ) . '</code>'
						);
						?>
					</p>
					<p>
						<a href="https://github.com/firestar300/wp-kakitai" target="_blank" rel="noopener noreferrer" class="button">
							<?php esc_html_e( 'View on GitHub', 'kakitai' ); ?>
						</a>
					</p>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Render admin notices.
	 *
	 * @return void
	 */
	private static function render_notices() {
		// Verify nonce for GET parameters (admin redirects use nonces)
		if ( isset( $_GET['wp_kakitai_message'] ) && isset( $_GET['_wpnonce'] ) ) {
			if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'wp_kakitai_admin_notice' ) ) {
				return;
			}
		}

		if ( isset( $_GET['wp_kakitai_message'] ) ) {
			$message = sanitize_text_field( wp_unslash( $_GET['wp_kakitai_message'] ) );
			$type    = isset( $_GET['wp_kakitai_type'] ) ? sanitize_text_field( wp_unslash( $_GET['wp_kakitai_type'] ) ) : 'success';

			$messages = array(
				'dict_installed'    => __( 'Dictionaries installed successfully!', 'kakitai' ),
				'dict_updated'      => __( 'Dictionaries updated successfully!', 'kakitai' ),
				'dict_deleted'      => __( 'Dictionaries deleted successfully!', 'kakitai' ),
				'dict_install_fail' => __( 'Failed to install dictionaries. Please try again.', 'kakitai' ),
				'dict_delete_fail'  => __( 'Failed to delete dictionaries.', 'kakitai' ),
			);

			if ( isset( $messages[ $message ] ) ) {
				printf(
					'<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
					esc_attr( $type ),
					esc_html( $messages[ $message ] )
				);
			}
		}
	}

	/**
	 * Handle dictionary installation request.
	 *
	 * @return void
	 */
	public static function handle_install_dictionaries() {
		// Check permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to perform this action.', 'kakitai' ) );
		}

		// Verify nonce.
		if ( ! isset( $_POST['wp_kakitai_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['wp_kakitai_nonce'] ) ), 'wp_kakitai_install_dict' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'kakitai' ) );
		}

		// Install dictionaries.
		$result = WP_Kakitai_Dictionary_Manager::install_dictionaries();

		if ( is_wp_error( $result ) ) {
			wp_safe_redirect(
				add_query_arg(
					array(
						'page'               => 'kakitai',
						'wp_kakitai_message' => 'dict_install_fail',
						'wp_kakitai_type'    => 'error',
						'error_message'      => rawurlencode( $result->get_error_message() ),
						'_wpnonce'           => wp_create_nonce( 'wp_kakitai_admin_notice' ),
					),
					admin_url( 'options-general.php' )
				)
			);
			exit;
		}

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'               => 'kakitai',
					'wp_kakitai_message' => 'dict_installed',
					'wp_kakitai_type'    => 'success',
					'_wpnonce'            => wp_create_nonce( 'wp_kakitai_admin_notice' ),
				),
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}

	/**
	 * Handle dictionary deletion request.
	 *
	 * @return void
	 */
	public static function handle_delete_dictionaries() {
		// Check permissions.
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have sufficient permissions to perform this action.', 'kakitai' ) );
		}

		// Verify nonce.
		if ( ! isset( $_POST['wp_kakitai_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['wp_kakitai_nonce'] ) ), 'wp_kakitai_delete_dict' ) ) {
			wp_die( esc_html__( 'Security check failed.', 'kakitai' ) );
		}

		// Delete dictionaries.
		$result = WP_Kakitai_Dictionary_Manager::delete_dictionaries();

		$message = $result ? 'dict_deleted' : 'dict_delete_fail';
		$type    = $result ? 'success' : 'error';

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'               => 'kakitai',
					'wp_kakitai_message' => $message,
					'wp_kakitai_type'    => $type,
					'_wpnonce'            => wp_create_nonce( 'wp_kakitai_admin_notice' ),
				),
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}
}
