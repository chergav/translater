<span
	class="relative"
	onclickoutside={() => open = false}
	use:clickOutside
>
	{#if listboxButton}
		{@render listboxButton({
			toggle: listboxToggle,
			open,
			value,
			triggerKeydown,
		})}
	{/if}

	{#if open}
		<div
			class={[
				'absolute top-full z-20 flex max-h-80 flex-col overflow-hidden rounded-2xl shadow-sm',
				color === 'standard' ? 'bg-color-surface-container-low' : 'bg-color-tertiary-container',
				alignClass,
			]}
			in:dropdownTransition={{
				duration: DURATION_IN,
				animateChildSelector: '#animate-child',
				onEnd: scrollToSelected,
			}}
			out:dropdownTransition={{
				duration: DURATION_OUT,
				animateChildSelector: '#animate-child',
			}}
		>
			<ul
				bind:this={containerRef}
				id="animate-child"
				class={[
					'flex flex-1 flex-col justify-between gap-0.5 p-1 select-none',
					'scrollbar overflow-x-clip focus:outline-none',
				]}
				onkeydown={handleKeydown}
				role="listbox"
				tabindex="-1"
			>
				{@render children()}
			</ul>
		</div>
	{/if}
</span>

<script generics="T" lang="ts">
import { type Snippet, tick } from 'svelte';
import type { MenuAlign, MenuColor } from '../types';
import { Code } from '../types/keyCodes';
import { setListboxCtx } from './context';
import { dropdownTransition } from '../utils/transition';
import { clickOutside } from '../utils/clickOutside.svelte';
import { getItems } from '../utils/getItems';
import { alignClasses } from '../utils/helpers';
import { Focus, focusItem } from '../utils/keyboard';

interface Props {
	value: T
	open?: boolean
	children: Snippet
	listboxButton?: Snippet<[{
		toggle: () => void,
		open?: boolean;
		value?: T
		triggerKeydown?: (e: KeyboardEvent) => void
	}]>
	triggerRef?: HTMLElement | null
	onchange?: (value: T) => void;
	align?: MenuAlign;
	color?: MenuColor;
	quick?: boolean
}

let {
	value = $bindable(),
	open = $bindable(false),
	children,
	listboxButton,
	triggerRef = null,
	onchange,
	color = 'standard',
	align = 'start',
	quick = false,
}: Props = $props();

let containerRef = $state<HTMLElement | null>(null);
const alignClass = $derived(alignClasses[align]);
const DURATION_IN = $derived<number>(quick ? 0 : 350);
const DURATION_OUT = $derived<number>(quick ? 0 : 250);

function openListbox() {
	open = true;
	focusSelected();
}

function listboxToggle() {
	if (open) {
		closeWithFocus();
	} else {
		openListbox();
	}
}

async function closeWithFocus() {
	open = false;
	await tick();
	triggerRef?.focus();
}

setListboxCtx({
	get value() { return value; },
	set value(newValue) {
		if (value === newValue) return;
		value = newValue;
		onchange?.(newValue);
	},
	get open() { return open; },
	get color() { return color; },
	get triggerRef() { return triggerRef; },
	set triggerRef(ref) { triggerRef = ref; },
	toggle: listboxToggle,
	openListbox,
	close: closeWithFocus,
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

function getSelectedItem(): HTMLElement | undefined {
	const items = getItems(containerRef, 'option');

	const selectedItem = items.find(item => item.ariaSelected === 'true');
	return selectedItem;
}

async function focusSelected() {
	await tick();
	const selectedItem = getSelectedItem();
	selectedItem?.focus({ preventScroll: true });
}

function scrollToSelected() {
	const selectedItem = getSelectedItem();
	selectedItem?.scrollIntoView({
		block: 'nearest',
		...(quick ? {} : { behavior: 'smooth' }),
	});
}
</script>
