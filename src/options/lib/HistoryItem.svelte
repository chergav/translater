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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
				/>
			</svg>
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
import ButtonClose from '~/lib/ButtonClose.svelte';
import ButtonImage from '~/lib/ButtonImage.svelte';

export let item;

let truncateOrig = true,
	truncateTrans = true;

const getLang = key => getMessage(`supported_languages_${key.replace('-', '_')}`);

const deleteHistoryItem = time => {
	$persistentStore.history = $persistentStore.history.filter(i => i.time !== time);
};
</script>
