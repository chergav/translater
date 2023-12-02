import Tooltip from './Tooltip.svelte';

export const tooltip = (element, { title = '', placement = 'top', delay = 750 } = {}) => {
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

	const _clearTimeout = () => {
		clearTimeout(timeoutID);
	};

	const removeTooltip = () => {
		_clearTimeout();

		if (tooltipComponent) {
			tooltipComponent.$destroy();
			tooltipComponent = null;
			container.remove();
		}
	};

	element.addEventListener('pointerenter', createTooltip);
	element.addEventListener('pointerleave', removeTooltip);
	element.addEventListener('click', _clearTimeout);

	return {
		update(newOptions) {
			title = newOptions.title;
			if (tooltipComponent) {
				tooltipComponent.$set({ title });
			}
		},
		destroy() {
			removeTooltip();
			element.removeEventListener('pointerenter', createTooltip);
			element.removeEventListener('pointerleave', removeTooltip);
			element.removeEventListener('click', _clearTimeout);
		}
	};
};
