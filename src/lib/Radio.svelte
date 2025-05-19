<div>
	<label
		class="
			relative
			inline-flex
			items-center
			cursor-pointer
		"
	>
		<input class="sr-only peer" type="radio" {value} bind:group />
		<!-- outer circle -->
		<svg
			class="
				w-5
				h-5
				ring-[10px]
				ring-transparent
				rounded-full
				fill-variant
				peer-checked:fill-accent

				ring-offset-white
				dark:ring-offset-black
				peer-focus-visible:outline-none
				peer-focus-visible:ring-2
				peer-focus-visible:ring-offset-2
				peer-focus-visible:ring-accent

				transition-all
			"
			viewBox="0 0 20 20"
		>
			<mask id="cutout">
				<rect fill="white" height="100%" width="100%" />
				<circle cx="10" cy="10" fill="black" r="8" />
			</mask>
			<circle cx="10" cy="10" mask="url(#cutout)" r="10" />
		</svg>
		<!-- inner circle -->
		<svg
			class="
				absolute
				w-5
				h-5
				fill-accent
				opacity-0
				peer-checked:opacity-100
				peer-checked:animate-circle-grow
				origin-center
				transition-opacity
				duration-[50ms]
			"
			viewBox="0 0 20 20"
		>
			<circle cx="10" cy="10" r="5" />
		</svg>
		<!-- hover elem -->
		<div
			class="
				absolute
				w-10
				h-10
				-ml-[10px]
				rounded-full
				peer-hover:bg-secondary-hover
				peer-checked:peer-hover:bg-accent-primary/10
				transition-colors
			"
		></div>
		<span class="ml-4 text-primary select-none">{label}</span>
	</label>
</div>

<script lang="ts">
interface Props {
	group: string
	value: string
	label: string
}

let {
	group = $bindable(),
	value,
	label,
}: Props = $props();
</script>
