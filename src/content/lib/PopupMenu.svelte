<Menu class="relative">
	<MenuButton>
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
			<MenuItem class="whitespace-nowrap">
				<ButtonImage
					class="w-full"
					icon={heroArrowsUpDown}
					label={getMessage('popup_menu_reverse_translate')}
					small
					on:click={handleReverseTranslate}
				/>
			</MenuItem>
			<MenuItem class="whitespace-nowrap">
				<a
					class="
						w-full
						px-2 py-1
						inline-flex
						items-center
						justify-start
						text-sm
						text-gray-800
						dark:text-gray-200
						bg-transparent
						hover:bg-gray-900/10
						dark:hover:bg-white/10
						transition-colors
						rounded-lg
					"
					href={`https://translate.google.com/?
						sl=${$store.sourceLang}&
						tl=${$persistentStore.targetLang}&
						text=${encodeURIComponent($store.selectedText)}`}
						rel="noreferrer"
						target="_blank"
				>
					<div class="flex items-center">
						<Icon class="mr-2" d={heroArrowTopRightOnSquare} />
						<span>Google Translate</span>
					</div>
				</a>
			</MenuItem>
		</div>
		<div class="p-1 border-b border-gray-100 dark:border-gray-800">
			<MenuItem class="whitespace-nowrap" noclose>
				<ButtonImage
					class="w-full"
					icon={$persistentStore.lockWindow ? heroLockOpen : heroLockClosed}
					label={$persistentStore.lockWindow
						? getMessage('popup_menu_unlock_window')
						: getMessage('popup_menu_lock_window')}
					small
					on:click={() => {
						$persistentStore.lockWindow = !$persistentStore.lockWindow;
					}}
				/>
			</MenuItem>
			<MenuItem class="whitespace-nowrap" noclose>
				<ButtonImage
					class="w-full"
					label={isDomainInBlacklist
						? getMessage('popup_menu_show_translate_button')
						: getMessage('popup_menu_hide_translate_button')}
					small
					on:click={addDomainToBlacklist}
				>
					{#if isDomainInBlacklist}
						<Icon class="mr-2" d={customTranslate} filled stroke="none" />
					{:else}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						<span class="mr-2">{@html iconTranslateOff}</span>
					{/if}
				</ButtonImage>
			</MenuItem>
		</div>
		<div class="p-1">
			<MenuItem class="whitespace-nowrap">
				<ButtonImage
					class="w-full"
					icon={heroArrowTopRightOnSquare}
					label={getMessage('popup_menu_options_link')}
					small
					on:click={openOptionsPage}
				/>
			</MenuItem>
		</div>
	</MenuItems>
</Menu>

<script>
import { persistentStore } from '~/common/store';
import { store } from '~/content/store';
import { getMessage, openOptionsPage } from '~/common/browserApi';
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

$: isDomainInBlacklist = $persistentStore.blacklistDomainForInline.includes($store.hostname);

const addDomainToBlacklist = () => {
	const { blacklistDomainForInline } = $persistentStore;
	const { hostname } = $store;

	$persistentStore.blacklistDomainForInline = isDomainInBlacklist
		? blacklistDomainForInline.filter(i => i !== hostname)
		: [...blacklistDomainForInline, hostname];
};

const handleReverseTranslate = () => {
	[$store.sourceLang, $persistentStore.targetLang] = [$persistentStore.targetLang, $store.sourceLang];
	$store.selectedText = $store.translated.sentences.trans;
};
</script>
