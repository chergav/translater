<div class={alert({ variant })}>
	{#if finalIcon}
		<div class="self-start py-px">
			<Icon d={finalIcon} size="22" />
		</div>
	{/if}
	<div class="flex flex-col gap-1">
		{#if finalTitle}
			<div class="font-medium first-letter:uppercase">{finalTitle}</div>
		{/if}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="text-sm whitespace-pre-line">{@html text}</div>
	</div>
</div>

<script lang="ts">
import Icon from '~/lib/Icon.svelte';
import { mdiInformationOutline, mdiCheckCircleOutline, mdiAlertOutline, mdiAlertCircleOutline } from '@mdi/js';
import { tv, type VariantProps } from 'tailwind-variants';

const alert = tv({
	base: 'flex items-center gap-2 rounded-md px-3 py-2 text-base',
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
	icon?: boolean | string
	title?: boolean | string
}

let {
	text,
	variant = 'info',
	icon,
	title,
}: Props = $props();

const variantIcons: Record<Variant, string> = {
	info: mdiInformationOutline,
	success: mdiCheckCircleOutline,
	warning: mdiAlertOutline,
	error: mdiAlertCircleOutline,
};

const finalIcon = $derived(
	icon === false
		? undefined :
		typeof icon === 'string'
			? icon :
			variantIcons[variant],
);

const finalTitle = $derived(title === true ? variant : (title || undefined));
</script>
