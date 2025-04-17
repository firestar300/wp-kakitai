import { registerFormatType, create, remove } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Icon, language } from '@wordpress/icons';
import React from 'react';
import { useKanjiFurigana } from './hooks';

const WP_KAKITAI_DEBUG = false;

registerFormatType( 'wp-kakitai/furigana', {
	title: __( 'Furigana', 'wp-kakitai' ),
	tagName: 'ruby',
	className: 'wp-kakitai-furigana',
	attributes: {
		class: 'class',
	},
	edit: ( { value, isActive, onChange } ) => {
		const selectedText = value.text.slice( value.start, value.end );
		const { isLoading, error, data } = useKanjiFurigana();
		const selectedBlock = useSelect( ( select ) => {
			return select( 'core/block-editor' ).getSelectedBlock();
		}, [] );

		// Only show for paragraph and heading blocks
		if (
			! selectedBlock ||
			! [ 'core/paragraph', 'core/heading' ].includes(
				selectedBlock.name
			)
		) {
			return null;
		}

		// Fonction pour trouver la plus longue correspondance de kanji
		const findLongestKanjiMatch = ( text, startIndex, data ) => {
			let maxLength = 0;
			let reading = null;

			if ( WP_KAKITAI_DEBUG ) {
				console.log(
					'Recherche de correspondance pour:',
					text.slice( startIndex )
				);
				console.log( 'Données disponibles:', data );
			}

			// Parcourir toutes les clés du JSON
			for ( const kanji of Object.keys( data ) ) {
				if ( text.startsWith( kanji, startIndex ) ) {
					if ( WP_KAKITAI_DEBUG ) {
						console.log(
							`Match trouvé: ${ kanji } -> ${ data[ kanji ] }`
						);
					}
					if ( kanji.length > maxLength ) {
						maxLength = kanji.length;
						reading = data[ kanji ];
					}
				}
			}

			return { length: maxLength, reading };
		};

		// Fonction pour créer le HTML avec les furigana
		const createFuriganaHtml = ( text ) => {
			if ( isLoading ) {
				if ( WP_KAKITAI_DEBUG ) {
					console.log( 'Chargement des données en cours...' );
				}
				return text;
			}

			if ( error ) {
				console.error(
					'Erreur lors du chargement des données:',
					error
				);
				return text;
			}

			if ( ! data ) {
				if ( WP_KAKITAI_DEBUG ) {
					console.log( 'Pas de données disponibles' );
				}
				return text;
			}

			let result = '';
			let i = 0;

			while ( i < text.length ) {
				// Chercher la plus longue correspondance de kanji
				const { length, reading } = findLongestKanjiMatch(
					text,
					i,
					data
				);

				if ( length > 0 && reading ) {
					// Si on trouve une correspondance, créer une balise ruby
					const kanji = text.substr( i, length );
					result += `<ruby>${ kanji }<rp>(</rp><rt>${ reading }</rt><rp>)</rp></ruby>`;
					i += length;
				} else {
					// Sinon, ajouter le caractère tel quel
					result += text[ i ];
					i++;
				}
			}

			return result;
		};

		const html = createFuriganaHtml( selectedText );

		if ( WP_KAKITAI_DEBUG ) {
			console.log( 'Texte sélectionné:', selectedText );
			console.log( 'État du chargement:', {
				isLoading,
				error,
				hasData: !! data,
			} );
			console.log( 'HTML généré:', html );
		}

		return (
			<RichTextToolbarButton
				icon={ <Icon icon={ language } /> }
				title={ __( 'Furigana', 'wp-kakitai' ) }
				onClick={ () => {
					const html = createFuriganaHtml( selectedText );

					onChange(
						create( {
							html,
							start: value.start,
							end: value.end,
							format: value.format,
						} )
					);
				} }
				isActive={ isActive }
			/>
		);
	},
} );
