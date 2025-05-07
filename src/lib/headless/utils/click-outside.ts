import type { Action } from 'svelte/action';

export const clickOutside: Action = node => {
	const handleClick = (event: MouseEvent) => {
		if (node && !event.composedPath().includes(node)) {
			node.dispatchEvent(new CustomEvent('clickoutside'));
		}
	};

	document.addEventListener('mousedown', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleClick, true);
		},
	};
};
