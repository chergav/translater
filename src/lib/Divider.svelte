<div
	class={[
		'flex h-7 w-full items-center',
		className,
	]}
>
	<div class="h-px w-full bg-color-outline-variant"></div>
	<div class="px-2 text-base text-color-on-surface-variant">{label}</div>
	<div class="h-px w-full bg-color-outline-variant"></div>
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
