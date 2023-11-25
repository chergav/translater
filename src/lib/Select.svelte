<label class="w-full text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			py-[3px]
			pl-3
			{small ? 'text-sm' : 'text-base'}
			{round ? 'rounded-full' : 'rounded-lg'}
			focus:ring-0
			dark:bg-gray-900
			border-gray-300
			dark:border-gray-800
			dark:placeholder-gray-400
			dark:text-gray-200
			focus:border-gray-400
			focus:dark:border-gray-700
			transition-colors
			cursor-pointer
			{className}
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
let className = '';
export { className as class };
</script>
