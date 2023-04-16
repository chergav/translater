<label class="text-gray-900 dark:text-white">
	<span class="select-none {label ? 'mr-2' : ''}">{label}</span>
	<select
		class="
			{small ? 'py-[3px] text-sm' : 'py-1.5 text-base' }
			pl-2
			rounded-md
			border-gray-300
			focus:border-indigo-300
			focus:ring
			focus:ring-indigo-200
			focus:ring-opacity-50
			dark:bg-gray-800
			dark:border-gray-700
			dark:placeholder-gray-400
			dark:text-white
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
</script>
