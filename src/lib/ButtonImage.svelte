<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		text-gray-800
		dark:text-white
		bg-transparent
		enabled:hover:bg-gray-900/10
		enabled:dark:hover:bg-white/10
		disabled:text-gray-400
		disabled:dark:text-gray-600
		transition-colors
		[&>*]:pointer-events-none
		{round ? 'rounded-full' : 'rounded-md'}
	"
	{disabled}
	on:click
	on:mouseleave
	use:action={tooltip}
>
	<slot />
</button>

<script>
import { tooltip as action } from '~/lib/tooltip';
// import { longpress } from '~/content/utils/longpress';

export let tooltip = {};
export let disabled = false;
export let round = false;
</script>
