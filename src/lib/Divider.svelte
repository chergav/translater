<div class="relative w-full h-7 flex justify-center items-center {className}">
	<div class="absolute w-full h-px border border-gray-300 dark:border-gray-700"></div>
	<div class="absolute h-7 px-2.5 flex justify-center items-center bg-white dark:bg-gray-900">
		<div class="text-gray-400 dark:text-gray-600 text-base">{label}</div>
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
