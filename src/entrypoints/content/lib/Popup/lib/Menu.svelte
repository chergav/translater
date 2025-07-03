<div
	class="relative select-none"
	onclickoutside={() => { isOpen = false; }}
	use:clickOutside
>
	<div class="size-fit leading-0">
		<Button
			active={isOpen}
			icon={mdiDotsVertical}
			onclick={() => { isOpen = !isOpen; }}
			size="xs"
		/>
	</div>
	{#if isOpen}
		<div
			class={[
				'absolute top-8 right-0 z-10 flex cursor-default flex-col rounded-[20px] p-1 shadow-lg',
				'border border-color-surface-high bg-color-surface select-none',
			]}
			transition:fly={{
				duration: 150,
				y: -10,
			}}
		>
			<Button
				icon={mdiSwapVertical}
				label={browser.i18n.getMessage('popup_menu_reverse_translate')}
				onclick={handleReverseTranslate}
				size="xs"
				tab
			/>
			<Button
				icon={mdiOpenInNew}
				label="Google Translate"
				onclick={toGoogleTranslate}
				size="xs"
				tab
			/>
			<div class="-mx-1 my-1 border-b border-color-surface-high"></div>
			<Button
				icon={storage.settings.lockWindow ? mdiLockOutline : mdiLockOpenVariantOutline}
				label={storage.settings.lockWindow
					? browser.i18n.getMessage('popup_menu_unlock_window')
					: browser.i18n.getMessage('popup_menu_lock_window')}
				onclick={toggleLockWindow}
				size="xs"
				tab
			/>
			<Button
				icon={isDomainInBlacklist ? mdiTranslate : mdiTranslateOff}
				label={isDomainInBlacklist
					? browser.i18n.getMessage('popup_menu_show_translate_button')
					: browser.i18n.getMessage('popup_menu_hide_translate_button')}
				onclick={addDomainToBlacklist}
				size="xs"
				tab
			/>
			<div class="-mx-1 my-1 border-b border-color-surface-high"></div>
			<Button
				icon={mdiOpenInNew}
				label={browser.i18n.getMessage('popup_menu_options_link')}
				onclick={openOptionsPage}
				size="xs"
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

function toggleLockWindow() {
	storage.settings.lockWindow = !storage.settings.lockWindow;
}
</script>
