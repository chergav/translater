<div
	class="
		p-2
		text-sm
		border-b
		border-gray-300
		dark:border-gray-700
		last:border-b-0
	"
	transition:slide|local={{duration: 200}}
>
	<div class="mb-2 flex justify-between">
		<span>{getLang(item.sourceLang)} -> {getLang(item.targetLang)}</span>
		<button
			type="button"
			class="
				bg-transparent
				text-gray-500
				hover:bg-gray-200
				hover:text-gray-900
				rounded-full
				p-1
				items-center
				dark:hover:bg-gray-700
				dark:text-gray-400
				dark:hover:text-white
				transition
			"
			on:click={() => {
				deleteHistoryItem(item.id);
			}}
			use:tooltip={{title: 'Delete item', placement: 'left'}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	<div class="{truncateOrig ? 'line-clamp-1' : ''}">
		{item.orig}
	</div>
	{#if item.orig.length > 50}
		<button
			class="
				mt-1
				text-xs
				text-gray-500
				underline
			"
			on:click={() => { truncateOrig = !truncateOrig}}
		>
			{truncateOrig ? 'More' : 'Less'}
		</button>
	{/if}
	<div class="{truncateTrans ? 'line-clamp-1' : ''} text-gray-500">
		{item.trans}
	</div>
	{#if item.trans.length > 50}
		<button
			class="
				mb-1
				text-xs
				text-gray-500
				underline
			"
			on:click={() => { truncateTrans = !truncateTrans}}
		>
			{truncateTrans ? 'More' : 'Less'}
		</button>
	{/if}
</div>

<script>
import { slide } from 'svelte/transition';
import { persistentStore } from '@/common/store';
import { getMessage } from '@/common/browserApi';
import ButtonClose from '@/content/lib/ButtonClose.svelte';
import { tooltip } from '@/lib/tooltip';

export let item;

let truncateOrig = true,
	truncateTrans = true;

const getLang = key => getMessage(`supported_languages_${key.replace('-', '_')}`);

const deleteHistoryItem = id => {
	$persistentStore.history = $persistentStore.history.filter(i => i.id !== id);
};
</script>
