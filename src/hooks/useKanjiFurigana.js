import { useState, useEffect } from 'react';
import kuromoji from 'kuromoji';

// Cache pour stocker le tokenizer une fois initialisé
let tokenizerInstance = null;
let initializationPromise = null;

/**
 * Convertit katakana en hiragana
 */
const katakanaToHiragana = ( str ) => {
	return str.replace( /[\u30a1-\u30f6]/g, ( match ) => {
		const chr = match.charCodeAt( 0 ) - 0x60;
		return String.fromCharCode( chr );
	} );
};

export const useKanjiFurigana = () => {
	const [ isReady, setIsReady ] = useState( !! tokenizerInstance );
	const [ isLoading, setIsLoading ] = useState( ! tokenizerInstance );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		// Si le tokenizer est déjà initialisé
		if ( tokenizerInstance ) {
			setIsReady( true );
			setIsLoading( false );
			return;
		}

		// Si l'initialisation est déjà en cours
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

		// Initialiser Kuromoji
		const initKuromoji = async () => {
			try {
				if ( ! window.wpKakitai || ! window.wpKakitai.pluginUrl ) {
					throw new Error( 'Configuration manquante: window.wpKakitai.pluginUrl' );
				}

				// Extraire le chemin relatif depuis l'URL complète
				// Kuromoji ajoute automatiquement l'hôte actuel
				const fullUrl = window.wpKakitai.pluginUrl + 'build/dict/';
				const url = new URL( fullUrl );
				const dicPath = url.pathname;

				// Construire le tokenizer
				const builder = kuromoji.builder( { dicPath } );

				// Utiliser une Promise pour gérer le callback
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
				console.error( 'Erreur lors de l\'initialisation de Kuromoji:', err );
				setError( err );
				setIsReady( false );
			} finally {
				setIsLoading( false );
			}
		};

		initializationPromise = initKuromoji();
	}, [] );

	/**
	 * Convertit un texte japonais en ajoutant des furigana
	 *
	 * @param {string} text - Le texte à convertir
	 * @return {Promise<string>} Le HTML avec les balises ruby
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

				// Si le token contient des kanji et a une lecture
				if ( /[\u4e00-\u9faf]/.test( surface ) && reading ) {
					const hiragana = katakanaToHiragana( reading );

					// Ne pas ajouter de furigana si la lecture est identique
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
			console.error( 'Erreur lors de la conversion:', err );
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
