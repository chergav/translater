<div class="px-6 py-4 flex flex-col gap-2 border-b border-gray-300 dark:border-gray-700">
	<div class="flex items-center justify-between">
		<Switch
			label={browser.i18n.getMessage('options_history_enable')}
			bind:checked={storage.settings.historyEnable}
		/>
		<Button
			icon={mdiTrashCanOutline}
			label={browser.i18n.getMessage('options_clear_history')}
			onclick={deleteHistory}
			variant="danger"
		/>
	</div>
	<div class="flex items-center gap-2 text-sm">
		<Select
			label={browser.i18n.getMessage('options_history_length')}
			small
			bind:value={storage.settings.historyLength}
		>
			{#each [25, 50, 100] as length (length)}
				<option value={length}>{length}</option>
			{/each}
		</Select>
		<span>/</span>
		<span class="whitespace-nowrap">{browser.i18n.getMessage('options_records_in_history')} {storage.settings.history.length}</span>
	</div>
</div>
<div class="w-full h-[calc(100%-106px)] pl-6 pr-2 overflow-y-auto scrollbar">
	{#each Object.entries(groupedHistory) as [date, historyItemArray] (date)}
		<div class="py-2 text-sm text-purple-700 dark:text-purple-300">{getRelativeDate(date)}</div>
		{#each historyItemArray as historyItem (historyItem.time)}
			<HistoryEntry {historyItem} />
		{/each}
	{/each}
</div>

<script lang="ts">
import type { HistoryItem } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';
import Select from '~/lib/Select.svelte';
import Switch from '~/lib/Switch.svelte';
import Button from '~/lib/Button.svelte';
import HistoryEntry from './lib/HistoryEntry.svelte';
import { mdiTrashCanOutline } from '@mdi/js';
import { formatDate, getRelativeDate } from '~/utils';

interface GroupedHistory {
	[date: string]: HistoryItem[]
}

let groupedHistory = $derived.by(() => {
	const history = $state.snapshot(storage.settings.history);

	history.sort((a, b) => b.time - a.time);

	return history.reduce<GroupedHistory>((acc, item) => {
		const date = formatDate(item.time);
		(acc[date] ||= []).push(item);
		return acc;
	}, {});
});

function deleteHistory() {
	if (confirm('Are you sure?')) {
		storage.settings.history = [];
	}
}
</script>
