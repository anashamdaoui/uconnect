import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  plugins: [
    svelte(),
  ],
  build: {
    outDir: 'dist/scripts/background',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        format: 'iife', // This avoids dynamic import issues
        inlineDynamicImports: true, // Necessary for iife format
      },
    },
    sourcemap: true,
    minify: true,
    emptyOutDir: true,
  },
});