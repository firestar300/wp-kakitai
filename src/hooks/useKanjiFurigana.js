import { useState, useEffect } from 'react';
import kuromoji from 'kuromoji';

// Cache to store the tokenizer once initialized
let tokenizerInstance = null;
let initializationPromise = null;

/**
 * Converts a katakana string to hiragana.
 *
 * @param {string} katakana - The katakana string to convert.
 * @return {string} The converted hiragana string.
 */
const katakanaToHiragana = ( katakana ) => {
	return katakana.replace( /[\u30a1-\u30f6]/g, ( match ) =>
		String.fromCharCode( match.charCodeAt( 0 ) - 0x60 )
	);
};

/**
 * Custom React hook to manage Kuromoji tokenizer initialization and usage.
 *
 * @return {Object} Hook state and functions.
 * @return {boolean} return.isReady - Whether the tokenizer is ready.
 * @return {boolean} return.isLoading - Whether the tokenizer is loading.
 * @return {Error|null} return.error - Any error that occurred during initialization.
 * @return {Function} return.addFurigana - Function to add furigana to text.
 */
export const useKanjiFurigana = () => {
	const [ isReady, setIsReady ] = useState( !! tokenizerInstance );
	const [ isLoading, setIsLoading ] = useState( ! tokenizerInstance );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		// If tokenizer is already initialized
		if ( tokenizerInstance ) {
			setIsReady( true );
			setIsLoading( false );
			return;
		}

		// If initialization is already in progress
		if ( initializationPromise ) {
			initializationPromise
				.then( () => {
					setIsReady( true );
					setIsLoading( false );
				} )
				.catch( ( err ) => {
					setError( err );
					setIsLoading( false );
				} );
			return;
		}

		// Initialize Kuromoji
		const initKuromoji = async () => {
			try {
				if ( ! window.wpKakitai || ! window.wpKakitai.pluginUrl ) {
					throw new Error( 'Missing configuration: window.wpKakitai.pluginUrl' );
				}

				// Extract the relative path from the full URL
				// Kuromoji automatically adds the current host
				const fullUrl = window.wpKakitai.pluginUrl + 'build/dict/';
				const url = new URL( fullUrl );
				const dicPath = url.pathname;

				// Build the tokenizer
				const builder = kuromoji.builder( { dicPath } );

				// Use a Promise to handle the callback
				const tokenizer = await new Promise( ( resolve, reject ) => {
					builder.build( ( err, tok ) => {
						if ( err ) {
							reject( err );
						} else {
							resolve( tok );
						}
					} );
				} );

				tokenizerInstance = tokenizer;
				setIsReady( true );
			} catch ( err ) {
				console.error( 'Error initializing Kuromoji:', err );
				setError( err );
				setIsReady( false );
			} finally {
				setIsLoading( false );
			}
		};

		initializationPromise = initKuromoji();
	}, [] );

	/**
	 * Converts Japanese text by adding furigana.
	 *
	 * @param {string} text - The text to convert.
	 * @return {Promise<string>} The HTML with ruby tags.
	 */
	const addFurigana = async ( text ) => {
		if ( ! tokenizerInstance || ! isReady ) {
			return text;
		}

		if ( ! text || text.trim() === '' ) {
			return text;
		}

		try {
			const tokens = tokenizerInstance.tokenize( text );
			let result = '';

			for ( const token of tokens ) {
				const surface = token.surface_form;
				const reading = token.reading;

				// If the token contains kanji and has a reading
				if ( /[\u4e00-\u9faf]/.test( surface ) && reading ) {
					const hiragana = katakanaToHiragana( reading );

					// Don't add furigana if the reading is identical
					if ( hiragana !== surface ) {
						result += `<ruby>${ surface }<rp>(</rp><rt>${ hiragana }</rt><rp>)</rp></ruby>`;
					} else {
						result += surface;
					}
				} else {
					result += surface;
				}
			}

			return result;
		} catch ( err ) {
			console.error( 'Error during conversion:', err );
			return text;
		}
	};

	return {
		isReady,
		isLoading,
		error,
		addFurigana,
	};
};
