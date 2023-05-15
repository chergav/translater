<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		text-gray-900
		dark:text-white
		enabled:hover:bg-gray-200
		enabled:dark:hover:bg-gray-700
		disabled:opacity-30
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
