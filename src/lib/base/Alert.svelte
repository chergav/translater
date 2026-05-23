<div class={alert({ variant })}>
	{#if Icon}
		<span class="self-start py-px">
			<Icon class="size-5" />
		</span>
	{/if}
	<div class="flex flex-col gap-1">
		{#if finalTitle}
			<div class="font-medium">{finalTitle}</div>
		{/if}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="whitespace-pre-line">{@html text}</div>
	</div>
</div>

<script lang="ts">
import type { Component } from 'svelte';
import { tv, type VariantProps } from 'tailwind-variants';
import Info from '~icons/material-symbols/info-outline-rounded';
import Check from '~icons/material-symbols/check-circle-outline-rounded';
import Warning from '~icons/material-symbols/warning-outline-rounded';
import Error from '~icons/material-symbols/error-outline-rounded';

const alert = tv({
	base: 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
	variants: {
		variant: {
			info: 'bg-blue-800/10 text-blue-800 dark:bg-blue-200/10 dark:text-blue-200',
			success: 'bg-green-800/10 text-green-800 dark:bg-green-200/10 dark:text-green-200',
			warning: 'bg-yellow-800/10 text-yellow-800 dark:bg-yellow-200/10 dark:text-yellow-200',
			error: 'bg-color-error/10 text-color-error',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
});

type AlertVariants = VariantProps<typeof alert>;
type Variant = NonNullable<AlertVariants['variant']>;

interface Props extends AlertVariants {
	text: string
	variant?: Variant
	icon?: boolean
	title?: boolean | string
}

let {
	text,
	variant = 'info',
	icon,
	title,
}: Props = $props();

const variantIcons: Record<Variant, Component> = {
	info: Info,
	success: Check,
	warning: Warning,
	error: Error,
};

const Icon = $derived(icon ? variantIcons[variant] : undefined);
const finalTitle = $derived(title === true ? variant : (title || undefined));
</script>
