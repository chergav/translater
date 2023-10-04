<button
	type="button"
	class="
		p-1
		inline-flex
		items-center
		justify-start
		{small ? 'text-sm' : 'text-base'}
		text-gray-800
		dark:text-gray-200
		bg-transparent
		enabled:hover:bg-gray-900/10
		enabled:dark:hover:bg-white/10
		disabled:text-gray-400
		disabled:dark:text-gray-600
		transition-colors
		[&>*]:pointer-events-none
		{round ? 'rounded-full' : 'rounded-lg'}
		{className}
	"
	{disabled}
	on:click
	on:mouseleave
	use:action={tooltip}
>
	{#if icon}
		<Icon d={icon} />
	{/if}
	<slot />
	{#if label}
		<span class="px-2">{label}</span>
	{/if}
	{#if iconRight}
		<Icon d={iconRight} />
	{/if}
</button>

<script>
import Icon from '~/lib/Icon.svelte';
import { tooltip as action } from '~/lib/tooltip';
// import { longpress } from '~/content/utils/longpress';

export let label = '';
export let small = false;
export let disabled = false;
export let round = false;
export let icon = '';
export let iconRight = '';
export let tooltip = {};
let className = '';
export { className as class };
</script>
