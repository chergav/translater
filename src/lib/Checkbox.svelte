<div>
	<label
		class="
			relative
			inline-flex
			items-center
			cursor-pointer
		"
	>
		<input {name} class="sr-only peer" type="checkbox" bind:checked />
		<!-- outline -->
		<div
			class="
				w-[18px]
				h-[18px]
				rounded-sm
				border-2
				border-variant-600-400
			"
		></div>
		<!-- background -->
		<div
			class="
				absolute
				w-[18px]
				h-[18px]
				rounded-sm
				scale-50
				opacity-0
				peer-checked:bg-accent-primary
				peer-checked:scale-100
				peer-checked:opacity-100
				transition-all
			"
		></div>
		<!-- mark -->
		<svg
			class="
				absolute
				w-[18px]
				h-[18px]
				stroke-none
				fill-none
				peer-checked:fill-white
				peer-checked:dark:fill-black
				scale-50
				peer-checked:scale-100
				transition-transform
				duration-300
			"
			viewBox="0 0 18 18"
		>
			<style>
				rect.mark {
					transform: scaleY(-1) translate(7px, -14px) rotate(45deg);
				}
			</style>
			<rect class="mark" height="6" width="2" />
			<rect class="mark" height="2" width="11" />
		</svg>
		<!-- hover elem -->
		<div
			class="
				absolute
				w-10
				h-10
				-ml-[11px]
				rounded-full
				peer-hover:bg-secondary-hover
				peer-checked:peer-hover:bg-accent-primary/10

				ring-offset-white
				dark:ring-offset-black
				peer-focus-visible:outline-none
				peer-focus-visible:ring-2
				peer-focus-visible:ring-offset-2
				peer-focus-visible:ring-accent

				transition-all
			"
		></div>
		<span class="ml-4 text-primary select-none">{label}</span>
	</label>
	{#if hint}
		<p class="ml-[34px] text-sm text-secondary select-none">{hint}</p>
	{/if}
</div>

<script lang="ts">
interface Props {
	checked: boolean
	label: string
	name?: string
	hint?: string
}

let {
	checked = $bindable(),
	label,
	name,
	hint,
}: Props = $props();
</script>
