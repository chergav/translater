import { defineManifest } from '@crxjs/vite-plugin';
import pkg from '../package.json';

export default defineManifest(() => ({
	manifest_version: 3,
	name: '__MSG_app_name__',
	version: pkg.version,
	description: '__MSG_app_description__',
	author: pkg.author,
	homepage_url: 'https://github.com/chergav/translater',
	default_locale: 'en',
	...(!process.env.FIREFOX && { minimum_chrome_version: '88' }),
	icons: {
		16: 'src/icons/16.png',
		19: 'src/icons/19.png',
		48: 'src/icons/48.png',
		128: 'src/icons/128.png'
	},
	action: {
		default_title: '__MSG_app_name__',
		default_popup: 'src/popup/index.html',
		default_icon: {
			19: 'src/icons/19.png'
		}
	},
	options_ui: {
		page: 'src/options/index.html',
		open_in_tab: true
	},
	content_scripts: [{
		matches: ['<all_urls>'],
		run_at: 'document_idle',
		js: ['src/content/index.js']
	}],
	background: process.env.FIREFOX ?
		{ page: 'src/background/index.html' } :
		{ service_worker: 'src/background/index.js', type: 'module' },
	permissions: [
		'contextMenus',
		'tabs',
		'activeTab',
		'storage'
	],
	host_permissions: ['https://translate.googleapis.com/*'],
	web_accessible_resources: [
		{
			matches: ['<all_urls>'],
			resources: ['src/fonts/*'],
			use_dynamic_url: true
		}
	],
	...(process.env.FIREFOX &&
		{
			browser_specific_settings: {
				gecko: {
					id: 'translater@chergav',
					strict_min_version: '109.0'
				}
			}
		}
	)
}));
