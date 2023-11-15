<label class="text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			py-[3px]
			pl-3
			max-w-[210px]
			{small ? 'text-sm' : 'text-base'}
			{round ? 'rounded-full' : 'rounded-lg'}
			border-gray-300
			focus:border-indigo-300
			focus:ring-0
			dark:bg-gray-900
			dark:border-gray-800
			dark:placeholder-gray-400
			dark:text-gray-200
			dark:focus:border-gray-500
			transition-colors
			cursor-pointer
		"
		bind:value
		on:change
	>
		<slot />
	</select>
</label>

<script>
export let value;
export let label = '';
export let small = false;
export let round = false;
</script>
