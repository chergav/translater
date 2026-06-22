<div
	class="py-2 text-sm"
	out:slide={{ duration: 250 }}
>
	<div class="flex justify-between">
		<div class="flex items-center gap-2 text-xs">
			<span class="font-medium">{getDisplayedLanguageName(historyItem.sourceLang)} -> {getDisplayedLanguageName(historyItem.targetLang)}</span>
			{#if historyItem.model}
				<span class="text-color-on-surface-variant">
					[{historyItem.model}]
				</span>
			{/if}
		</div>
		<span
			class="relative"
			onclickoutside={() => menuOpen = false}
			use:clickOutside
		>
			<IconButton
				active={menuOpen}
				color="standard"
				onclick={() => menuOpen = !menuOpen}
				size="xs"
				title="More"
				bind:ref={menuTrigger}
			>
				<More />
			</IconButton>
			<Menu
				align="end"
				triggerRef={menuTrigger}
				bind:open={menuOpen}
			>
				<MenuItem
					disabled={!storageHistory.settings.history.length}
					label={browser.i18n.getMessage('tooltip_copy_to_clipboard')}
					onclick={copyHistoryItem}
					size="xs"
				>
					{#snippet leadingIcon()}
						<Copy />
					{/snippet}
				</MenuItem>
				<div class="mx-2 my-1 h-px bg-color-outline-variant"></div>
				<MenuItem
					disabled={!storageHistory.settings.history.length}
					label={browser.i18n.getMessage('options_delete_history_item')}
					onclick={() => {
						storageHistory.delete(historyItem.time);
					}}
					size="xs"
				>
					{#snippet leadingIcon()}
						<Delete />
					{/snippet}
				</MenuItem>
			</Menu>
		</span>
	</div>
	<div class:line-clamp-1={truncateOrig}>
		{historyItem.orig}
	</div>
	{#if truncateOrig || historyItem.orig.length > stringLengthMax}
		<button
			class="mb-1 cursor-pointer text-xs font-medium text-color-on-surface-variant underline"
			onclick={() => {
				truncateOrig = !truncateOrig;
			}}
			type="button"
		>
			{truncateOrig ? browser.i18n.getMessage('text_expand') : browser.i18n.getMessage('text_collapse')}
		</button>
	{/if}
	<div class={[truncateTrans && 'line-clamp-1', 'text-color-on-surface-variant']}>
		{historyItem.trans}
	</div>
	{#if truncateTrans || historyItem.trans.length > stringLengthMax}
		<button
			class="mb-1 cursor-pointer text-xs font-medium text-color-on-surface-variant underline"
			onclick={() => {
				truncateTrans = !truncateTrans;
			}}
			type="button"
		>
			{truncateTrans ? browser.i18n.getMessage('text_expand') : browser.i18n.getMessage('text_collapse')}
		</button>
	{/if}
</div>

<script lang="ts">
import type { HistoryItem } from '~/types';
import { slide } from 'svelte/transition';
import { storageHistory } from '../storageHistory.svelte';
import { clickOutside } from '~/utils';
import IconButton from '~/lib/base/IconButton.svelte';
import Snackbar from '~/lib/base/Snackbar.svelte';
import { Menu, MenuItem } from '~/lib/base/Menu';
import More from '~icons/material-symbols/more-vert';
import Delete from '~icons/material-symbols/delete-outline-rounded';
import Copy from '~icons/material-symbols/content-copy-outline-rounded';
import { getDisplayedLanguageName } from '~/shared/languages';
import { copyToClipboard } from '~/utils/copyToClipboard';
import { historyItemToString } from '../utils/historyToFormattedText';
import { toast } from 'svelte-sonner';

interface Props {
	historyItem: HistoryItem
}

let { historyItem }: Props = $props();

const stringLengthMax = 90;

let menuOpen = $state<boolean>(false);
let menuTrigger = $state<HTMLButtonElement | null>(null);
let truncateOrig = $derived<boolean>(historyItem.orig.length > stringLengthMax);
let truncateTrans = $derived<boolean>(historyItem.trans.length > stringLengthMax);

async function copyHistoryItem() {
	const text = historyItemToString(historyItem);

	try {
		await copyToClipboard(text);
		toast.custom(Snackbar, {
			componentProps: {
				supportingText: browser.i18n.getMessage('snackbar_copied'),
				closeButton: true,
			},
		});
	} catch (error) {
		toast.error('Failed to copy to clipboard');
		console.error(`Error: ${error}`);
	}
}
</script>
