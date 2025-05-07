<svelte:element
	this={'div'}
	class={className}
	onclickoutside={() => {
		store.listboxOpen = false;
	}}
	use:clickOutside
	{...rest}
>
	{@render children()}
</svelte:element>

<script lang="ts">
import type { Snippet } from 'svelte';
import { clickOutside } from '../../utils/click-outside';
import { type IStore, setListboxContext } from './context';

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any
	class: string
	open?: boolean
	change?: () => void
	onopen?: () => void
	children: Snippet
}

let {
	value = $bindable(),
	class: className,
	open = $bindable(),
	change,
	onopen,
	children,
	...rest
}: Props = $props();

class Store {
	listboxOpen = $state<IStore['listboxOpen']>(false);
	activeOptionIndex = $state<IStore['activeOptionIndex']>(null);
	buttonRef = $state<IStore['buttonRef']>(null);
	optionsRef = $state<IStore['optionsRef']>([]);
	value = $state<IStore['value']>('');

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	select(newValue: any) {
		this.value = newValue;
		value = newValue;
		if (change) change();
	}
}

const store = new Store();

setListboxContext(store);

$effect(() => {
	store.value = value;
	open = store.listboxOpen;
	if (store.listboxOpen && onopen) onopen();
});
</script>
