<div class="mb-4">
	<Select
		bind:value={$persistentStore.historyLength}
		options={historyOptions}
		label="history length:"
	/>
</div>

<div class="py-4 flex justify-end border-y border-gray-300 dark:border-gray-700">
	<button
		class="
			rounded-md
			text-base
			px-2
			py-1.5
			bg-transparent
			hover:bg-gray-200
			dark:hover:bg-gray-700
			text-gray-900
			dark:text-white
			transition-colors
		"
		on:click={() => {
			$persistentStore.history = [];
		}}
	>
		clear the history
	</button>
</div>
<div class="w-full max-h-[60vh] overflow-y-auto scrollbar">
	{#each $persistentStore.history as historyItem (historyItem.id)}
		<HistoryItem item={historyItem}/>
	{/each}
</div>

<script>
import { persistentStore } from '@/common/store';
import { getMessage } from '@/common/browserApi';
import Select from '@/lib/Select.svelte';
import HistoryItem from './HistoryItem.svelte';

const historyOptions = [
	{ key: 0, value: 'disabled' },
	{ key: 10, value: '10' },
	{ key: 50, value: '50' },
	{ key: 100, value: '100' },
];
</script>
