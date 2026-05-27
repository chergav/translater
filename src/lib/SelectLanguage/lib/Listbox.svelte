<span
	class="relative"
	onclickoutside={() => open = false}
	use:clickOutside
>
	{@render listboxButton({
		toggle: listboxToggle,
		open,
		value,
		triggerKeydown,
	})}

	{#if open}
		<div
			class={[
				'absolute z-20 flex max-h-96 flex-col overflow-hidden rounded-lg shadow-sm',
				'bg-color-surface-container-low',
				isFlipped ? 'bottom-full' : 'top-full',
				alignClass,
			]}
			// onintrostart={() => scrollToSelected()}
			in:fly={{
				y: flyY,
				duration: DURATION_IN,
				easing: expressiveSpatialFast,
			}}
			out:fly={{
				y: flyY,
				duration: DURATION_OUT,
			}}
		>
			<div class="z-1 w-full">
				{@render listboxSearch()}
			</div>
			<div
				bind:this={containerRef}
				id="animate-child"
				class={[
					'flex flex-col justify-between gap-0.5 p-1 select-none',
					'scrollbar overflow-x-clip overflow-y-auto focus:outline-none',
				]}
				onkeydown={handleKeydown}
				role="listbox"
				tabindex="-1"
			>
				{@render children()}
			</div>
		</div>
	{/if}
</span>

<script lang="ts">
import { type Snippet, tick } from 'svelte';
import type { MenuAlign } from '../../base/types';
import { Code } from '../../base/types/keyCodes';
import { fly } from 'svelte/transition';
import { setListboxCtx } from './context';
import { expressiveSpatialFast } from '../../base/utils/md3Easing';
import { clickOutside } from '../../base/utils/clickOutside.svelte';
import { getItems } from '../../base/utils/getItems';
import { alignClasses } from '../../base/utils/helpers';
import { Focus, focusItem } from './utils/keyboard';

interface Props {
	value: string
	open?: boolean
	children: Snippet
	listboxButton: Snippet<[{
		toggle: () => void,
		open?: boolean;
		value?: string
		triggerKeydown?: (e: KeyboardEvent) => void
	}]>
	listboxSearch: Snippet
	triggerRef?: HTMLElement | null
	onchange?: (value: string) => void;
	align?: MenuAlign;
	quick?: boolean
	columns?: number
}

let {
	value = $bindable(),
	open = $bindable(false),
	children,
	listboxButton,
	listboxSearch,
	triggerRef = null,
	onchange,
	align = 'start',
	quick = false,
	columns = 1,
}: Props = $props();

const DROPDOWN_HEIGHT = 384;
let containerRef = $state<HTMLElement | null>(null);
let searchRef = $state<HTMLInputElement | null>(null);
let isFlipped = $state(false);
const alignClass = $derived(alignClasses[align]);
const DURATION_IN = $derived<number>(quick ? 0 : 300);
const DURATION_OUT = $derived<number>(quick ? 0 : 150);
const flyY = $derived<number>(isFlipped ? 20 : -20);

function openListbox() {
	if (triggerRef) {
		const rect = triggerRef.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		isFlipped = spaceBelow < DROPDOWN_HEIGHT;
	}
	open = true;
}

function listboxToggle() {
	if (open) {
		closeWithFocus();
	} else {
		openListbox();
	}
}

function close() {
	open = false;
}

async function closeWithFocus() {
	open = false;
	await tick();
	triggerRef?.focus();
}

function focusFirstItem() {
	const items = getItems(containerRef, 'option');
	items[0]?.focus();
}

setListboxCtx({
	get value() { return value; },
	set value(newValue) {
		if (value === newValue) return;
		value = newValue;
		onchange?.(newValue);
	},
	get open() { return open; },
	get triggerRef() { return triggerRef; },
	set triggerRef(ref) { triggerRef = ref; },
	get searchRef() { return searchRef; },
	set searchRef(ref) { searchRef = ref; },
	toggle: listboxToggle,
	openListbox,
	close,
	closeWithFocus,
	focusFirstItem,
});

function handleKeydown(e: KeyboardEvent) {
	const items = getItems(containerRef, 'option');

	switch (e.code) {
		case Code.ArrowDown:
			e.preventDefault();
			focusItem(items, Focus.Next);
			break;
		case Code.ArrowUp:
			e.preventDefault();
			focusItem(items, Focus.Prev);
			break;
		case Code.ArrowRight:
			e.preventDefault();
			focusItem(items, Focus.NextColumn, columns);
			break;
		case Code.ArrowLeft:
			e.preventDefault();
			focusItem(items, Focus.PrevColumn, columns);
			break;
		case Code.Home:
			e.preventDefault();
			focusItem(items, Focus.First);
			break;
		case Code.End:
			e.preventDefault();
			focusItem(items, Focus.Last);
			break;
		case Code.Tab:
			open = false;
			break;
		case Code.Escape:
			closeWithFocus();
			break;
		default: {
			const isPrintable = e.key.length === 1;
			const isBackspace = e.code === Code.Backspace;
			if (isPrintable || isBackspace) {
				searchRef?.focus();
			}
			break;
		}
	}
}

function triggerKeydown(e: KeyboardEvent) {
	switch (e.code) {
		case Code.ArrowDown:
		case Code.ArrowUp:
			e.preventDefault();
			openListbox();
			break;
	}
}

// function getSelectedItem():  HTMLElement | undefined {
// 	const items = getItems(containerRef, 'option');
// 	const selectedItem = items.find(item => item.ariaSelected === 'true');
// 	return selectedItem;
// }

// async function focusSelected() {
// 	await tick();
// 	const selectedItem = getSelectedItem();
// 	selectedItem?.focus({ preventScroll: true });
// }

// function scrollToSelected() {
// 	const selectedItem = getSelectedItem();
// 	selectedItem?.scrollIntoView({ block: 'nearest' });
// }
</script>
