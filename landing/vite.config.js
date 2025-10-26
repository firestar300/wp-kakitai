import { defineConfig } from 'vite';

export default defineConfig({
  base: '/wp-kakitai/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
