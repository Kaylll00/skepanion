import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [sveltekit(), SvelteKitPWA({ manifest: { name: 'Skepanion', short_name: 'Skepanion', description: 'A local sketchbook progress companion', theme_color: '#25483f', background_color: '#f7f5ef', display: 'standalone', start_url: '/', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] }, workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] } })] });
