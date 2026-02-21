export const isInTextField = (target: Element): target is HTMLInputElement | HTMLTextAreaElement =>
	target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

export const getSelectedText = (target: Element): string => {
	if (isInTextField(target)) {
		const { selectionStart, selectionEnd, value } = target;
		if (selectionStart === null || selectionEnd === null) return '';
		return value.substring(selectionStart, selectionEnd).trim();
	}
	return document.getSelection()?.toString().trim() || '';
};

export const getSelectedElemRect = (target: Element | null = document.activeElement): DOMRect | null => {
	if (!target) return null;

	if (isInTextField(target)) {
		return DOMRect.fromRect(target.getBoundingClientRect());
	}

	const selection = document.getSelection();
	if (!selection?.rangeCount || !selection.toString()) return null;
	return DOMRect.fromRect(selection.getRangeAt(0).getBoundingClientRect());
};

export const getSelectedEndCoord = (target: Element): DOMRect | null => {
	if (isInTextField(target)) {
		return DOMRect.fromRect(target.getBoundingClientRect());
	}

	const selection = document.getSelection();
	if (!selection?.rangeCount || selection.isCollapsed) return null;

	const range = selection.getRangeAt(0).cloneRange();
	const rects = range.getClientRects();
	if (!rects.length) return null;

	const lastRect = rects[rects.length - 1]; // fallback if collapsed range has no rects

	range.collapse(false);
	const collapsedRects = range.getClientRects();

	return DOMRect.fromRect(collapsedRects.length > 0 ? range.getBoundingClientRect() : lastRect);
};
