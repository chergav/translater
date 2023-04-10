<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		rounded-md
		bg-transparent
		text-gray-500
		enabled:hover:text-gray-900
		enabled:hover:bg-gray-200
		enabled:dark:hover:bg-gray-700
		dark:text-gray-400
		enabled:dark:hover:text-white
		disabled:opacity-50
		transition-colors
		[&>*]:pointer-events-none
	"
	{disabled}
	on:click
	on:mouseleave
	on:longpress
	use:action={tooltip}
	use:longpress
>
	<slot />
</button>

<script>
import { tooltip as action } from '~/lib/tooltip';
import { longpress } from '~/content/utils/longpress';

export let tooltip = {};
export let disabled = false;
</script>
