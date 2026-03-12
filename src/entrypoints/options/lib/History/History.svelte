<div class="flex flex-col gap-2 border-b border-color-surface-high px-6 py-4">
	<SettingsGroup>
		<Switch
			icon={mdiHistory}
			label={browser.i18n.getMessage('options_history_enable')}
			bind:checked={storage.settings.historyEnable}
		/>
	</SettingsGroup>
	<div class="flex items-center justify-between gap-2 text-sm">
		<div class="flex items-center gap-2">
			<span class="whitespace-nowrap">{browser.i18n.getMessage('options_records_in_history')}: {storageHistory.settings.history.length}</span>
			<span>/</span>
			<Select
				small
				bind:value={storage.settings.historyLength}
			>
				{#each [25, 50, 100] as length (length)}
					<option value={length}>{length}</option>
				{/each}
			</Select>
		</div>
		<div>
			<Button
				icon={mdiTrashCanOutline}
				label={browser.i18n.getMessage('options_clear_history')}
				onclick={clearHistory}
				variant="dangerText"
			/>
		</div>
	</div>
</div>
<div class="scrollbar min-h-0 flex-1 overflow-y-auto pr-2 pl-6">
	{#each Object.entries(storageHistory.groupedHistory) as [date, historyItemArray] (date)}
		<div class="py-2 text-sm font-medium text-color-primary">{date}</div>
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
import SettingsGroup from '~/lib/SettingsGroup.svelte';
import HistoryEntry from './lib/HistoryEntry.svelte';
import { mdiTrashCanOutline, mdiHistory } from '@mdi/js';

function clearHistory() {
	if (confirm('Are you sure?')) {
		storageHistory.clear();
	}
}
</script>
