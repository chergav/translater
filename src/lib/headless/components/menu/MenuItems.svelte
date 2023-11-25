{#if $store.menuOpen}
	<svelte:element
		this={tag}
		role="menu"
		tabindex="0"
		{...$$restProps}
		on:click={() => {
			$store.menuOpen = !$store.menuOpen;
		}}
		on:keypress
		transition:fly={{ duration: 150, y: -10 }}
	>
		<slot />
	</svelte:element>
{/if}

<script>
import { fly } from 'svelte/transition';
import { useMenuContext } from './Menu.svelte';

let tag = 'div';

const store = useMenuContext();
</script>
