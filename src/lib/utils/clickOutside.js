export const clickOutside = node => {
	const handleClick = event => {
		const isLeftClick = event.button === 0;

		if (!event.target || !isLeftClick) {
			return;
		}

		if (node && !event.composedPath().includes(node)) {
			node.dispatchEvent(
				new CustomEvent('click_outside', { composed: true })
			);
		}
	};

	// to prevent call immediately on selection
	setTimeout(() => {
		document.addEventListener('mousedown', handleClick, true);
	}, 100);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleClick, true);
		},
	};
};
