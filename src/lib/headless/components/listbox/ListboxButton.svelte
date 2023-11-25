<button
	type="button"
	on:click={() => {
		$store.listboxOpen = !$store.listboxOpen;
	}}
	on:keypress
	{...$$restProps}
>
	<slot />
</button>

<script>
import { useListboxContext } from './Listbox.svelte';

const store = useListboxContext();
</script>
