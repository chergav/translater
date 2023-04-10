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
		<div class="p-2 text-sm text-blue-600">{relativeDate(key)}</div>
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

const groupByDate = array => {
	const dateGroupedArray = {};
	for (let i = 0; i < array.length; i++) {
		const date = new Date(array[i].time);
		const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

		if (!dateGroupedArray[dateString]) {
			dateGroupedArray[dateString] = [];
		}

		dateGroupedArray[dateString].push(array[i]);
	}
	return dateGroupedArray;
};

$: dateGroupedArray = groupByDate($persistentStore.history);

const relativeDate = date => {
	const UILanguage = getUILanguage();
	const d = new Date();
	const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	const yesterday = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() - 1}`;

	if (date === today) {
		return getMessage('date_today');
	} else if (date === yesterday) {
		return getMessage('date_yesterday');
	}

	const dateTimeFormat = new Intl.DateTimeFormat(UILanguage, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return dateTimeFormat.format(new Date(date));
};
</script>
