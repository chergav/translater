<a
	class={[
		'inline-flex cursor-pointer items-center gap-1 text-blue-600 hover:underline dark:text-blue-400',
		className,
	]}
	{href}
	rel="noopener noreferrer"
	{target}
	{...rest}
>
	<span>{label}</span>
	{#if icon}
		<Icon d={mdiOpenInNew} size="18" />
	{/if}
</a>

<script lang="ts">
import type { HTMLAnchorAttributes } from 'svelte/elements';
import Icon from '~/lib/Icon.svelte';
import { mdiOpenInNew } from '@mdi/js';

interface Props extends HTMLAnchorAttributes {
	href: string
	label: string
	class?: string
	icon?: boolean
}

let {
	href,
	label,
	icon = false,
	class: className = '',
	target = '_blank',
	...rest
}: Props = $props();
</script>
