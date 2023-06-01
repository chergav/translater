<div>
	<label
		class="
			relative
			inline-flex
			items-center
			cursor-pointer
		"
	>
		<input type="checkbox" class="sr-only peer" bind:checked />
		<div
			class="
				w-[52px]
				h-8
				rounded-full
				bg-gray-200
				dark:bg-gray-800
				border-2
				border-gray-300
				dark:border-gray-700
				transition-colors

				peer-focus:outline-none
				peer-focus:ring-0
				peer-focus:ring-opacity-30
				peer-focus:ring-blue-600
				dark:peer-focus:ring-gray-500

				peer-checked:bg-blue-600
				peer-checked:border-blue-600
			"
		/>
		<div
			class="
				absolute
				top-0
				bottom-0
				my-auto
				left-2
				w-4
				h-4
				bg-gray-300
				dark:bg-gray-700
				rounded-full
				transition-transform
				duration-300
				ease-[cubic-bezier(0.175,0.885,0.32,1.275)]

				peer-checked:w-6
				peer-checked:h-6
				peer-checked:translate-x-4
				peer-checked:bg-white
			"
		/>
		<span class="ml-3 text-gray-900 dark:text-gray-300 select-none">{label}</span>
	</label>
	<p class="ml-[64px] text-sm text-gray-500">{hint}</p>
</div>

<script>
export let checked;
export let label = '';
export let hint = '';
</script>
