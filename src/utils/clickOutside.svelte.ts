import type { Action } from 'svelte/action';

export interface ActionParams<T = HTMLElement> {
	exclude?: T
}

export const clickOutside: Action<
	HTMLElement,
	ActionParams | undefined,
	{
		clickoutside: (e: CustomEvent) => void
	}
> = (node, params) => {
	$effect(() => {
		const handleClick = (event: MouseEvent) => {
			const isLeftClick = event.button === 0;

			if (!event.target || !isLeftClick) {
				return;
			}

			if (params?.exclude && event.composedPath().includes(params.exclude)) {
				return;
			}

			if (node && !event.composedPath().includes(node)) {
				node.dispatchEvent(new CustomEvent('clickoutside'));
			}
		};

		document.addEventListener('mousedown', handleClick, true);

		return () => {
			document.removeEventListener('mousedown', handleClick, true);
		};
	});
};
