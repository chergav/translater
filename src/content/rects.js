const isInTextField = () => {
	const element = document.activeElement;

	return ['INPUT', 'TEXTAREA'].includes(element.tagName);
};

const getSelectedElemRect = () => {
	if (isInTextField()) return {};

	const selection = document.getSelection();

	if (!selection.rangeCount || !selection.toString()) {
		return {};
	}

	const range = selection.getRangeAt(0).cloneRange();
	if (!range.getClientRects) return {};

	return range.getBoundingClientRect();
};

// returns coord of the end of the selection
const getSelectedEndCoord = () => {
	const selection = document.getSelection();

	if (!selection.rangeCount) return null;

	const range = selection.getRangeAt(0).cloneRange();
	if (!range.getClientRects) return null;

	const rectsNoCollapse = range.getClientRects();

	const lastRect = rectsNoCollapse[rectsNoCollapse.length - 1];

	range.collapse(false);
	const rects = range.getClientRects();

	// if DOMRectList empty
	if (!rects.length) return lastRect;

	return rects[0];
};

export { isInTextField, getSelectedElemRect, getSelectedEndCoord };
