import type { Action } from 'svelte/action';

export const clickOutside: Action<
	HTMLDivElement,
	undefined,
	{
		clickoutside: (e: CustomEvent) => void
	}
> = node => {
	$effect(() => {
		const handleClick = (event: MouseEvent) => {
			const isLeftClick = event.button === 0;

			if (!event.target || !isLeftClick) {
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
