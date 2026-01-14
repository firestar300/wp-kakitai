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
	 * Dictionary files to download (compressed).
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
	 * Get uncompressed dictionary filenames.
	 *
	 * @return array Array of .dat filenames (without .gz).
	 */
	private static function get_uncompressed_filenames() {
		return array_map(
			function ( $file ) {
				return str_replace( '.gz', '', $file );
			},
			self::DICT_FILES
		);
	}

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

		// Check for uncompressed .dat files (not .gz files).
		foreach ( self::get_uncompressed_filenames() as $file ) {
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
				__( 'Could not initialize filesystem.', 'kakitai' )
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
						__( 'Could not create directory: %s', 'kakitai' ),
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
					__( 'Failed to download dictionary files: %s', 'kakitai' ),
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

		// Download the compressed file to a temporary location.
		$temp_file = get_temp_dir() . $filename;
		$response  = wp_remote_get(
			$download_url,
			array(
				'timeout'  => 300, // 5 minutes.
				'stream'   => true,
				'filename' => $temp_file,
			)
		);

		if ( is_wp_error( $response ) ) {
			return new WP_Error(
				'download_error',
				sprintf(
					/* translators: 1: filename, 2: error message */
					__( 'Failed to download %1$s: %2$s', 'kakitai' ),
					$filename,
					$response->get_error_message()
				)
			);
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			if ( file_exists( $temp_file ) ) {
				wp_delete_file( $temp_file );
			}
			return new WP_Error(
				'download_error',
				sprintf(
					/* translators: 1: filename, 2: HTTP status code */
					__( 'Failed to download %1$s: HTTP %2$d', 'kakitai' ),
					$filename,
					$response_code
				)
			);
		}

		// Decompress the file.
		$uncompressed_filename = str_replace( '.gz', '', $filename );
		$uncompressed_path     = self::get_dict_dir() . '/' . $uncompressed_filename;

		// Read compressed file using WP_Filesystem.
		$compressed_data = $wp_filesystem->get_contents( $temp_file );
		if ( false === $compressed_data ) {
			if ( file_exists( $temp_file ) ) {
				wp_delete_file( $temp_file );
			}
			return new WP_Error(
				'read_error',
				sprintf(
					/* translators: %s: filename */
					__( 'Failed to read downloaded file: %s', 'kakitai' ),
					$filename
				)
			);
		}

		// Decompress using gzdecode() which handles .gz files correctly.
		// gzuncompress() only works with zlib format (no gzip header).
		// gzdecode() handles gzip format (.gz files) properly.
		$uncompressed_data = gzdecode( $compressed_data );
		if ( false === $uncompressed_data ) {
			if ( file_exists( $temp_file ) ) {
				wp_delete_file( $temp_file );
			}
			return new WP_Error(
				'decompress_error',
				sprintf(
					/* translators: %s: filename */
					__( 'Failed to decompress file: %s', 'kakitai' ),
					$filename
				)
			);
		}

		// Write uncompressed file using WP_Filesystem.
		$written = $wp_filesystem->put_contents( $uncompressed_path, $uncompressed_data, FS_CHMOD_FILE );
		if ( ! $written ) {
			if ( file_exists( $temp_file ) ) {
				wp_delete_file( $temp_file );
			}
			return new WP_Error(
				'write_error',
				sprintf(
					/* translators: %s: filename */
					__( 'Failed to write decompressed file: %s', 'kakitai' ),
					$uncompressed_filename
				)
			);
		}

		// Clean up temporary compressed file.
		if ( file_exists( $temp_file ) ) {
			wp_delete_file( $temp_file );
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
