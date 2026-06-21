<div class={base()}>
	<span class={textClass()}>{supportingText}</span>
	{#if label || closeButton}
		<span class="flex items-center gap-3">
			{#if label}
				<button
					class={labelClass()}
					onclick={onActionClick}
					type="button"
				>
					<span class={stateLayer()}></span>
					<span class="relative">{label}</span>
				</button>
			{/if}
			{#if closeButton}
				<button
					class="text-color-inverse-on-surface"
					onclick={closeToast}
					title="Close"
					type="button"
				>
					<Close class="size-6" />
				</button>
			{/if}
		</span>
	{/if}
</div>

<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';
import Close from '~icons/material-symbols/close-rounded';

const snackbarVariants = tv({
	slots: {
		base: 'flex h-12 min-w-80 items-center justify-between gap-4 rounded-sm bg-color-inverse-surface pr-3 pl-4 shadow-md',
		textClass : 'text-sm text-color-inverse-on-surface',
		labelClass: 'group relative flex h-8 items-center rounded-full px-3 text-sm font-medium text-color-inverse-primary',
		stateLayer: [
			'pointer-events-none absolute inset-0 rounded-[inherit] bg-color-inverse-primary opacity-0 transition-opacity ease-effects-fast',
			'group-hover:opacity-hover group-focus-visible:opacity-pressed group-active:opacity-pressed',
		],
	},
});

type SnackbarVariants = VariantProps<typeof snackbarVariants>;

interface Props extends SnackbarVariants {
	supportingText: string
	label?: string
	onActionClick?: () => void
	closeButton?: boolean
	closeToast?: () => void
}

let {
	supportingText,
	label,
	onActionClick,
	closeButton,
	closeToast,
}: Props = $props();

const { base, textClass, labelClass, stateLayer } = snackbarVariants();
</script>
