<div
	class="relative select-none"
	onclickoutside={closeMenu}
	use:clickOutside
>
	<div class="size-fit leading-0">
		<Button
			active={isOpen}
			icon={mdiDotsVertical}
			onclick={toggleMenu}
			size="xs"
		/>
	</div>
	{#if isOpen}
		<div
			class={[
				'absolute top-full right-0 z-10 flex cursor-default flex-col gap-0.5 select-none',
			]}
			onpointerdown={e => e.stopPropagation()}
			role="presentation"
			transition:fly={{
				duration: 150,
				y: -10,
			}}
		>
			<div class="flex flex-col rounded-t-2xl rounded-b-lg bg-color-surface-container-low p-1 shadow-sm">
				<Button
					class="rounded-t-xl"
					icon={mdiSwapVertical}
					label={browser.i18n.getMessage('popup_menu_reverse_translate')}
					menu
					onclick={handleReverseTranslate}
					size="xs"
					tab
				/>
				<Button
					icon={mdiOpenInNew}
					label="Google Translate"
					menu
					onclick={toGoogleTranslate}
					size="xs"
					tab
				/>
			</div>
			<div class="flex flex-col rounded-lg bg-color-surface-container-low p-1 shadow-sm">
				<Button
					icon={storage.settings.lockWindow ? mdiLockOutline : mdiLockOpenVariantOutline}
					label={storage.settings.lockWindow
						? browser.i18n.getMessage('popup_menu_unlock_window')
						: browser.i18n.getMessage('popup_menu_lock_window')}
					menu
					onclick={toggleLockWindow}
					size="xs"
					tab
				/>
				<Button
					icon={isDomainInBlacklist ? mdiTranslate : mdiTranslateOff}
					label={isDomainInBlacklist
						? browser.i18n.getMessage('popup_menu_show_translate_button')
						: browser.i18n.getMessage('popup_menu_hide_translate_button')}
					menu
					onclick={addDomainToBlacklist}
					size="xs"
					tab
				/>
				<Button
					icon={mdiArrowCollapse}
					label={browser.i18n.getMessage('popup_menu_switch_to_simple_mode')}
					menu
					onclick={switchToSimpleMode}
					size="xs"
					tab
				/>
			</div>
			<div class="flex flex-col rounded-t-lg rounded-b-2xl bg-color-surface-container-low p-1 shadow-sm">
				<Button
					class="rounded-b-xl"
					icon={mdiOpenInNew}
					label={browser.i18n.getMessage('popup_menu_options_all_settings')}
					menu
					onclick={openOptionsPage}
					size="xs"
					tab
				/>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
import { type Message, PopupMode } from '~/types';
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
	mdiArrowCollapse,
} from '@mdi/js';
import { clickOutside } from '~/utils';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { createLinkToGT } from '~/entrypoints/background/providers/google';

let isOpen = $state<boolean>(false);
let isDomainInBlacklist = $derived<boolean>(storage.settings.blacklistDomainForInline.includes(store.hostname));

const closeMenu = () => isOpen = false;

const toggleMenu = () => isOpen = !isOpen;

function switchToSimpleMode() {
	storage.settings.popupMode = PopupMode.Simple;
}

function handleReverseTranslate() {
	store.reverseTranslation();
	closeMenu();
}

function toGoogleTranslate() {
	const url = createLinkToGT({
		sl: storage.settings.sourceLang,
		tl: storage.settings.targetLang,
		text: store.translated?.sentence.orig,
	});

	browser.runtime.sendMessage<Message>({
		type: 'openURL',
		content: { url },
	});

	closeMenu();
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

	closeMenu();
}

function toggleLockWindow() {
	storage.settings.lockWindow = !storage.settings.lockWindow;
}
</script>
