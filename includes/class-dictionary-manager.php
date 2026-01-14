<?php
/**
 * Dictionary Manager class for handling Kuromoji dictionary downloads.
 *
 * @package WP_Kakitai
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Manages dictionary downloads and updates for Kuromoji.
 *
 * @since 1.0.0
 */
class WP_Kakitai_Dictionary_Manager {
	/**
	 * GitHub repository owner.
	 *
	 * @var string
	 */
	const GITHUB_OWNER = 'firestar300';

	/**
	 * GitHub repository name.
	 *
	 * @var string
	 */
	const GITHUB_REPO = 'wp-kakitai';

	/**
	 * Dictionary folder name.
	 *
	 * @var string
	 */
	const DICT_FOLDER = 'dict';

	/**
	 * Dictionary files to download.
	 *
	 * @var array
	 */
	const DICT_FILES = array(
		'base.dat.gz',
		'cc.dat.gz',
		'check.dat.gz',
		'tid.dat.gz',
		'tid_map.dat.gz',
		'tid_pos.dat.gz',
		'unk.dat.gz',
		'unk_char.dat.gz',
		'unk_compat.dat.gz',
		'unk_invoke.dat.gz',
		'unk_map.dat.gz',
		'unk_pos.dat.gz',
	);

	/**
	 * Get the dictionary directory path.
	 *
	 * @return string Dictionary directory path.
	 */
	public static function get_dict_dir() {
		return WP_KAKITAI_DIR . 'build/' . self::DICT_FOLDER;
	}

	/**
	 * Check if dictionaries are installed.
	 *
	 * @return bool True if all dictionaries are installed.
	 */
	public static function are_dictionaries_installed() {
		$dict_dir = self::get_dict_dir();

		if ( ! is_dir( $dict_dir ) ) {
			return false;
		}

		foreach ( self::DICT_FILES as $file ) {
			if ( ! file_exists( $dict_dir . '/' . $file ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Download and install dictionaries from GitHub release.
	 *
	 * @param string $version Optional. Plugin version to download dictionaries for. Default current version.
	 * @return true|WP_Error True on success, WP_Error on failure.
	 */
	public static function install_dictionaries( $version = WP_KAKITAI_VERSION ) {
		global $wp_filesystem;

		// Initialize WP_Filesystem.
		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		if ( ! WP_Filesystem() ) {
			return new WP_Error(
				'filesystem_error',
				__( 'Could not initialize filesystem.', 'wp-kakitai' )
			);
		}

		// Create dict directory if it doesn't exist.
		$dict_dir = self::get_dict_dir();
		if ( ! $wp_filesystem->is_dir( $dict_dir ) ) {
			if ( ! $wp_filesystem->mkdir( $dict_dir, FS_CHMOD_DIR ) ) {
				return new WP_Error(
					'mkdir_failed',
					sprintf(
						/* translators: %s: directory path */
						__( 'Could not create directory: %s', 'wp-kakitai' ),
						$dict_dir
					)
				);
			}
		}

		// Download each dictionary file.
		$errors = array();
		foreach ( self::DICT_FILES as $file ) {
			$result = self::download_dictionary_file( $file, $version );
			if ( is_wp_error( $result ) ) {
				$errors[] = $result->get_error_message();
			}
		}

		if ( ! empty( $errors ) ) {
			return new WP_Error(
				'download_failed',
				sprintf(
					/* translators: %s: error messages */
					__( 'Failed to download dictionary files: %s', 'wp-kakitai' ),
					implode( ', ', $errors )
				)
			);
		}

		// Mark dictionaries as installed.
		update_option( 'wp_kakitai_dict_version', $version );
		update_option( 'wp_kakitai_dict_installed', time() );

		return true;
	}

	/**
	 * Download a single dictionary file from GitHub.
	 *
	 * @param string $filename Dictionary filename.
	 * @param string $version  Plugin version.
	 * @return true|WP_Error True on success, WP_Error on failure.
	 */
	private static function download_dictionary_file( $filename, $version ) {
		global $wp_filesystem;

		// Build download URL from GitHub release.
		// Note: GitHub Releases don't support subdirectories in download URLs,
		// so files are uploaded directly to the release root.
		$download_url = sprintf(
			'https://github.com/%s/%s/releases/download/v%s/%s',
			self::GITHUB_OWNER,
			self::GITHUB_REPO,
			$version,
			$filename
		);

		// Download the file.
		$response = wp_remote_get(
			$download_url,
			array(
				'timeout'  => 300, // 5 minutes.
				'stream'   => true,
				'filename' => self::get_dict_dir() . '/' . $filename,
			)
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'download_error',
				sprintf(
					/* translators: 1: filename, 2: error message */
					__( 'Failed to download %1$s: %2$s', 'wp-kakitai' ),
					$filename,
					$response->get_error_message()
				)
			);
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			return new WP_Error(
				'download_error',
				sprintf(
					/* translators: 1: filename, 2: HTTP status code */
					__( 'Failed to download %1$s: HTTP %2$d', 'wp-kakitai' ),
					$filename,
					$response_code
				)
			);
		}

		return true;
	}

	/**
	 * Delete all dictionary files.
	 *
	 * @return bool True on success, false on failure.
	 */
	public static function delete_dictionaries() {
		global $wp_filesystem;

		if ( ! function_exists( 'WP_Filesystem' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		if ( ! WP_Filesystem() ) {
			return false;
		}

		$dict_dir = self::get_dict_dir();

		if ( ! $wp_filesystem->is_dir( $dict_dir ) ) {
			return true;
		}

		$success = $wp_filesystem->rmdir( $dict_dir, true );

		if ( $success ) {
			delete_option( 'wp_kakitai_dict_version' );
			delete_option( 'wp_kakitai_dict_installed' );
		}

		return $success;
	}

	/**
	 * Get dictionary installation status.
	 *
	 * @return array Installation status information.
	 */
	public static function get_status() {
		$installed       = self::are_dictionaries_installed();
		$dict_version    = get_option( 'wp_kakitai_dict_version', '' );
		$install_date    = get_option( 'wp_kakitai_dict_installed', 0 );
		$current_version = WP_KAKITAI_VERSION;
		$needs_update    = $installed && $dict_version !== $current_version;

		return array(
			'installed'       => $installed,
			'dict_version'    => $dict_version,
			'current_version' => $current_version,
			'install_date'    => $install_date,
			'needs_update'    => $needs_update,
		);
	}
}
