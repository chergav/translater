<span
	class="relative cursor-default"
	onclickoutside={closeMenu}
	use:clickOutside
>
	<IconButton
		active={menuOpen}
		color="standard"
		onclick={toggleMenu}
		size="xs"
		title="menu"
		bind:ref={buttonMenuRef}
	>
		<MoreVert />
	</IconButton>

	<Menu
		align="end"
		quick={storage.motionDisabled}
		triggerRef={buttonMenuRef}
		bind:open={menuOpen}
	>
		<MenuItem
			disabled={!store.textToTranslate}
			label={browser.i18n.getMessage('popup_menu_reverse_translate')}
			onclick={handleReverseTranslate}
			size="xs"
		>
			{#snippet leadingIcon()}
				<SwapVert />
			{/snippet}
		</MenuItem>
		<MenuItem
			disabled={!store.textToTranslate}
			label="Google Translate"
			onclick={toGoogleTranslate}
			size="xs"
		>
			{#snippet leadingIcon()}
				<GTranslate />
			{/snippet}
			{#snippet trailingIcon()}
				<OpenInNew />
			{/snippet}
		</MenuItem>
		<div class="mx-2 my-1 h-px bg-color-outline-variant"></div>
		<MenuItem
			keepOpen
			label={storage.settings.lockWindow
				? browser.i18n.getMessage('popup_menu_unlock_window')
				: browser.i18n.getMessage('popup_menu_lock_window')}
			onclick={toggleLockWindow}
			size="xs"
		>
			{#snippet leadingIcon()}
				{#if storage.settings.lockWindow}
					<Lock />
				{:else}
					<LockOpen />
				{/if}
			{/snippet}
		</MenuItem>
		<MenuItem
			keepOpen
			label={isDomainInBlacklist
				? browser.i18n.getMessage('popup_menu_show_translate_button')
				: browser.i18n.getMessage('popup_menu_hide_translate_button')}
			onclick={addDomainToBlacklist}
			size="xs"
		>
			{#snippet leadingIcon()}
				{#if isDomainInBlacklist}
					<Visibility />
				{:else}
					<VisibilityOff />
				{/if}
			{/snippet}
		</MenuItem>
		<MenuItem
			label={browser.i18n.getMessage('popup_menu_switch_to_simple_mode')}
			onclick={switchToSimpleMode}
			size="xs"
		>
			{#snippet leadingIcon()}
				<ModeSimple />
			{/snippet}
		</MenuItem>
		<MenuItem
			label={isHoriz
				? browser.i18n.getMessage('options_general_layout_vert')
				: browser.i18n.getMessage('options_general_layout_horiz')}
			onclick={toggleLayout}
			size="xs"
		>
			{#snippet leadingIcon()}
				{#if isHoriz}
					<Vertical />
				{:else}
					<Horizontal />
				{/if}
			{/snippet}
		</MenuItem>
		<div class="mx-2 my-1 h-px bg-color-outline-variant"></div>
		<MenuItem
			label={browser.i18n.getMessage('popup_menu_options_all_settings')}
			onclick={openOptionsPage}
			size="xs"
		>
			{#snippet leadingIcon()}
				<SettingsOutline />
			{/snippet}
			{#snippet trailingIcon()}
				<OpenInNew />
			{/snippet}
		</MenuItem>
	</Menu>
</span>

<script lang="ts">
import { type Message, PopupMode, PopupLayout } from '~/types';
import IconButton from '~/lib/base/IconButton.svelte';
import { Menu, MenuItem } from '~/lib/base/Menu';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { createLinkToGT } from '~/entrypoints/background/providers/google';
import { clickOutside } from '~/utils';
import MoreVert from '~icons/material-symbols/more-vert';
import SwapVert from '~icons/material-symbols/swap-vert-rounded';
import GTranslate from '~icons/material-symbols/g-translate';
import OpenInNew from '~icons/material-symbols/open-in-new-rounded';
import Lock from '~icons/material-symbols/lock-outline';
import LockOpen from '~icons/material-symbols/lock-open-right-outline-rounded';
import Visibility from '~icons/material-symbols/visibility-outline-rounded';
import VisibilityOff from '~icons/material-symbols/visibility-off-outline-rounded';
import ModeSimple from '~icons/material-symbols/close-fullscreen-rounded';
import SettingsOutline from '~icons/material-symbols/settings-outline-rounded';
import Vertical from '~icons/material-symbols/splitscreen-portrait-outline-rounded';
import Horizontal from '~icons/material-symbols/splitscreen-landscape-outline-rounded';

let menuOpen = $state<boolean>(false);
let buttonMenuRef = $state<HTMLButtonElement | null>(null);
let isDomainInBlacklist = $derived<boolean>(storage.settings.blacklistDomainForInline.includes(store.hostname));
const isHoriz = $derived<boolean>(storage.settings.popupLayout === PopupLayout.Horiz);

const closeMenu = () => menuOpen = false;
const toggleMenu = () => menuOpen = !menuOpen;

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
		text: store.textToTranslate,
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
	browser.runtime.sendMessage<Message>({ type: 'openOptionsPage' });

	closeMenu();
}

function toggleLockWindow() {
	storage.settings.lockWindow = !storage.settings.lockWindow;
}

function toggleLayout() {
	storage.settings.popupLayout = storage.settings.popupLayout === PopupLayout.Vert ? PopupLayout.Horiz : PopupLayout.Vert;
}
</script>
