<div
	class="border-b border-color-surface-high py-2 text-sm last:border-b-0"
	out:slide={{ duration: 250 }}
>
	<div class="mb-2 flex justify-between">
		<div class="flex items-center gap-2">
			<span>{getDisplayedLanguageName(historyItem.sourceLang)} -> {getDisplayedLanguageName(historyItem.targetLang)}</span>
			{#if historyItem.model}
				<span class="text-color-on-surface-variant">
					[{historyItem.model}]
				</span>
			{/if}
		</div>
		<Button
			icon={mdiTrashCanOutline}
			onclick={() => {
				deleteHistoryItem(historyItem.time);
			}}
			size="xs"
			title={browser.i18n.getMessage('options_delete_history_item')}
			variant="dangerText"
		/>
	</div>
	<div class:line-clamp-1={truncateOrig}>
		{historyItem.orig}
	</div>
	{#if truncateOrig || historyItem.orig.length > 100}
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
	{#if truncateTrans || historyItem.trans.length > 100}
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
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import { mdiTrashCanOutline } from '@mdi/js';
import { getDisplayedLanguageName } from '~/shared/languages';

interface Props {
	historyItem: HistoryItem
}

let { historyItem }: Props = $props();

// svelte-ignore state_referenced_locally
let truncateOrig = $state<boolean>(historyItem.orig.length > 100);
// svelte-ignore state_referenced_locally
let truncateTrans = $state<boolean>(historyItem.trans.length > 100);

function deleteHistoryItem(time: number) {
	storage.settings.history = storage.settings.history.filter(i => i.time !== time);
}
</script>
