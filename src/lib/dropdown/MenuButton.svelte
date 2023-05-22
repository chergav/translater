<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => {
	$menuOpen = !$menuOpen;
}}>
	<slot />
</div>

<script>
import { menuOpen } from './store';
</script>
