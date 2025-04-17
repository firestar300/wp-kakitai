import { useState, useEffect } from 'react';

// Cache pour stocker les données une fois chargées
let kanjiFuriganaCache = null;

export const useKanjiFurigana = () => {
	const [ data, setData ] = useState( kanjiFuriganaCache );
	const [ isLoading, setIsLoading ] = useState( ! kanjiFuriganaCache );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		// Si les données sont déjà en cache, on les utilise directement
		if ( kanjiFuriganaCache ) {
			setData( kanjiFuriganaCache );
			return;
		}

		// Sinon, on charge les données
		const fetchData = async () => {
			try {
				// Utiliser le chemin relatif correct pour WordPress
				const response = await fetch(
					window.wpKakitai?.pluginUrl + 'build/kanji-furigana.json'
				);
				if ( ! response.ok ) {
					throw new Error( 'Failed to fetch kanji-furigana data' );
				}
				const jsonData = await response.json();
				kanjiFuriganaCache = jsonData; // Mise en cache
				setData( jsonData );
			} catch ( err ) {
				console.error( 'Erreur lors du chargement des données:', err );
				setError( err );
			} finally {
				setIsLoading( false );
			}
		};

		fetchData();
	}, [] );

	// Fonction utilitaire pour obtenir la lecture d'un kanji
	const getFurigana = ( kanji ) => {
		if ( ! data ) {
			console.log( 'Pas de données disponibles' );
			return null;
		}
		const reading = data[ kanji ];
		return reading || null;
	};

	return {
		data,
		isLoading,
		error,
		getFurigana,
	};
};
