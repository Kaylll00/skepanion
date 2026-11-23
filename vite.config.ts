import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const githubPages = process.env.GITHUB_PAGES === 'true';
const base = githubPages ? '/skepanion' : '';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			kit: { base: `${base}/`, adapterFallback: '404.html' },
			manifest: {
				name: 'Skepanion', short_name: 'Skepanion',
				description: 'A local sketchbook progress companion',
				theme_color: '#25483f', background_color: '#f7f5ef', display: 'standalone',
				start_url: `${base}/`, scope: `${base}/`,
				icons: [{ src: `${base}/icon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
			},
			workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] }
		})
	]
});
