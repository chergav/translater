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
				w-[52px]
				h-8
				rounded-full
				bg-surface-level-1
				border-2
				border-variant-600-400

				ring-offset-white
				dark:ring-offset-black
				peer-focus-visible:outline-none
				peer-focus-visible:ring-2
				peer-focus-visible:ring-offset-2
				peer-focus-visible:ring-accent

				peer-checked:bg-accent-primary
				peer-checked:border-accent-primary

				transition-all
			"
		></div>
		<div
			class="
				absolute
				top-0
				bottom-0
				my-auto
				left-2
				w-4
				h-4
				bg-outline
				peer-hover:bg-outline-hover
				rounded-full
				transition-transform
				duration-300
				ease-[cubic-bezier(0.175,0.885,0.32,1.275)]

				ring-[12px]
				ring-transparent
				peer-hover:ring-hover
				peer-checked:peer-hover:ring-accent-hover

				peer-checked:ring-8
				peer-checked:w-6
				peer-checked:h-6
				peer-checked:translate-x-4
				peer-checked:bg-accent-inverse/80
				peer-hover:peer-checked:bg-accent-inverse/100
			"
		></div>
		<span class="ml-4 text-primary select-none">{label}</span>
	</label>
	{#if hint}
		<p class="ml-[68px] text-sm text-secondary select-none">{hint}</p>
	{/if}
</div>

<script lang="ts">
interface Props {
	checked: boolean
	label: string
	hint?: string
}

let {
	checked = $bindable(),
	label,
	hint,
}: Props = $props();
</script>
