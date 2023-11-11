<div class="px-6 pt-6 pb-4 flex items-center">
	<Switch
		label={getMessage('options_history_enable')}
		bind:checked={$persistentStore.historyEnable}
	/>
</div>
<hr class="mx-6 border-t border-gray-300 dark:border-gray-700" />
<div class="px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
	<div class="flex items-center gap-4">
		<Select
			label={getMessage('options_history_length')}
			options={historyOptions}
			bind:value={$persistentStore.historyLength}
		/>
		<span>/</span>
		<span>{getMessage('options_records_in_history')} {$persistentStore.history.length}</span>
	</div>
	<ButtonImage
		label={getMessage('options_clear_history')}
		on:click={() => {
			$persistentStore.history = [];
		}}
	/>
</div>
<div class="w-full h-[calc(100%-143px)] pl-6 pr-2 overflow-y-auto scrollbar">
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
import Switch from '~/lib/Switch.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';
import HistoryItem from './HistoryItem.svelte';

const historyOptions = [
	{ key: 25, value: '25' },
	{ key: 50, value: '50' },
	{ key: 100, value: '100' }
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
};
</script>
