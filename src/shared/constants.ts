import { getBrowserAndOS } from '~/utils/getBrowserAndOS';

export const CUSTOM_ELEMENT_TAG = 'translator-content-app';
export const ROOT_ELEM_CLASS = 'translator-inline-root';
export const INSTALL_URL = 'https://chergav.github.io/extensions/translater/onboarding/';
export const RATE_MAX_URL = 'https://chromewebstore.google.com/detail/abebconmjhhbcjofpchjkbbimgkhdmbe/reviews';
export const RATE_MAX_URL_FIREFOX = 'https://addons.mozilla.org/firefox/addon/translater-gt/';
// export const RATE_LESS_URL = UNINSTALL_URL;

export const CUSTOM_THEME_PRESET = '[data-theme-color="custom"]{--md-color-primary:#6750a4;--md-color-on-primary:#ffffff;--md-color-primary-container:#e9ddff;--md-color-on-primary-container:#4f378a;--md-color-secondary:#625b71;--md-color-on-secondary:#ffffff;--md-color-secondary-container:#e8def8;--md-color-on-secondary-container:#4a4458;--md-color-tertiary:#7e5260;--md-color-on-tertiary:#ffffff;--md-color-tertiary-container:#ffd9e3;--md-color-on-tertiary-container:#633b48;--md-color-error:#ba1a1a;--md-color-on-error:#ffffff;--md-color-error-container:#ffdad6;--md-color-on-error-container:#93000a;--md-color-background:#f9f9f9;--md-color-on-background:#1b1b1b;--md-color-surface:#f9f9f9;--md-color-on-surface:#1b1b1b;--md-color-surface-dim:#dadada;--md-color-surface-bright:#f9f9f9;--md-color-surface-variant:#e2e2e2;--md-color-on-surface-variant:#474747;--md-color-surface-container-lowest:#ffffff;--md-color-surface-container-low:#f3f3f3;--md-color-surface-container:#eeeeee;--md-color-surface-container-high:#e8e8e8;--md-color-surface-container-highest:#e2e2e2;--md-color-outline:#777777;--md-color-outline-variant:#c6c6c6;--md-color-shadow:#000000;--md-color-scrim:#000000;&:where([data-theme="dark"]){--md-color-primary:#cfbcff;--md-color-on-primary:#381e72;--md-color-primary-container:#4f378a;--md-color-on-primary-container:#e9ddff;--md-color-secondary:#cbc2db;--md-color-on-secondary:#332d41;--md-color-secondary-container:#4a4458;--md-color-on-secondary-container:#e8def8;--md-color-tertiary:#efb8c8;--md-color-on-tertiary:#4a2532;--md-color-tertiary-container:#633b48;--md-color-on-tertiary-container:#ffd9e3;--md-color-error:#ffb4ab;--md-color-on-error:#690005;--md-color-error-container:#93000a;--md-color-on-error-container:#ffdad6;--md-color-background:#131313;--md-color-on-background:#e2e2e2;--md-color-surface:#131313;--md-color-on-surface:#e2e2e2;--md-color-surface-dim:#131313;--md-color-surface-bright:#393939;--md-color-surface-variant:#474747;--md-color-on-surface-variant:#c6c6c6;--md-color-surface-container-lowest:#0e0e0e;--md-color-surface-container-low:#1b1b1b;--md-color-surface-container:#1f1f1f;--md-color-surface-container-high:#2a2a2a;--md-color-surface-container-highest:#353535;--md-color-outline:#919191;--md-color-outline-variant:#474747;--md-color-shadow:#000000;--md-color-scrim:#000000;}}';

export function getUninstallUrl() {
	const browserInfo = getBrowserAndOS();
	const baseUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdpBP5XEL0DwhymukdaFYheKVb0OoY8_-GwpM67PkVi4b_OTA/viewform?usp=pp_url';
	const browser = `${browserInfo.browser} ${browserInfo.version}`;

	return 	`${baseUrl}&entry.1808306337=${browserInfo.os || 'und'}&entry.2085876055=${browser || 'und'}`;
}
