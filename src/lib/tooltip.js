import Tooltip from './Tooltip.svelte';
import css from '@/common/global.css?inline';

export const tooltip = (element, { title = '', placement = 'top' } = {}) => {
	let tooltipComponent;
	let container;

	const createShadowElem = tag => {
		container = document.createElement(tag);
		const root = document.createElement('div');
		const styleEl = document.createElement('style');
		const shadowDOM = container.attachShadow({ mode: __DEV__ ? 'open' : 'closed' }) || container;
		styleEl.textContent = css;
		shadowDOM.appendChild(styleEl);
		shadowDOM.appendChild(root);
		document.body.appendChild(container);
		return root;
	};

	const mouseOver = () => {
		const root = createShadowElem('g-translater-tooltip');

		tooltipComponent = new Tooltip({
			props: {
				title,
				placement,
				element
			},
			target: root
		});
	};

	const mouseLeave = () => {
		tooltipComponent.$destroy();
		container.remove();
	};

	element.addEventListener('mouseenter', mouseOver);
	element.addEventListener('mouseleave', mouseLeave);

	return {
		destroy() {
			element.removeEventListener('mouseenter', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
		}
	};
};
