<button
	type="button"
	class="
		hover:text-gray-900
		hover:bg-gray-200
		rounded-md
		text-sm
		p-1
		inline-flex
		items-center
		dark:hover:bg-gray-700
		dark:hover:text-white
		transition
		{expand
		? 'text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-white'
		: 'text-gray-500 dark:text-gray-400'}
	"
	on:click
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="
			w-5
			h-5
			{expand ? 'rotate-180' : ''}
			transition-transform
		"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M19.5 8.25l-7.5 7.5-7.5-7.5"
		/>
	</svg>
</button>

<script>
export let expand;
</script>
