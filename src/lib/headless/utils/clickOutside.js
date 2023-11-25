export const clickOutside = node => {
	const handleClick = event => {
		if (node && !event.composedPath().includes(node)) {
			node.dispatchEvent(new CustomEvent('click_outside'));
		}
	};

	document.addEventListener('mousedown', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleClick, true);
		}
	};
};
