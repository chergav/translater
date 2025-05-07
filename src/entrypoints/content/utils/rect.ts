export const isInTextField = (): boolean => {
	const active = document.activeElement;
	return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
};

export const getSelectedText = (): string => {
	if (isInTextField()) {
		const textField = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
		const { selectionStart, selectionEnd, value } = textField;
		if (selectionStart !== null && selectionEnd !== null) {
			return value.substring(selectionStart, selectionEnd);
		}
		return '';
	}

	const selection = document.getSelection();
	return selection ? selection.toString().trim() : '';
};

export const getSelectedElemRect = (): DOMRect | null => {
	if (isInTextField()) {
		const field = document.activeElement as HTMLElement;
		return field.getBoundingClientRect();
	}

	const selection = document.getSelection();
	if (!selection || !selection.rangeCount || !selection.toString()) return null;

	const range = selection.getRangeAt(0);
	return range.getBoundingClientRect();
};

// coords of the end of selection
export const getSelectedEndCoord = (): DOMRect | null => {
	if (isInTextField()) {
		const field = document.activeElement as HTMLElement;
		return field.getBoundingClientRect();
	}

	const selection = document.getSelection();
	if (!selection || !selection.rangeCount || selection.isCollapsed) return null;

	const range = selection.getRangeAt(0).cloneRange();
	const rects = range.getClientRects();
	const lastRect = rects[rects.length - 1];

	range.collapse(false); // collapse to end

	const collapsedRects = range.getClientRects();
	if (!collapsedRects.length) return lastRect;

	return range.getBoundingClientRect();
};
