<label class="text-gray-800 dark:text-gray-200">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			py-[3px]
			pl-2
			{small ? 'text-sm' : 'text-base'}
			{round ? 'rounded-full' : 'rounded-lg'}
			border-gray-300
			focus:border-indigo-300
			focus:ring
			focus:ring-indigo-200
			focus:ring-opacity-50
			dark:bg-gray-900
			dark:border-gray-800
			dark:placeholder-gray-400
			dark:text-gray-200
			dark:focus:ring-gray-500
			dark:focus:ring-opacity-50
			dark:focus:border-gray-500
			cursor-pointer
		"
		bind:value
		on:change
	>
		{#each options as { key, value }}
			<option value={key}>{value}</option>
		{/each}
	</select>
</label>

<script>
export let value;
export let label = '';
export let options = [];
export let small = false;
export let round = false;
</script>
