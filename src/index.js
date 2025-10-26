import { registerFormatType, create, remove } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Icon, language } from '@wordpress/icons';
import React from 'react';
import { useKanjiFurigana } from './hooks';

registerFormatType( 'wp-kakitai/furigana', {
	title: __( 'Furigana', 'wp-kakitai' ),
	tagName: 'ruby',
	className: null,
	contentEditable: false,
	edit: ( { value, isActive, onChange } ) => {
		const selectedText = value.text.slice( value.start, value.end );
		const { isReady, isLoading, addFurigana } = useKanjiFurigana();
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

		// Vérifier si le texte sélectionné contient déjà des balises ruby
		const checkForRubyTags = () => {
			// Obtenir le contenu HTML du bloc actuel
			const blockContent = selectedBlock?.attributes?.content || '';

			// Vérifier s'il y a des balises ruby dans le contenu
			return /<ruby>/i.test( blockContent );
		};

		const hasFurigana = checkForRubyTags();

		return (
			<RichTextToolbarButton
				icon={ <Icon icon={ language } /> }
				title={ __( 'Furigana', 'wp-kakitai' ) }
				onClick={ async () => {
					// Si le texte contient déjà des furigana, les retirer
					if ( hasFurigana ) {
						// Utiliser le DOM pour retirer proprement les balises ruby
						const blockContent = selectedBlock?.attributes?.content || '';
						const temp = document.createElement( 'div' );
						temp.innerHTML = blockContent;

						// Remplacer chaque balise ruby par son texte de base
						const rubyElements = temp.querySelectorAll( 'ruby' );
						rubyElements.forEach( ( ruby ) => {
							// Extraire seulement le texte, sans les rt/rp
							const baseText = Array.from( ruby.childNodes )
								.filter( ( node ) => node.nodeName !== 'RT' && node.nodeName !== 'RP' )
								.map( ( node ) => node.textContent )
								.join( '' );
							ruby.replaceWith( document.createTextNode( baseText ) );
						} );

						onChange(
							create( {
								html: temp.innerHTML,
							} )
						);
						return;
					}

					// Sinon, ajouter les furigana
					if ( ! isReady || ! selectedText ) {
						return;
					}

					try {
						const furiganaHtml = await addFurigana( selectedText );

						// Reconstruire le texte complet
						const maxLength = value.text.length;
						let newHtml = furiganaHtml;

						// Gestion des cas où la sélection n'est pas le texte complet
						if ( value.start > 0 && value.end === maxLength ) {
							newHtml = value.text.slice( 0, value.start ) + furiganaHtml;
						} else if ( value.start === 0 && value.end < maxLength ) {
							newHtml = furiganaHtml + value.text.slice( value.end );
						} else if ( value.start > 0 && value.end < maxLength ) {
							newHtml = value.text.slice( 0, value.start ) + furiganaHtml + value.text.slice( value.end );
						}

						// Appliquer le changement
						onChange(
							create( {
								html: newHtml,
							} )
						);
					} catch ( err ) {
						console.error( 'Erreur lors de l\'ajout des furigana:', err );
					}
				} }
				isActive={ hasFurigana }
				disabled={ ! isReady || isLoading }
			/>
		);
	},
} );
