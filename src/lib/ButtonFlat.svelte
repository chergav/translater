<button
	type="button"
	class="
		px-2
		{small ? 'py-1 text-sm' : 'py-1.5 text-base'}
		inline-flex
		items-center
		whitespace-nowrap
		rounded-md
		text-gray-900
		bg-transparent
		dark:text-white
		hover:bg-gray-200
		dark:hover:bg-gray-700
		transition-colors
		select-none
	"
	on:click
>
	{label}
	<slot />
</button>

<script>
export let label = '';
export let small = false;
</script>
