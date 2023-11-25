<div>
	<label
		class="
			relative
			inline-flex
			items-center
			cursor-pointer
		"
	>
		<input class="sr-only peer" type="checkbox" bind:checked />
		<div
			class="
				w-[26px]
				h-4
				rounded-full
				bg-gray-200
				dark:bg-gray-800
				border
				border-gray-500
				dark:border-gray-500

				peer-focus-visible:outline
				peer-focus-visible:outline-offset-2
				peer-focus-visible:outline-gray-600
				peer-focus-visible:dark:outline-gray-400

				peer-checked:bg-blue-800
				peer-checked:dark:bg-blue-200
				peer-checked:border-blue-800
				peer-checked:dark:border-blue-200

				transition-all
			"
		/>
		<div
			class="
				absolute
				top-0
				bottom-0
				my-auto
				left-1
				w-2
				h-2
				bg-gray-500
				dark:bg-gray-500
				rounded-full
				transition-all
				duration-300
				ease-[cubic-bezier(0.175,0.885,0.32,1.275)]

				ring-[6px]
				ring-transparent
				peer-hover:ring-gray-600/10
				peer-hover:dark:ring-gray-400/10
				peer-checked:peer-hover:ring-blue-800/10
				peer-checked:peer-hover:dark:ring-blue-200/10

				peer-checked:ring-4
				peer-checked:w-3
				peer-checked:h-3
				peer-checked:translate-x-2
				peer-checked:bg-blue-200
				peer-checked:dark:bg-blue-800
			"
		/>
		<span class="ml-4 text-gray-900 dark:text-gray-300 whitespace-nowrap select-none">{label}</span>
	</label>
	<p class="ml-[42px] text-sm text-gray-500">{hint}</p>
</div>

<script>
export let checked;
export let label = '';
export let hint = '';
</script>
