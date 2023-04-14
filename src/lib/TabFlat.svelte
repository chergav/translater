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
		<span class="mr-2">{@html icon}</span>
	{/if}
	{label}
	<slot />
	{#if iconRight}
		<span class="ml-2">{@html iconRight}</span>
	{/if}
</button>

<script>
export let label = '';
export let className = '';
export let active = false;
export let small = false;
export let icon = '';
export let iconRight = '';
</script>
