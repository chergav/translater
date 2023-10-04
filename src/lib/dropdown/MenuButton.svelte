<div
	role="button"
	tabindex="0"
	on:click={() => {
		$menuOpen = !$menuOpen;
	}}
	on:keypress
>
	<slot />
</div>

<script>
import { menuOpen } from './store';
</script>
