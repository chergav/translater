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
		<div class="flex items-center gap-2">
			<div class="flex items-center gap-0.5">
				{#each sortHistory as { value, title, Icon } (value)}
					<ConnectedButtonRadio
						name="sortOrder"
						color="tonal"
						size="xs"
						{title}
						{value}
						bind:group={storageHistory.sortOrder}
					>
						{#snippet icon()}
							<Icon />
						{/snippet}
						<List class="size-5" />
					</ConnectedButtonRadio>
				{/each}
			</div>
			<HistoryMenu />
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
	{:else}
		<p class="text-center text-sm text-color-on-surface-variant">History is empty</p>
	{/each}
</div>

<script lang="ts">
import type { Component } from 'svelte';
import { storage } from '~/shared/storage.svelte';
import { storageHistory, SortOrder } from './storageHistory.svelte';
import Select from '~/lib/base/Select.svelte';
import Switch from '~/lib/base/Switch.svelte';
import ConnectedButtonRadio from '~/lib/base/ConnectedButtonRadio.svelte';
import SegmentedList from '~/lib/base/SegmentedList.svelte';
import HistoryEntry from './lib/HistoryEntry.svelte';
import HistoryMenu from './lib/HistoryMenu.svelte';
import HistoryRounded from '~icons/material-symbols/history-rounded';
import List from '~icons/material-symbols/list-rounded';
import Ascending from '~icons/material-symbols/arrow-upward-alt-rounded';
import Descending from '~icons/material-symbols/arrow-downward-alt-rounded';

const sortHistory: {
	value: SortOrder
	title: string
	Icon: Component
}[] = [
	{
		value: SortOrder.Asc,
		title: browser.i18n.getMessage('options_history_sort_asc'),
		Icon: Ascending,
	},
	{
		value: SortOrder.Desc,
		title: browser.i18n.getMessage('options_history_sort_desc'),
		Icon: Descending,
	},
];
</script>
