<div class="px-6 py-4 flex flex-col gap-2 border-b border-gray-300 dark:border-gray-700">
	<div class="flex items-center justify-between">
		<SwitchMini
			label={getMessage('options_history_enable')}
			bind:checked={$persistentStore.historyEnable}
		/>
		<ButtonImage
			color="danger"
			icon={heroTrash}
			label={getMessage('options_clear_history')}
			on:click={() => {
				if (confirm('Are you sure?')) {
					$persistentStore.history = [];
				}
			}}
		/>
	</div>
	<div class="text-sm">
		<Select
			label={getMessage('options_history_length')}
			small
			bind:value={$persistentStore.historyLength}
		>
			{#each [25, 50, 100] as length}
				<option value={length}>{length}</option>
			{/each}
		</Select>
		<span class="mx-1">/</span>
		<span class="whitespace-nowrap">{getMessage('options_records_in_history')} {$persistentStore.history.length}</span>
	</div>
</div>
<div class="w-full h-[calc(100%-101px)] pl-6 pr-2 overflow-y-auto scrollbar">
	{#each Object.entries(dateGroupedArray) as [key, value]}
		<div class="py-2 text-sm text-blue-600">{getRelativeDate(key)}</div>
		{#each value as historyItem (historyItem.time)}
			<HistoryItem item={historyItem} />
		{/each}
	{/each}
</div>

<script>
import { persistentStore } from '~/common/store';
import { getUILanguage, getMessage } from '~/common/browserApi';
import Select from '~/lib/Select.svelte';
import SwitchMini from '~/lib/SwitchMini.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';
import HistoryItem from './HistoryItem.svelte';
import { heroTrash } from '~/icons/heroicons';

const groupByDate = data => data.reduce((acc, obj) => {
	const date = new Date(obj.time).toISOString().split('T')[0]; // 'yyyy-mm-dd'

	if (!acc[date]) {
		acc[date] = [];
	}

	acc[date].push(obj);

	return acc;
}, {});

$: dateGroupedArray = groupByDate($persistentStore.history);

const getRelativeDate = dateString => {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return getMessage('date_today');
	} else if (date.toDateString() === yesterday.toDateString()) {
		return getMessage('date_yesterday');
	}

	const UILanguage = getUILanguage();
	const options = { day: 'numeric', month: 'long', year: 'numeric' };

	return date.toLocaleDateString(UILanguage, options);
};
</script>
