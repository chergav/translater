import { defineManifest } from '@crxjs/vite-plugin';
import pkg from '../package.json';

const isFirefox = process.env.BROWSER === 'firefox';

export default defineManifest(() => ({
	manifest_version: 3,
	name: '__MSG_app_name__',
	version: pkg.version,
	description: '__MSG_app_description__',
	author: pkg.author,
	homepage_url: 'https://github.com/chergav/translater',
	default_locale: 'en',
	...(!isFirefox && { minimum_chrome_version: '93' }),
	icons: {
		16: 'src/icons/16.png',
		24: 'src/icons/24.png',
		32: 'src/icons/32.png',
		48: 'src/icons/48.png',
		128: 'src/icons/128.png'
	},
	action: {
		default_title: '__MSG_app_name__',
		default_popup: 'src/popup/index.html',
		default_icon: {
			16: 'src/icons/16.png',
			24: 'src/icons/24.png',
			32: 'src/icons/32.png',
			48: 'src/icons/48.png',
			128: 'src/icons/128.png'
		}
	},
	commands: {
		'open-translater': {
			suggested_key: {
				default: 'Ctrl+Shift+U',
				mac: 'Command+Shift+U'
			},
			description: '__MSG_commands_open_translater__'
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
	background: isFirefox
		? { page: 'src/background/index.html' }
		: { service_worker: 'src/background/index.js', type: 'module' },
	permissions: [
		'contextMenus',
		// 'tabs',
		'activeTab',
		'storage',
		'scripting'
	],
	host_permissions: ['<all_urls>'],
	web_accessible_resources: [
		{
			matches: ['<all_urls>'],
			resources: ['src/fonts/*'],
			use_dynamic_url: true
		}
	],
	...(isFirefox
		? {
			browser_specific_settings: {
				gecko: {
					id: 'translater@chergav',
					strict_min_version: '109.0'
				}
			},
			optional_permissions: ['<all_urls>']
		}
		: {
			update_url: 'https://raw.githubusercontent.com/chergav/translater/master/extension/translater.xml'
		}
	)
}));
