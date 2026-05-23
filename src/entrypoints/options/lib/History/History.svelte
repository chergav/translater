<div class="flex flex-col gap-2">
	<SegmentedList>
		<Switch
			label={browser.i18n.getMessage('options_history_enable')}
			bind:checked={storage.settings.historyEnable}
		>
			{#snippet icon()}
				<HistoryRounded />
			{/snippet}
		</Switch>
	</SegmentedList>
	<div class="flex items-center justify-between gap-2 pl-4 text-sm">
		<div class="flex items-center gap-2 text-color-on-surface-variant">
			<span class="whitespace-nowrap">{browser.i18n.getMessage('options_records_in_history')}: {storageHistory.settings.history.length}</span>
			<span>/</span>
			<Select
				size="xs"
				bind:value={storage.settings.historyLength}
			>
				{#each [50, 100, 150] as length (length)}
					<option value={length}>{length}</option>
				{/each}
			</Select>
		</div>
		<div>
			<Button
				color="text"
				label={browser.i18n.getMessage('options_clear_history')}
				onclick={clearHistory}
			>
				{#snippet leadingIcon()}
					<Delete />
				{/snippet}
			</Button>
		</div>
	</div>
</div>
<div class="scrollbar min-h-0 flex-1 overflow-y-auto">
	{#each Object.entries(storageHistory.groupedHistory) as [date, historyItemArray] (date)}
		<h2 class="mt-4 mb-2 px-4 text-sm font-medium text-color-on-surface-variant first:mt-0">{date}</h2>
		<SegmentedList>
			{#each historyItemArray as historyItem (historyItem.time)}
				<HistoryEntry {historyItem} />
			{/each}
		</SegmentedList>
	{/each}
</div>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { storageHistory } from './storageHistory.svelte';
import Select from '~/lib/base/Select.svelte';
import Switch from '~/lib/base/Switch.svelte';
import Button from '~/lib/base/Button.svelte';
import SegmentedList from '~/lib/base/SegmentedList.svelte';
import HistoryEntry from './lib/HistoryEntry.svelte';
import HistoryRounded from '~icons/material-symbols/history-rounded';
import Delete from '~icons/material-symbols/delete-outline-rounded';

function clearHistory() {
	if (confirm('Are you sure?')) {
		storageHistory.clear();
	}
}
</script>
