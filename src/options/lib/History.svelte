<div class="mb-4">
	<Select
		bind:value={$persistentStore.historyLength}
		options={historyOptions}
		label={getMessage('options_history_length')}
	/>
</div>

<div class="py-4 flex justify-between items-center border-y border-gray-300 dark:border-gray-700">
	<span>{getMessage('options_records_in_history')} {$persistentStore.history.length}</span>
	<ButtonFlat
		label={getMessage('options_clear_history')}
		on:click={() => {
			$persistentStore.history = [];
		}}
	/>
</div>
<div class="w-full max-h-[60vh] overflow-y-auto scrollbar">
	{#each Object.entries(dateGroupedArray) as [key, value]}
		<div class="p-2 text-sm text-blue-600">{getRelativeDate(key)}</div>
		{#each value as historyItem (historyItem.time)}
			<HistoryItem item={historyItem} />
		{/each}
	{/each}
</div>

<script>
import { persistentStore } from '~/common/store';
import { getUILanguage, getMessage } from '~/common/browserApi';
import Select from '~/lib/Select.svelte';
import ButtonFlat from '~/lib/ButtonFlat.svelte';
import HistoryItem from './HistoryItem.svelte';

const historyOptions = [
	{ key: 0, value: getMessage('options_history_disable') },
	{ key: 25, value: '25' },
	{ key: 50, value: '50' },
	{ key: 100, value: '100' },
];

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
}
</script>
