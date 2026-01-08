import { getBrowserAndOS } from '~/utils/getBrowserAndOS';

export const CUSTOM_ELEMENT_TAG = 'translater-content-app';
export const POPUP_CLASS = 'translater-inline-popup';
// export const UNINSTALL_URL = 'https://forms.gle/C8AtphWDrNa9KxCp6';
export const RATE_MAX_URL = 'https://chromewebstore.google.com/detail/abebconmjhhbcjofpchjkbbimgkhdmbe/reviews';
export const RATE_MAX_URL_FIREFOX = 'https://addons.mozilla.org/firefox/addon/translater-gt/';
// export const RATE_LESS_URL = UNINSTALL_URL;

export function getUninstallUrl() {
	const browserInfo = getBrowserAndOS();
	const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdpBP5XEL0DwhymukdaFYheKVb0OoY8_-GwpM67PkVi4b_OTA/viewform?usp=pp_url';
	const browser = `${browserInfo.browser} ${browserInfo.version}`;

	return 	`${baseUrl}&entry.1808306337=${browserInfo.os || 'und'}&entry.2085876055=${browser || 'und'}`;
}
