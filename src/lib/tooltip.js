import Tooltip from './Tooltip.svelte';

export const tooltip = (element, { title = '', placement = 'top', delay = 500 } = {}) => {
	let container,
		tooltipComponent,
		timeoutID;

	const createTooltip = () => {
		if (!title) {
			return;
		}

		timeoutID = setTimeout(() => {
			container = document.createElement('div');

			const translaterShadowRoot = element.closest('.translater-shadow-root');

			(translaterShadowRoot || document.body).append(container);

			tooltipComponent = new Tooltip({
				target: container,
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
