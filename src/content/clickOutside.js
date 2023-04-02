export const clickOutside = node => {
	const handleClick = event => {
		if (!event.target) {
			return;
		}

		if (node && !event.composedPath().includes(node)) {
			node.dispatchEvent(
				new CustomEvent('click_outside', {
					bubbles: true,
					composed: true
				})
			);
		}
	};

	// to prevent call immediately on selection
	setTimeout(() => {
		document.addEventListener('click', handleClick, true);
	}, 100);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
