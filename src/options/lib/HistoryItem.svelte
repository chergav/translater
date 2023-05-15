<div
	class="
		p-2
		text-sm
		border-b
		border-gray-300
		dark:border-gray-700
		last:border-b-0
	"
	transition:slide|local={{ duration: 300 }}
>
	<div class="mb-2 flex justify-between">
		<span>{getLang(item.sourceLang)} -> {getLang(item.targetLang)}</span>
		<ButtonImage
			on:click={() => {
				deleteHistoryItem(item.time);
			}}
			tooltip={{ title: getMessage('options_delete_history_item'), placement: 'left' }}
		>
			<Icon d={heroTrash} />
		</ButtonImage>
	</div>
	<div class={truncateOrig ? 'line-clamp-1' : ''}>
		{item.orig}
	</div>
	{#if item.orig.length > 45}
		<button
			class="
				mb-1
				text-xs
				text-gray-500
				underline
				font-bold
			"
			on:click={() => {
				truncateOrig = !truncateOrig;
			}}
		>
			{truncateOrig ? getMessage('text_expand') : getMessage('text_collapse')}
		</button>
	{/if}
	<div class="{truncateTrans ? 'line-clamp-1' : ''} text-gray-500">
		{item.trans}
	</div>
	{#if item.trans.length > 45}
		<button
			class="
				text-xs
				text-gray-500
				underline
				font-bold
			"
			on:click={() => {
				truncateTrans = !truncateTrans;
			}}
		>
			{truncateTrans ? getMessage('text_expand') : getMessage('text_collapse')}
		</button>
	{/if}
</div>

<script>
import { slide } from 'svelte/transition';
import { persistentStore } from '~/common/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroTrash } from '@icons/heroicons';

export let item;

let truncateOrig = true,
	truncateTrans = true;

const getLang = key => getMessage(`supported_languages_${key.replace('-', '_')}`);

const deleteHistoryItem = time => {
	$persistentStore.history = $persistentStore.history.filter(i => i.time !== time);
};
</script>
