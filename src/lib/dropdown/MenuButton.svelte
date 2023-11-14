<div
	role="button"
	tabindex="-1"
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
