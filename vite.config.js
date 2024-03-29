import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest';

export default defineConfig({
	build: {
		target: 'esnext',
		outDir: process.env.BROWSER === 'firefox' ? 'dist/firefox' : 'dist/chrome',
		...(process.env.BROWSER === 'firefox' && {
			rollupOptions: {
				input: {
					background: 'src/background/index.html'
				}
			}
		})
	},
	resolve: {
		alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) }
	},
	define: {
		__DEV__: process.env.NODE_ENV !== 'production'
	},
	plugins: [
		crx({ manifest }),
		svelte(),
		splitVendorChunkPlugin()
	]
});
