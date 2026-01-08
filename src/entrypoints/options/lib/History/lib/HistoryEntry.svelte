<div
	class="border-b border-color-surface-high py-2 text-sm last:border-b-0"
	transition:slide={{ duration: 250 }}
>
	<div class="mb-2 flex justify-between">
		<div class="flex items-center gap-2">
			<span>{getLang(historyItem.sourceLang)} -> {getLang(historyItem.targetLang)}</span>
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
			variant="danger"
		/>
	</div>
	<div bind:this={elemOrig} class:line-clamp-1={truncateOrig}>
		{historyItem.orig}
	</div>
	{#if isOrigCollapsed}
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
	<div bind:this={elemTrans} class={[truncateTrans && 'line-clamp-1', 'text-color-on-surface-variant']}>
		{historyItem.trans}
	</div>
	{#if isTransCollapsed}
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

interface Props {
	historyItem: HistoryItem
}

let { historyItem }: Props = $props();

let truncateOrig = $state<boolean>(true);
let truncateTrans = $state<boolean>(true);
let elemOrig = $state<HTMLDivElement>();
let elemTrans = $state<HTMLDivElement>();
let isOrigCollapsed = $derived(elemOrig && elemOrig.scrollHeight > elemOrig.clientHeight);
let isTransCollapsed = $derived(elemTrans && elemTrans.scrollHeight > elemTrans.clientHeight);

// @ts-expect-error ignore messageName
const getLang = (lang: string) => browser.i18n.getMessage(`language_${lang.replace('-', '_')}`).toLowerCase();

function deleteHistoryItem(time: number) {
	storage.settings.history = storage.settings.history.filter(i => i.time !== time);
}
</script>
