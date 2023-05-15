<button
	type="button"
	class="
		px-2
		{small ? 'py-1 text-sm' : 'py-1.5 text-base'}
		inline-flex
		items-center
		whitespace-nowrap
		rounded-md
		hover:bg-gray-200
		dark:hover:bg-gray-700
		transition
		select-none
		{active
		? 'text-blue-600'
		: 'text-gray-500 dark:text-gray-400'}
		{className}
	"
	on:click
>
	{#if icon}
		<span class="mr-2">
			<Icon d={icon} />
		</span>
	{/if}
	<span>{label}</span>
	<slot />
	{#if iconRight}
		<span class="ml-2">
			<Icon d={icon} />
		</span>
	{/if}
</button>

<script>
import Icon from '~/lib/Icon.svelte';

export let label = '';
export let className = '';
export let active = false;
export let small = false;
export let icon = '';
export let iconRight = '';
</script>
