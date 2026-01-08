import type { Action } from 'svelte/action';

export const elementFocus: Action<
	HTMLElement,
	boolean | undefined
> = (element: HTMLElement, focus?: boolean) => {
	$effect(() => {
		if (focus) {
			element.focus();
		}
	});
};
