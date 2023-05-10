import { createShadowElem } from '~/content/utils/appsHandler';
import Tooltip from './Tooltip.svelte';

export const tooltip = (element, { title = '', placement = 'top', delay = 300 } = {}) => {
	let container,
		tooltipComponent,
		timeoutID;

	const createTooltip = () => {
		if (!title) {
			return;
		}

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
			title = newOptions.title;
			if (tooltipComponent) {
				tooltipComponent.$set({ title });
			}
		},
		destroy() {
			element.removeEventListener('pointerenter', createTooltip);
			element.removeEventListener('pointerleave', removeTooltip);
		}
	};
};
