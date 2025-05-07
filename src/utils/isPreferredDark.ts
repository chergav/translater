/**
 * Returns the user's preferred color scheme.
 *
 * @returns {boolean} `true` if preferred "dark" color scheme; otherwise, `false`.
 */
export function isPreferredDark(): boolean {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
