import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create .nojekyll file in dist directory
const distPath = join(__dirname, '..', '..', 'dist');
const nojekyllPath = join(distPath, '.nojekyll');

try {
  writeFileSync(nojekyllPath, '');
  console.log('✓ Created .nojekyll file for GitHub Pages\n');
} catch (error) {
  console.error('Error creating .nojekyll file:', error);
  process.exit(1);
}

// Generate multilingual pages
try {
  console.log('Generating multilingual pages...');
  execSync('node scripts/generate-i18n-pages.js', {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
} catch (error) {
  console.error('Error generating multilingual pages:', error);
  process.exit(1);
}
