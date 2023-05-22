<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class=""
	on:click={() => {
		if (menuClose) $menuOpen = false;
	}}
>
	<slot />
</div>

<script>
import { menuOpen } from './store';

export let menuClose = false;
</script>
