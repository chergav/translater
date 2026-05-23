import {
	argbFromHex,
	Hct,
	hexFromArgb,
	MaterialDynamicColors,
	DynamicScheme,
	SchemeMonochrome,
	SchemeTonalSpot,
	SchemeNeutral,
	SchemeVibrant,
	SchemeExpressive,
	SchemeContent,
	SchemeFidelity,
	SchemeFruitSalad,
	SchemeRainbow,
	Platform,
} from '@material/material-color-utilities';

export interface MD3Colors {
	[tokenName: string]: string;
}

export type Scheme = 'monochrome'
	| 'tonal-spot'
	| 'neutral'
	| 'vibrant'
	| 'expressive'
	| 'content'
	| 'fidelity'
	| 'fruit-salad'
	| 'rainbow';

export const schemes: Scheme[] = [
	'tonal-spot',
	'neutral',
	'vibrant',
	'expressive',
	'content',
	'fidelity',
	'fruit-salad',
	'rainbow',
];

const mdc = new MaterialDynamicColors();

/**
 * A Mapping of color token name to MCU HCT color function generator.
 */
const materialColors = {
	primary: mdc.primary(),
	'on-primary': mdc.onPrimary(),
	'primary-container': mdc.primaryContainer(),
	'on-primary-container': mdc.onPrimaryContainer(),

	secondary: mdc.secondary(),
	'on-secondary': mdc.onSecondary(),
	'secondary-container': mdc.secondaryContainer(),
	'on-secondary-container': mdc.onSecondaryContainer(),

	tertiary: mdc.tertiary(),
	'on-tertiary': mdc.onTertiary(),
	'tertiary-container': mdc.tertiaryContainer(),
	'on-tertiary-container': mdc.onTertiaryContainer(),

	error: mdc.error(),
	'on-error': mdc.onError(),
	'error-container': mdc.errorContainer(),
	'on-error-container': mdc.onErrorContainer(),

	background: mdc.background(),
	'on-background': mdc.onBackground(),

	surface: mdc.surface(),
	'on-surface': mdc.onSurface(),
	'surface-dim': mdc.surfaceDim(),
	'surface-bright': mdc.surfaceBright(),
	'surface-variant': mdc.surfaceVariant(),
	'on-surface-variant': mdc.onSurfaceVariant(),

	'surface-container-lowest': mdc.surfaceContainerLowest(),
	'surface-container-low': mdc.surfaceContainerLow(),
	'surface-container': mdc.surfaceContainer(),
	'surface-container-high': mdc.surfaceContainerHigh(),
	'surface-container-highest': mdc.surfaceContainerHighest(),

	outline: mdc.outline(),
	'outline-variant': mdc.outlineVariant(),
	shadow: mdc.shadow(),
	scrim: mdc.scrim(),

	/* not needed for now */
	// 'inverse-primary': mdc.inversePrimary(),
	// 'inverse-surface': mdc.inverseSurface(),
	// 'inverse-on-surface': mdc.inverseOnSurface(),
	// 'surface-tint': mdc.surfaceTint(),
};

const materialColorsPreview = {
	primary: materialColors.primary,
	'secondary-container': materialColors['secondary-container'],
	'tertiary-container': materialColors['tertiary-container'],
};

export function themeFromSourceColor(
	color: string,
	isDark: boolean,
	contrastLevel: number = 0,
	scheme: Scheme = 'tonal-spot',
	preview: boolean = false,
	specVersion: '2021' | '2025' = '2025',
	platform: Platform = 'phone',
): MD3Colors {
	const hct = Hct.fromInt(argbFromHex(color));
	let dynamicScheme: DynamicScheme;

	switch (scheme) {
		case 'monochrome': dynamicScheme = new SchemeMonochrome(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'neutral': dynamicScheme = new SchemeNeutral(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'vibrant': dynamicScheme = new SchemeVibrant(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'expressive': dynamicScheme = new SchemeExpressive(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'content': dynamicScheme = new SchemeContent(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'fidelity': dynamicScheme = new SchemeFidelity(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'fruit-salad': dynamicScheme = new SchemeFruitSalad(hct, isDark, contrastLevel, specVersion, platform); break;
		case 'rainbow': dynamicScheme = new SchemeRainbow(hct, isDark, contrastLevel, specVersion, platform); break;
		default: dynamicScheme = new SchemeTonalSpot(hct, isDark, contrastLevel, specVersion, platform);
	}

	const theme: { [key: string]: string } = {};
	const colors = preview ? materialColorsPreview : materialColors;

	for (const [key, value] of Object.entries(colors)) {
		theme[key] = hexFromArgb(value.getArgb(dynamicScheme));
	}

	return theme;
}
