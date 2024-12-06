import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/content/content.css',
          dest: '.',
        }
      ],
    }),
  ],
  build: {
    outDir: 'dist/scripts/content',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/content.ts'),
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