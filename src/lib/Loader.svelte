<Icon
	class="animate-spin text-color-primary"
	d={mdiLoading}
	{size}
/>

<script lang="ts">
import type { ComponentProps } from 'svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiLoading } from '@mdi/js';

interface Props {
	size?: ComponentProps<typeof Icon>['size']
}

let { size }: Props = $props();
</script>
