export enum Focus {
	First = 'first',
	Prev = 'prev',
	Next = 'next',
	Last = 'last',
	PrevColumn = 'prevColumn',
	NextColumn = 'nextColumn',
}

export function getFocusedIndex(items: HTMLElement[]): number {
	const active = (document.activeElement?.shadowRoot?.activeElement ?? document.activeElement) as HTMLElement;
	return items.indexOf(active);
}

export function getNextIndex(focus: Focus, index: number, total: number, columns = 1): number {
	const rows = Math.ceil(total / columns);

	switch (focus) {
		case Focus.First: return 0;
		case Focus.Last: return total - 1;
		case Focus.Next: return index === -1 ? 0 : (index + 1) % total;
		case Focus.Prev: return index === -1 ? total - 1 : (index - 1 + total) % total;

		case Focus.NextColumn: {
			if (index === -1) return 0;
			const col = Math.floor(index / rows);
			const row = index % rows;
			const nextCol = (col + 1) % columns; // wrap to first column
			const nextIndex = nextCol * rows + row;
			return nextIndex < total ? nextIndex : total - 1;
		}

		case Focus.PrevColumn: {
			if (index === -1) return 0;
			const col = Math.floor(index / rows);
			const row = index % rows;
			const prevCol = (col - 1 + columns) % columns; // wrap to last column
			return prevCol * rows + row;
		}
	}
}

export function focusItem(items: HTMLElement[], focus: Focus, columns = 1): void {
	const index = getFocusedIndex(items);
	items[getNextIndex(focus, index, items.length, columns)]?.focus();
}
