const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');

// Chemins des fichiers
const inputFile = path.join(__dirname, '../src/data/kanji-furigana.csv');
const outputFile = path.join(__dirname, '../src/data/kanji-furigana.json');

// Lire le fichier CSV
const csvContent = fs.readFileSync(inputFile, 'utf-8');

// Parser le CSV
const records = parse(csvContent, {
  columns: false,
  skip_empty_lines: true,
  trim: true
});

console.log(`Nombre total de lignes dans le CSV: ${records.length}`);

// Convertir en format optimisé {kanji: furigana}
const kanjiFuriganaMap = records.reduce((acc, [kanji, furigana], index) => {
  if (!kanji || !furigana) {
    console.log(`Ligne ${index + 1} invalide:`, [kanji, furigana]);
    return acc;
  }
  if (acc[kanji]) {
    console.log(`Doublon trouvé pour ${kanji}: ${acc[kanji]} et ${furigana}`);
  }
  acc[kanji] = furigana;
  return acc;
}, {});

// Écrire le fichier JSON
fs.writeFileSync(
  outputFile,
  JSON.stringify(kanjiFuriganaMap, null, 2),
  'utf-8'
);

console.log(`Conversion terminée ! ${Object.keys(kanjiFuriganaMap).length} entrées converties.`);
