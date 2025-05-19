<div class="relative w-full h-7 flex justify-center items-center {className}">
	<div
		class="
			absolute
			w-full
			h-px
			border
			border-variant-400-600
		"
	></div>
	<div
		class="
			absolute
			h-7
			px-2.5
			flex
			justify-center
			items-center
			bg-surface
		"
	>
		<div class="text-secondary text-base">{label}</div>
	</div>
</div>

<script lang="ts">
interface Props {
	label: string
	class?: string
}

let {
	label,
	class: className = '',
}: Props = $props();
</script>
