<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		rounded-md
		text-gray-900
		dark:text-white
		enabled:hover:bg-gray-200
		enabled:dark:hover:bg-gray-700
		disabled:opacity-30
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
