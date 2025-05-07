<div
	class="
		py-2
		text-sm
		border-b
		border-gray-300
		dark:border-gray-700
		last:border-b-0
	"
	transition:slide={{ duration: 250 }}
>
	<div class="mb-2 flex justify-between">
		<span>{getLang(historyItem.sourceLang)} -> {getLang(historyItem.targetLang)}</span>
		<Button
			icon={mdiTrashCanOutline}
			iconSize="20"
			onclick={() => {
				deleteHistoryItem(historyItem.time);
			}}
			small
			title={browser.i18n.getMessage('options_delete_history_item')}
			variant="danger"
		/>
	</div>
	<div bind:this={elemOrig} class:line-clamp-1={truncateOrig}>
		{historyItem.orig}
	</div>
	{#if isOrigCollapsed}
		<button
			class="
				mb-1
				text-xs
				text-gray-500
				underline
				font-medium
				cursor-pointer
			"
			onclick={() => {
				truncateOrig = !truncateOrig;
			}}
			type="button"
		>
			{truncateOrig ? browser.i18n.getMessage('text_expand') : browser.i18n.getMessage('text_collapse')}
		</button>
	{/if}
	<div bind:this={elemTrans} class="{truncateTrans ? 'line-clamp-1' : ''} text-gray-500">
		{historyItem.trans}
	</div>
	{#if isTransCollapsed}
		<button
			class="
				text-xs
				text-gray-500
				underline
				font-medium
				cursor-pointer
			"
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
import type { HistoryItem } from '~/shared/types';
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
