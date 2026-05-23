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
		<IconButton
			color="standard"
			onclick={() => {
				storageHistory.delete(historyItem.time);
			}}
			size="xs"
			title={browser.i18n.getMessage('options_delete_history_item')}
		>
			<Delete />
		</IconButton>
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
import IconButton from '~/lib/base/IconButton.svelte';
import Delete from '~icons/material-symbols/delete-outline-rounded';
import { getDisplayedLanguageName } from '~/shared/languages';

interface Props {
	historyItem: HistoryItem
}

let { historyItem }: Props = $props();

const stringLengthMax = 90;

let truncateOrig = $derived<boolean>(historyItem.orig.length > stringLengthMax);
let truncateTrans = $derived<boolean>(historyItem.trans.length > stringLengthMax);
</script>
