import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
	vite: () => ({
		build: {
			target: 'esnext',
			cssMinify: 'esbuild',
		},
		plugins: [
			tailwindcss(),
			Icons({
				compiler: 'svelte',
				scale: 0,
			}),
		],
	}),
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte'],
	webExt: {
		disabled: true,
	},
	outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
	dev: {
		server: { port: 3009 },
	},
	manifest: ({ browser }) => {
		return {
			name: '__MSG_app_name__',
			description: '__MSG_app_description__',
			homepage_url: 'https://github.com/chergav/translater',
			default_locale: 'en',
			...(browser === 'firefox'
				? {
					browser_specific_settings: {
						gecko: {
							id: 'translater@chergav',
							strict_min_version: '128.0',
							// data_collection_permissions: {
							// 	required: ['websiteContent'],
							// 	optional: ['technicalAndInteraction'],
							// },
						},
					},
					optional_host_permissions: ['<all_urls>'],
				}
				: { minimum_chrome_version: '116' }
			),
			action: {
				default_title: '__MSG_app_name__',
			},
			commands: {
				'open-translator': {
					suggested_key: {
						default: 'Ctrl+Shift+U',
						mac: 'Command+Shift+U',
					},
					description: '__MSG_commands_open_translator__',
				},
			},
			permissions: [
				'storage',
				'contextMenus',
				'activeTab',
				'scripting',
			],
			host_permissions: ['<all_urls>'],
			optional_permissions: ['downloads'],
		};
	},
});
