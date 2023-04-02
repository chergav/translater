import { createShadowElem } from '@/content/appsHandler';
import Tooltip from './Tooltip.svelte';

export const tooltip = (element, { title = '', placement = 'top', delay = 300 } = {}) => {
	let container,
		tooltipComponent,
		timeoutID;

	const createTooltip = () => {
		timeoutID = setTimeout(() => {
			const { customElement, root } = createShadowElem('translater-shadow-tooltip');

			container = customElement;

			tooltipComponent = new Tooltip({
				target: root,
				props: {
					title,
					placement,
					element
				},
				intro: true
			});
		}, delay);
	};

	const removeTooltip = () => {
		if (tooltipComponent) {
			tooltipComponent.$destroy();
			tooltipComponent = null;
			container.remove();
		}

		clearTimeout(timeoutID);
	};

	element.addEventListener('pointerenter', createTooltip);
	element.addEventListener('pointerleave', removeTooltip);

	return {
		update(newOptions) {
			//console.log(newOptions);
			if (tooltipComponent) {
				tooltipComponent.$set(newOptions);
			} else {
				title = newOptions.title;
			}

		},
		destroy() {
			element.removeEventListener('pointerenter', createTooltip);
			element.removeEventListener('pointerleave', removeTooltip);
		}
	};
};
