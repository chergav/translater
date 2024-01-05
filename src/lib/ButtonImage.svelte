<button
	class="
		{label ? 'px-2 py-1' : 'p-1'}
		inline-flex
		items-center
		justify-start
		{small ? 'text-sm' : 'text-base'}
		{colors[color]}
		bg-transparent
		disabled:opacity-50
		transition-colors
		[&>*]:pointer-events-none
		{round ? 'rounded-full' : 'rounded-lg'}
		focus-visible:outline
		focus-visible:outline-2
		focus-visible:outline-gray-800/20
		focus-visible:dark:outline-gray-200/20
		{className}
	"
	{disabled}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
	on:keypress
	on:mouseleave
	use:action={tooltip}
>
	{#if icon}
		<Icon d={icon} />
	{/if}
	<slot />
	{#if label}
		<span class={icon ? 'ml-2' : iconRight ? 'mr-2' : ''}>{label}</span>
	{/if}
	{#if iconRight}
		<Icon d={iconRight} />
	{/if}
</button>

<script>
import Icon from '~/lib/Icon.svelte';
import { tooltip as action } from '~/lib/tooltip';

export let label = '';
export let color = 'default';
export let small = false;
export let disabled = false;
export let round = false;
export let icon = null;
export let iconRight = null;
export let tooltip = {};
let className = '';
export { className as class };

const colors = {
	default: 'text-gray-800 dark:text-gray-200 enabled:hover:bg-gray-800/10 enabled:dark:hover:bg-gray-200/10',
	warning: 'text-amber-600 dark:text-amber-400 enabled:hover:bg-amber-600/10 enabled:dark:hover:bg-amber-400/10',
	danger: 'text-red-600 dark:text-red-400 enabled:hover:bg-red-600/10 enabled:dark:hover:bg-red-400/10'
};
</script>
