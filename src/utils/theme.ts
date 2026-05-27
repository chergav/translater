import { themeFromSourceColor, MD3Colors, Scheme, schemes } from './material-color-helpers';

type WithStylesheet = typeof globalThis & {
	[stylesheetName: string]: CSSStyleSheet | undefined;
};

export interface SchemePreview {
	scheme: Scheme
	colors: MD3Colors
}

function toVars(colors: MD3Colors) {
	let cssVars = '';
	for (const [key, value] of Object.entries(colors)) {
		cssVars += `--md-color-${key}:${value};`;
	}
	return cssVars;
}

export function generateSchemesPreview(
	seedColorHex: string,
	isDark: boolean,
	contrastLevel: number,
): SchemePreview[] {
	const themes: SchemePreview[] = [];
	for (const scheme of schemes) {
		const colors = themeFromSourceColor(seedColorHex, isDark, contrastLevel, scheme, true);
		themes.push({
			scheme,
			colors,
		});
	}
	return themes;
}

export function buildCustomThemeCSSPreview(
	hexColor: string,
	isDark: boolean,
	contrastLevel: number,
	scheme: Scheme,
): string {
	const colors = themeFromSourceColor(hexColor, isDark, contrastLevel, scheme);

	return `[data-theme-color="custom"]{${toVars(colors)}}`;
}

export function buildCustomThemeCSS(hexColor: string, scheme: Scheme): string {
	const light = themeFromSourceColor(hexColor, false, 0, scheme);
	const lightMediumContrast = themeFromSourceColor(hexColor, false, 0.5, scheme);
	const lightHighContrast = themeFromSourceColor(hexColor, false, 1, scheme);
	const dark = themeFromSourceColor(hexColor, true, 0, scheme);
	const darkMediumContrast = themeFromSourceColor(hexColor, true, 0.5, scheme);
	const darkHighContrast = themeFromSourceColor(hexColor, true, 1, scheme);

	const themeCSS =
		'[data-theme-color="custom"]{' +
		toVars(light) +
		`&:where([data-contrast="medium"]){${toVars(lightMediumContrast)}}` +
		`&:where([data-contrast="high"]){${toVars(lightHighContrast)}}` +
		'&:where([data-theme="dark"]){' +
		toVars(dark) +
		`&:where([data-contrast="medium"]){${toVars(darkMediumContrast)}}` +
		`&:where([data-contrast="high"]){${toVars(darkHighContrast)}}` +
		'}' +
		'}';

	return themeCSS;
}

export function applyThemeString(
	doc: DocumentOrShadowRoot,
	themeString: string,
	ssName = 'custom-theme',
) {
	// Get constructable stylesheet
	let sheet = (globalThis as WithStylesheet)[ssName];
	// Create a new sheet if it doesn't exist already and save it globally.
	if (!sheet) {
		sheet = new CSSStyleSheet();
		(globalThis as WithStylesheet)[ssName] = sheet;
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1928865
		// doc.adoptedStyleSheets.push(sheet);
		doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
	}

	sheet.replaceSync(themeString);
}

export function removeThemeString(
	doc: DocumentOrShadowRoot,
	ssName = 'custom-theme',
) {
	const sheet = (globalThis as WithStylesheet)[ssName];

	if (sheet) {
		doc.adoptedStyleSheets = doc.adoptedStyleSheets.filter(s => s !== sheet);
		delete (globalThis as WithStylesheet)[ssName];
	}
}
