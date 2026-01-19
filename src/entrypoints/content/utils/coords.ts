export const isInTextField = (): boolean => {
	const activeElement = document.activeElement;
	return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
};

export const getSelectedText = (): string => {
	if (isInTextField()) {
		const textField = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
		const { selectionStart, selectionEnd, value } = textField;

		if (selectionStart === null || selectionEnd === null) return '';

		return value.substring(selectionStart, selectionEnd).trim();
	}

	const selection = document.getSelection();
	return selection?.toString().trim() || '';
};

const cloneDOMRect = (rect: DOMRect): DOMRect => {
	return {
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height,
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
	} as DOMRect;
};

export const getSelectedElemRect = (): DOMRect | null => {
	if (isInTextField()) {
		const field = document.activeElement as HTMLElement;
		const rect = field.getBoundingClientRect();
		return cloneDOMRect(rect);
	}

	const selection = document.getSelection();
	if (!selection?.rangeCount || !selection.toString()) return null;

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();

	return cloneDOMRect(rect);
};

export const getSelectedEndCoord = (): DOMRect | null => {
	if (isInTextField()) {
		const field = document.activeElement as HTMLElement;
		const rect = field.getBoundingClientRect();
		return cloneDOMRect(rect);
	}

	const selection = document.getSelection();
	if (!selection?.rangeCount || selection.isCollapsed) return null;

	const range = selection.getRangeAt(0).cloneRange();
	const rects = range.getClientRects();

	if (!rects.length) return null;

	const lastRect = rects[rects.length - 1];

	// Collapse range to end position
	range.collapse(false);

	const collapsedRects = range.getClientRects();
	const finalRect = collapsedRects.length > 0
		? range.getBoundingClientRect()
		: lastRect;

	return cloneDOMRect(finalRect);
};
