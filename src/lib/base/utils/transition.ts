import type { TransitionConfig } from 'svelte/transition';
import { expressiveSpatialDefaultCss, effectsDefaultCss } from './md3Easing';

type AnimatedNode = HTMLElement & {
	_slideAnimations?: Animation[];
};

export function dropdownTransition(
	node: AnimatedNode,
	{
		duration = 500,
		animateChildSelector,
		easingRoot = expressiveSpatialDefaultCss,
		easingChild = expressiveSpatialDefaultCss,
		onEnd,
	}: {
		duration?: number
		animateChildSelector?: string
		easingRoot?: string
		easingChild?: string
		onEnd?: () => void
	} = {},
	{ direction }: { direction: 'in' | 'out' | 'both' } = { direction: 'both' },
): TransitionConfig {
	node._slideAnimations?.forEach(a => a.cancel());

	const style = getComputedStyle(node);
	const scrollHeight = node.scrollHeight;
	const maxHeight = parseFloat(style.maxHeight);
	const hasScroll = scrollHeight > maxHeight;
	const targetHeight = hasScroll ? maxHeight : scrollHeight;

	const isIn = direction === 'in';
	const height20pct = targetHeight * 0.2;
	const easingCss = isIn ? easingRoot : effectsDefaultCss;
	const easingChildCss = isIn ? easingChild : effectsDefaultCss;

	const heightAnim = node.animate(
		{
			height: isIn
				? [`${height20pct}px`, `${targetHeight}px`]
				: [`${targetHeight}px`, `${height20pct}px`],
		},
		{
			duration,
			easing: easingCss,
			fill: 'forwards',
		},
	);

	if (animateChildSelector) {
		const child = node.querySelector(animateChildSelector) as AnimatedNode | null;
		if (child) {
			child._slideAnimations?.forEach(a => a.cancel());
			child.style.overflowY = '';
			const flyAnim = child.animate(
				{
					transform: isIn
						? ['translateY(-80%)', 'translateY(0%)']
						: ['translateY(0%)', 'translateY(-80%)'],
				},
				{
					duration,
					easing: easingChildCss,
					fill: 'forwards',
				},
			);
			flyAnim.finished
				.then(() => {
					if (direction === 'in') {
						child.style.overflowY = 'auto';
						onEnd?.();
					}
				})
				.catch(() => {});
			child._slideAnimations = [flyAnim];
		}
	}

	const opacityAnim = node.animate(
		{ opacity: isIn ? [0, 1] : [1, 0] },
		{
			duration: isIn ? duration * 0.5 : duration * 0.75,
			easing: effectsDefaultCss,
			fill: 'forwards',
		},
	);

	node._slideAnimations = [heightAnim, opacityAnim];

	return {
		duration,
		easing: t => t,
		css: () => `overflow: hidden; max-height: ${maxHeight + 10}px;`,
	};
}
