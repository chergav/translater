<div>
	<label
		class="
			relative
			inline-flex
			cursor-pointer
			items-center
		"
	>
		<input class="peer sr-only" type="checkbox" bind:checked />
		<div
			class="
				h-4
				w-[26px]
				rounded-full
				border
				border-gray-500
				bg-gray-200
				transition-all
				peer-checked:border-purple-800

				peer-checked:bg-purple-800
				peer-checked:dark:border-purple-200
				peer-checked:dark:bg-purple-200
				peer-focus-visible:outline

				peer-focus-visible:outline-offset-2
				peer-focus-visible:outline-gray-600
				peer-focus-visible:dark:outline-gray-400
				dark:border-gray-500

				dark:bg-gray-800
			"
		></div>
		<div
			class="
				absolute
				top-0
				bottom-0
				left-1
				my-auto
				h-2
				w-2
				rounded-full
				bg-gray-500
				ring-[6px]
				ring-transparent
				transition-all
				duration-300

				ease-[cubic-bezier(0.175,0.885,0.32,1.275)]
				peer-checked:h-3
				peer-checked:w-3
				peer-checked:translate-x-2
				peer-checked:bg-purple-200
				peer-checked:ring-4

				peer-checked:peer-hover:ring-purple-800/10
				peer-checked:dark:bg-purple-800
				peer-checked:peer-hover:dark:ring-purple-200/10
				peer-hover:ring-gray-600/10
				peer-hover:dark:ring-gray-400/10
				dark:bg-gray-500
			"
		></div>
		<span class="ml-4 whitespace-nowrap text-gray-900 select-none dark:text-gray-300">{label}</span>
	</label>
	{#if hint}
		<p class="ml-[42px] text-sm text-gray-500">{hint}</p>
	{/if}
</div>

<script lang="ts">
interface Props {
	checked: boolean
	label: string
	hint?: boolean
}

let {
	checked = $bindable(),
	label,
	hint,
}: Props = $props();
</script>
