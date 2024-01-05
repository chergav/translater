<Menu class="relative">
	<MenuButton as="div">
		<ButtonImage icon={heroEllipsisVertical} round />
	</MenuButton>
	<MenuItems
		class="
			absolute
			right-0
			mt-1
			flex
			flex-col
			select-none
			bg-white
			dark:bg-gray-900
			border
			border-gray-100
			dark:border-gray-800
			rounded-xl
			shadow-lg
			cursor-default
			z-10
		"
	>
		<div class="p-1 border-b border-gray-100 dark:border-gray-800">
			<MenuItem
				class={menuItemButtonClasses}
				as="button"
				disabled={!$store.translated?.sentences.orig}
				on:click={handleReverseTranslate}
			>
				<Icon class="mr-2" d={heroArrowsUpDown} />
				<span>{getMessage('popup_menu_reverse_translate')}</span>
			</MenuItem>
			<MenuItem
				class={menuItemButtonClasses}
				as="button"
				disabled={!$store.translated?.sentences.orig}
				on:click={toGoogleTranslate}
			>
				<Icon class="mr-2" d={heroArrowTopRightOnSquare} />
				<span>Google Translate</span>
			</MenuItem>
		</div>
		<div class="p-1 border-b border-gray-100 dark:border-gray-800">
			<MenuItem
				class={menuItemButtonClasses}
				as="button"
				noclose
				on:click={() => {
					$persistentStore.lockWindow = !$persistentStore.lockWindow;
				}}
			>
				<Icon class="mr-2" d={$persistentStore.lockWindow ? heroLockOpen : heroLockClosed} />
				<span>{$persistentStore.lockWindow
					? getMessage('popup_menu_unlock_window')
					: getMessage('popup_menu_lock_window')}</span>
			</MenuItem>
			<MenuItem
			class={menuItemButtonClasses}
				as="button"
				disabled={$store.hostname === ''}
				noclose
				on:click={addDomainToBlacklist}
			>
				{#if isDomainInBlacklist}
					<Icon class="mr-2" d={customTranslate} filled stroke="none" />
				{:else}
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<span class="mr-2">{@html iconTranslateOff}</span>
				{/if}
				<span>{isDomainInBlacklist
					? getMessage('popup_menu_show_translate_button')
					: getMessage('popup_menu_hide_translate_button')}</span>
			</MenuItem>
		</div>
		<div class="p-1">
			<MenuItem
				class={menuItemButtonClasses}
				as="button"
				on:click={openOptionsPage}
			>
				<Icon class="mr-2" d={heroArrowTopRightOnSquare} />
				<span>{getMessage('popup_menu_options_link')}</span>
			</MenuItem>
		</div>
	</MenuItems>
</Menu>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage, sendMessage } from '~/common/browserApi';
import { createLinkToGT } from '~/common/googleApi';
import ButtonImage from '~/lib/ButtonImage.svelte';
import {
	Menu,
	MenuButton,
	MenuItems,
	MenuItem
} from '~/lib/headless';
import Icon from '~/lib/Icon.svelte';
import {
	heroEllipsisVertical,
	heroLockClosed,
	heroLockOpen,
	heroArrowTopRightOnSquare,
	heroArrowsUpDown
} from '~/icons/heroicons';
import { customTranslate } from '~/icons/custom';
import iconTranslateOff from '~/icons/translate-off.svg?raw';

const menuItemButtonClasses = `
	w-full
	px-2
	py-1
	whitespace-nowrap
	inline-flex
	items-center
	justify-start
	text-sm
	text-gray-800
	dark:text-gray-200
	bg-transparent
	enabled:hover:bg-gray-800/10
	enabled:dark:hover:bg-gray-200/10
	disabled:opacity-50
	focus:bg-gray-800/10
	focus:dark:bg-gray-200/10
	focus-visible:outline
	focus-visible:outline-1
	focus-visible:outline-gray-800/20
	focus-visible:dark:outline-gray-200/20
	rounded-lg
`;

$: isDomainInBlacklist = $persistentStore.blacklistDomainForInline.includes($store.hostname);

const handleReverseTranslate = () => {
	[$store.sourceLang, $persistentStore.targetLang] = [$persistentStore.targetLang, $store.sourceLang];
	$store.selectedText = $store.translated.sentences.trans;
};

const toGoogleTranslate = () => {
	const url = createLinkToGT({
		sl: $store.sourceLang,
		tl: $persistentStore.targetLang,
		text: $store.translated.sentences.orig
	});

	sendMessage({ type: 'openURL', content: { url } });
};

const addDomainToBlacklist = () => {
	const { blacklistDomainForInline } = $persistentStore;
	const { hostname } = $store;

	$persistentStore.blacklistDomainForInline = isDomainInBlacklist
		? blacklistDomainForInline.filter(i => i !== hostname)
		: [...blacklistDomainForInline, hostname];
};

const openOptionsPage = () => {
	sendMessage({ type: 'openOptionsPage' });
};
</script>
