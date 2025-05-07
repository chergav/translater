import { Focus } from './enums';

interface Params {
	action: Focus
	items: HTMLLIElement[]
	currentActiveIndex: number | null
}

export function getNextIndex({ action, items, currentActiveIndex }: Params) {
	let nextActiveIndex;
	const activeIndex: number = currentActiveIndex ?? -1;

	switch (action) {
		case Focus.First:
			nextActiveIndex = items.findIndex(v => !v.disabled);
			break;
		case Focus.Prev:
			nextActiveIndex = items.findLastIndex((v, i) => i < activeIndex && !v.disabled);
			break;
		case Focus.Next:
			nextActiveIndex = items.findIndex((v, i) => i > activeIndex && !v.disabled);
			break;
		case Focus.Last:
			nextActiveIndex = items.findLastIndex(v => !v.disabled);
			break;
	}

	return nextActiveIndex === -1 ? currentActiveIndex : nextActiveIndex;
}
