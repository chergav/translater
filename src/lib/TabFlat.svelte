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
		? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
		: 'text-gray-500 dark:text-gray-400'}
		{className}
	"
	on:click
>
	{label}
	<slot />
</button>

<script>
export let label = '';
export let className = '';
export let active = false;
export let small = false;
</script>
