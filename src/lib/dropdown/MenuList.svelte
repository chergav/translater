{#if $menuOpen}
	<div
		class="
			absolute
			right-0
			w-max
			mt-1
			p-1
			flex
			flex-col
			select-none
			bg-white
			dark:bg-gray-900
			border
			border-gray-100
			dark:border-gray-800
			rounded-xl
			shadow-lg
		"
		transition:fly={{ duration: 150, y: -10, easing: cubicInOut }}
	>
		<slot />
	</div>
{/if}

<script>
import { fly } from 'svelte/transition';
import { cubicInOut } from 'svelte/easing';
import { menuOpen } from './store';
</script>
