<div class="flex flex-col gap-2 border-b border-color-surface-high px-6 py-4">
	<div class="flex items-center justify-between">
		<Switch
			class="max-w-96"
			label={browser.i18n.getMessage('options_history_enable')}
			bind:checked={storage.settings.historyEnable}
		/>
		<Button
			icon={mdiTrashCanOutline}
			label={browser.i18n.getMessage('options_clear_history')}
			onclick={clearHistory}
			variant="dangerText"
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
		<span class="whitespace-nowrap">{browser.i18n.getMessage('options_records_in_history')} {storageHistory.settings.history.length}</span>
	</div>
</div>
<div class="scrollbar h-[calc(100%-106px)] w-full overflow-y-auto pr-2 pl-6">
	{#each Object.entries(storageHistory.groupedHistory) as [date, historyItemArray] (date)}
		<div class="py-2 text-sm font-medium text-color-primary">{getRelativeDate(date)}</div>
		{#each historyItemArray as historyItem (historyItem.time)}
			<HistoryEntry {historyItem} />
		{/each}
	{/each}
</div>

<script lang="ts">
import { storage } from '~/shared/storage.svelte';
import { storageHistory } from './storageHistory.svelte';
import Select from '~/lib/Select.svelte';
import Switch from '~/lib/Switch.svelte';
import Button from '~/lib/Button.svelte';
import HistoryEntry from './lib/HistoryEntry.svelte';
import { mdiTrashCanOutline } from '@mdi/js';
import { getRelativeDate } from '~/utils';

function clearHistory() {
	if (confirm('Are you sure?')) {
		storageHistory.clear();
	}
}
</script>
