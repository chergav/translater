<div
	class={[
		'relative flex h-7 w-full items-center justify-center',
		className,
	]}
>
	<div class="absolute h-px w-full border border-color-outline-variant"></div>
	<div class="absolute flex h-7 items-center justify-center bg-color-surface px-2.5">
		<div class="text-base text-color-on-surface-variant">{label}</div>
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
