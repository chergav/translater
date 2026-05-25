<Progress class={['shrink-0 animate-spin text-color-primary', className]} />

<script lang="ts">
import type { ClassValue } from 'svelte/elements';
import Progress from '~icons/material-symbols/progress-activity';

interface Props {
	class: ClassValue
}

let { class: className }: Props = $props();
</script>
