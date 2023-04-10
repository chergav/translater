<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		rounded-md
		bg-transparent
		text-gray-500
		hover:bg-gray-200
		hover:text-gray-900
		dark:hover:bg-gray-700
		dark:text-gray-400
		dark:hover:text-white
		disabled:opacity-50
		transition-colors
	"
	{disabled}
	on:click
	use:action={tooltip}
>
	<slot />
</button>

<script>
import { tooltip as action } from '~/lib/tooltip';

export let tooltip = {};
export let disabled = false;
</script>
