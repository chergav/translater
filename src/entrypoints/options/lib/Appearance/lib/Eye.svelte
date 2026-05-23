<svg class={className} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
	<g fill="currentColor">
		<path d="M10 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"/>
		<path
			clip-rule="evenodd"
			// eslint-disable-next-line @stylistic/max-len
			d="M.664 10.59a1.65 1.65 0 0 1 0-1.186A10 10 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41c.147.381.146.804 0 1.186A10 10 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41M14 10a4 4 0 1 1-8 0a4 4 0 0 1 8 0"
			fill-rule="evenodd"
			{opacity}
		/>
	</g>
</svg>

<script lang="ts">
import type { ClassValue } from 'svelte/elements';

interface Props {
	opacity?: number
	class?: ClassValue
}

let {
	opacity = 1,
	class: className,
}: Props = $props();
</script>
