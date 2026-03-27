import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/seo_game/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/steam-api': {
          target: 'https://store.steampowered.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/steam-api/, '')
        },
        '/steam-api-stats': {
          target: 'https://api.steampowered.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/steam-api-stats/, '')
        }
      }
    },
  };
});
