<div
	class="
		py-2
		text-sm
		border-b
		border-gray-300
		dark:border-gray-700
		last:border-b-0
	"
	transition:slide|local={{ duration: 250 }}
>
	<div class="mb-2 flex justify-between">
		<span>{getLang(item.sourceLang)} -> {getLang(item.targetLang)}</span>
		<ButtonImage
			round
			on:click={() => {
				deleteHistoryItem(item.time);
			}}
			tooltip={{ title: getMessage('options_delete_history_item'), placement: 'left' }}
		>
			<Icon d={heroTrash} />
		</ButtonImage>
	</div>
	<div bind:this={elemOrig} class:line-clamp-1={truncateOrig}>
		{item.orig}
	</div>
	{#if isOrigCollapsed}
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
	<div bind:this={elemTrans} class="{truncateTrans ? 'line-clamp-1' : ''} text-gray-500">
		{item.trans}
	</div>
	{#if isTransCollapsed}
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
import { onMount } from 'svelte';
import { slide } from 'svelte/transition';
import { persistentStore } from '~/common/store';
import { getMessage } from '~/common/browserApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroTrash } from '~/icons/heroicons';

export let item;

let truncateOrig = true,
	truncateTrans = true,
	elemOrig,
	elemTrans,
	isOrigCollapsed,
	isTransCollapsed;

onMount(() => {
	isOrigCollapsed = elemOrig.scrollHeight > elemOrig.clientHeight;
	isTransCollapsed = elemTrans.scrollHeight > elemTrans.clientHeight;
});
	
const getLang = key => getMessage(`supported_languages_${key.replace('-', '_')}`).toLowerCase();

const deleteHistoryItem = time => {
	$persistentStore.history = $persistentStore.history.filter(i => i.time !== time);
};
</script>
