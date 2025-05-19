<div
	class="relative select-none"
	onclickoutside={() => { isOpen = false; }}
	use:clickOutside
>
	<div class="size-fit leading-0">
		<Button
			active={isOpen}
			icon={mdiDotsVertical}
			iconSize="20"
			onclick={() => { isOpen = !isOpen; }}
			small
		/>
	</div>
	{#if isOpen}
		<div
			class="
				absolute
				top-7
				right-0
				p-1
				flex
				flex-col
				select-none
				bg-surface
				border
				border-variant-200-800
				rounded-[20px]
				shadow-lg
				cursor-default
				z-10
			"
			transition:fly={{
				duration: 150,
				y: -10,
			}}
		>
			<Button
				icon={mdiSwapVertical}
				label={browser.i18n.getMessage('popup_menu_reverse_translate')}
				onclick={handleReverseTranslate}
				small
				tab
			/>
			<Button
				icon={mdiOpenInNew}
				label="Google Translate"
				onclick={toGoogleTranslate}
				small
				tab
			/>
			<div class="my-1 -mx-1 border-b border-variant-200-800"></div>
			<Button
				icon={storage.settings.lockWindow ? mdiLockOutline : mdiLockOpenVariantOutline}
				label={storage.settings.lockWindow
					? browser.i18n.getMessage('popup_menu_unlock_window')
					: browser.i18n.getMessage('popup_menu_lock_window')}
				onclick={() => {
					storage.settings.lockWindow = !storage.settings.lockWindow;
				}}
				small
				tab
			/>
			<Button
				icon={isDomainInBlacklist ? mdiTranslate : mdiTranslateOff}
				label={isDomainInBlacklist
					? browser.i18n.getMessage('popup_menu_show_translate_button')
					: browser.i18n.getMessage('popup_menu_hide_translate_button')}
				onclick={addDomainToBlacklist}
				small
				tab
			/>
			<div class="my-1 -mx-1 border-b border-variant-200-800"></div>
			<Button
				icon={mdiOpenInNew}
				label={browser.i18n.getMessage('popup_menu_options_link')}
				onclick={openOptionsPage}
				small
				tab
			/>
		</div>
	{/if}
</div>

<script lang="ts">
import type { Message } from '~/shared/types';
import { fly } from 'svelte/transition';
import Button from '~/lib/Button.svelte';
import {
	mdiDotsVertical,
	mdiSwapVertical,
	mdiOpenInNew,
	mdiLockOutline,
	mdiLockOpenVariantOutline,
	mdiTranslate,
	mdiTranslateOff,
} from '@mdi/js';
import { clickOutside } from '~/utils';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { createLinkToGT } from '~/entrypoints/background/googleApi';

let isOpen = $state<boolean>(false);
let isDomainInBlacklist = $derived<boolean>(storage.settings.blacklistDomainForInline.includes(store.hostname));

function handleReverseTranslate() {
	[store.sourceLang, storage.settings.targetLang] = [storage.settings.targetLang, store.sourceLang];
	store.textToTranslate = store.translated?.sentence.trans || '';
	store.getTranslate();
	isOpen = false;
}

function toGoogleTranslate() {
	const url = createLinkToGT({
		sl: store.sourceLang,
		tl: storage.settings.targetLang,
		text: store.translated?.sentence.orig,
	});

	browser.runtime.sendMessage<Message>({
		type: 'openURL',
		content: { url },
	});

	isOpen = false;
}

function addDomainToBlacklist() {
	storage.settings.blacklistDomainForInline = isDomainInBlacklist
		? storage.settings.blacklistDomainForInline.filter(i => i !== store.hostname)
		: [...storage.settings.blacklistDomainForInline, store.hostname];
}

function openOptionsPage() {
	browser.runtime.sendMessage<Message>({
		type: 'openOptionsPage',
		content: {},
	});

	isOpen = false;
}
</script>
