<button
	type="button"
	on:click={() => {
		$store.menuOpen = !$store.menuOpen;
	}}
	on:keypress
	{...$$restProps}
>
	<slot />
</button>

<script>
import { useMenuContext } from './Menu.svelte';

const store = useMenuContext();
</script>
