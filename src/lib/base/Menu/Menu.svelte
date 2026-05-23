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
				'flex flex-1 flex-col justify-between gap-0.5 overflow-x-clip p-1 select-none',
				'scrollbar focus:outline-none',
			]}
			onkeydown={handleKeydown}
			{...rest}
			role="menu"
			tabindex="-1"
		>
			{@render children()}
		</ul>
	</div>
{/if}

<script lang="ts">
import { type Snippet, tick } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { MenuAlign, MenuColor } from '../types';
import { Code } from '../types/keyCodes';
import { Focus, focusItem } from '../utils/keyboard';
import { getItems } from '../utils/getItems';
import { dropdownTransition } from '../utils/transition';
import { setMenuCtx } from './context';
import { alignClasses } from '../utils/helpers';

interface Props extends HTMLAttributes<HTMLUListElement> {
	open: boolean
	children: Snippet
	triggerRef: HTMLElement | null
	align?: MenuAlign;
	color?: MenuColor;
	quick?: boolean
}

let {
	open = $bindable(false),
	children,
	triggerRef = null,
	color = 'standard',
	align = 'start',
	quick = false,
	...rest
}: Props = $props();

let containerRef = $state<HTMLElement | null>(null);
const alignClass = $derived(alignClasses[align]);
const DURATION_IN = $derived<number>(quick ? 0 : 350);
const DURATION_OUT = $derived<number>(quick ? 0 : 250);

async function closeWithFocus() {
	open = false;
	await tick();
	triggerRef?.focus();
}

setMenuCtx({
	close: closeWithFocus,
	get color() { return color; },
});

function handleKeydown(e: KeyboardEvent) {
	const items = getItems(containerRef, 'menuitem');

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

$effect(() => {
	if (open) {
		tick().then(() => {
			const items = getItems(containerRef, 'menuitem');
			items[0]?.focus({ preventScroll: true });
		});
	}
});
</script>
