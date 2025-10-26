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

		// Check if the selected text already contains ruby tags
		const checkForRubyTags = () => {
			// Get the HTML content of the current block
			const blockContent = selectedBlock?.attributes?.content || '';

			// Check if there are ruby tags in the content
			return /<ruby>/i.test( blockContent );
		};

		const hasFurigana = checkForRubyTags();

		return (
			<RichTextToolbarButton
				icon={ <Icon icon={ language } /> }
				title={ __( 'Furigana', 'wp-kakitai' ) }
				onClick={ async () => {
					// If the text already contains furigana, remove them
					if ( hasFurigana ) {
						// Use DOM to cleanly remove ruby tags
						const blockContent = selectedBlock?.attributes?.content || '';
						const temp = document.createElement( 'div' );
						temp.innerHTML = blockContent;

						// Replace each ruby tag with its base text
						const rubyElements = temp.querySelectorAll( 'ruby' );
						rubyElements.forEach( ( ruby ) => {
							// Extract only the text, without rt/rp
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

					// Otherwise, add furigana
					if ( ! isReady || ! selectedText ) {
						return;
					}

					try {
						const furiganaHtml = await addFurigana( selectedText );

						// Reconstruct the full text
						const maxLength = value.text.length;
						let newHtml = furiganaHtml;

						// Handle cases where the selection is not the full text
						if ( value.start > 0 && value.end === maxLength ) {
							newHtml = value.text.slice( 0, value.start ) + furiganaHtml;
						} else if ( value.start === 0 && value.end < maxLength ) {
							newHtml = furiganaHtml + value.text.slice( value.end );
						} else if ( value.start > 0 && value.end < maxLength ) {
							newHtml = value.text.slice( 0, value.start ) + furiganaHtml + value.text.slice( value.end );
						}

						// Apply the change
						onChange(
							create( {
								html: newHtml,
							} )
						);
					} catch ( err ) {
						console.error( 'Error adding furigana:', err );
					}
				} }
				isActive={ hasFurigana }
				disabled={ ! isReady || isLoading }
			/>
		);
	},
} );
