import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create .nojekyll file in dist directory
const distPath = join(__dirname, '..', '..', 'dist');
const nojekyllPath = join(distPath, '.nojekyll');

try {
  writeFileSync(nojekyllPath, '');
  console.log('✓ Created .nojekyll file for GitHub Pages');
} catch (error) {
  console.error('Error creating .nojekyll file:', error);
  process.exit(1);
}
