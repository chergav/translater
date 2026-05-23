import type { Action } from 'svelte/action';

export interface ActionParams<T = HTMLElement> {
	exclude?: T | null;
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
			if (!event.target || !isLeftClick) return;

			const path = event.composedPath();
			const target = event.target as Node;
			const isInsideNode = path.includes(node) || node.contains(target);
			const isInsideExclude =
				params?.exclude &&
				(path.includes(params.exclude) || params.exclude.contains(target));

			if (!isInsideNode && !isInsideExclude) {
				node.dispatchEvent(new CustomEvent('clickoutside'));
			}

		};

		document.addEventListener('mousedown', handleClick, true);

		return () => {
			document.removeEventListener('mousedown', handleClick, true);
		};
	});
};
