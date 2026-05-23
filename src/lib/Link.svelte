<a
	class={[
		'inline-flex items-center gap-1 text-color-primary hover:underline',
		className,
	]}
	{href}
	rel="noopener noreferrer"
	{target}
	{...rest}
>
	{#if leadingIcon}
		{@render leadingIcon()}
	{/if}
	<span>{label}</span>
	{#if trailingIcon}
		{@render trailingIcon()}
	{/if}
</a>

<script lang="ts">
import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes } from 'svelte/elements';

interface Props extends HTMLAnchorAttributes {
	label: string
	class?: string
	leadingIcon?: Snippet
	trailingIcon?: Snippet
}

let {
	href,
	label,
	leadingIcon,
	trailingIcon,
	class: className = '',
	target = '_blank',
	...rest
}: Props = $props();
</script>
