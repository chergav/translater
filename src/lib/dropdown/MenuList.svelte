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
	>
		<slot />
	</div>
{/if}

<script>
import { menuOpen } from './store';
</script>
