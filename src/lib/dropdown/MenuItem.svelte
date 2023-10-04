<div
	role="button"
	tabindex="0"
	on:click={() => {
		if (menuClose) $menuOpen = false;
	}}
	on:keypress
>
	<slot />
</div>

<script>
import { menuOpen } from './store';

export let menuClose = false;
</script>
