<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		rounded-full
		bg-transparent
		text-gray-500
		hover:bg-gray-200
		hover:text-gray-900
		dark:hover:bg-gray-700
		dark:text-gray-400
		dark:hover:text-white
		transition-colors
	"
	on:click
	use:action={tooltip}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-5 h-5"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
	</svg>
</button>

<script>
import { tooltip as action } from '~/lib/tooltip';

export let tooltip = {};
</script>
