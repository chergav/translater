import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
	vite: () => ({
		build: {
			target: 'esnext',
		},
		plugins: [tailwindcss()],
	}),
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte'],
	webExt: {
		disabled: true,
	},
	outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
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
						},
					},
					optional_permissions: ['<all_urls>'],
				}
				: { minimum_chrome_version: '111' }
			),
			action: {
				default_title: '__MSG_app_name__',
			},
			commands: {
				'open-translater': {
					suggested_key: {
						default: 'Ctrl+Shift+U',
						mac: 'Command+Shift+U',
					},
					description: '__MSG_commands_open_translater__',
				},
			},
			permissions: [
				'storage',
				'contextMenus',
				'activeTab',
				'scripting',
			],
		};
	},
});
