<a
	class={[
		'inline-flex cursor-pointer items-center gap-1 text-color-link hover:underline',
		className,
	]}
	{href}
	rel="noopener noreferrer"
	{target}
	{...rest}
>
	<span>{label}</span>
	{#if icon}
		<Icon d={mdiOpenInNew} size={iconSize} />
	{/if}
</a>

<script lang="ts">
import type { ComponentProps } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';
import Icon from '~/lib/Icon.svelte';
import { mdiOpenInNew } from '@mdi/js';

type IconSize = ComponentProps<typeof Icon>['size'];

interface Props extends HTMLAnchorAttributes {
	href: string
	label: string
	class?: string
	icon?: boolean
	iconSize?: IconSize

}

let {
	href,
	label,
	icon = false,
	class: className = '',
	target = '_blank',
	iconSize = '18',
	...rest
}: Props = $props();
</script>
