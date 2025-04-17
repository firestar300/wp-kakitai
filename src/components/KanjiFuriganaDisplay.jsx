import React from 'react';
import { useKanjiFurigana } from '../hooks/useKanjiFurigana';

const KanjiFuriganaDisplay = ( { text } ) => {
	const { getFurigana, isLoading, error } = useKanjiFurigana();

	if ( isLoading ) return <div>Loading...</div>;
	if ( error ) return <div>Error: { error.message }</div>;

	// Fonction pour séparer le texte en caractères japonais et non-japonais
	const splitText = ( text ) => {
		return text.split( /([\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+)/g );
	};

	return (
		<div className="kanji-furigana-display">
			{ splitText( text ).map( ( part, index ) => {
				// Si c'est un kanji/kana
				if (
					/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test( part )
				) {
					const furigana = getFurigana( part );
					return (
						<span key={ index } className="kanji-container">
							{ furigana && (
								<span className="furigana">{ furigana }</span>
							) }
							<span className="kanji">{ part }</span>
						</span>
					);
				}
				// Si c'est du texte normal
				return <span key={ index }>{ part }</span>;
			} ) }
		</div>
	);
};

export default KanjiFuriganaDisplay;
