<label
	class="
		inline-flex
		flex-row
		items-center
		cursor-pointer
	"
>
	<input
		type="checkbox"
		class="
			mr-3
			w-[18px]
			h-[18px]
			rounded-md
			text-blue-600
			bg-transparent
			focus:ring-1
			focus:ring-blue-600
			border
			border-gray-300
			checked:border-none
			dark:border-gray-700
			dark:ring-offset-gray-800
		"
		bind:checked
		on:change
	/>
	<span class="select-none">{label}</span>
</label>
<div class="ml-[30px] text-sm text-gray-500">{hint}</div>

<script>
export let checked;
export let label = '';
export let hint = '';
</script>
