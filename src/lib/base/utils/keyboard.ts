export enum Focus {
	First = 'first',
	Prev = 'prev',
	Next = 'next',
	Last = 'last',
}

export function getFocusedIndex(items: HTMLElement[]): number {
	const active = (document.activeElement?.shadowRoot?.activeElement ?? document.activeElement) as HTMLElement;
	return items.indexOf(active);
}

export function getNextIndex(focus: Focus, index: number, total: number): number {
	switch (focus) {
		case Focus.First: return 0;
		case Focus.Last: return total - 1;
		case Focus.Next: return index === -1 ? 0 : (index + 1) % total;
		case Focus.Prev: return index === -1 ? total - 1 : (index - 1 + total) % total;
	}
}

export function focusItem(items: HTMLElement[], focus: Focus): void {
	const index = getFocusedIndex(items);
	items[getNextIndex(focus, index, items.length)]?.focus();
}
