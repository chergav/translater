<div
	data-accent={storage.settings.accentColor}
	data-theme={storage.themeClass}
	data-variant={storage.settings.themeVariant}
>
	{#await shouldShowButtonPromise then isUserLanguage}
		{#if isUserLanguage && shouldShowTrigger}
			<Trigger />
		{/if}
	{/await}

	{#if store.showPopup}
		<Popup />
	{/if}
</div>

<svelte:document
	onkeyup={onKeyup}
	onmouseup={onMouseup}
/>

<script lang="ts">
import { type Message } from '~/types';
import { onMount, onDestroy } from 'svelte';
import { storage } from '~/shared/storage.svelte';
import { store } from './store.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import Trigger from './lib/Trigger.svelte';
import Popup from './lib/Popup.svelte';
import { getSelectedText, getSelectedElemRect, getSelectedEndCoord, isInTextField } from './utils';
import { CUSTOM_ELEMENT_TAG } from '~/shared/constants';
import { detectLanguage } from '~/shared/browser';
import { isBrowserTranslationAvailable } from '~/entrypoints/background/providers/browser';
import { useDebounce } from 'runed';

let shouldShowButtonPromise = $derived<Promise<boolean>>(shouldShowButton());
let isSettingsShowButton = $derived<boolean>(
	store.isInTextField
		? storage.settings.textFieldButtonShow
		: storage.settings.inlineButtonShow,
);
let isDomainInBlacklist = $derived<boolean>(storage.settings.blacklistDomainForInline.includes(store.hostname));
let shouldShowTrigger = $derived<boolean>(
	!storage.settings.showPopupOnSelection &&
	!!store.selectedText &&
	!!store.selectedEndCoord &&
	isSettingsShowButton &&
	!isDomainInBlacklist,
);
let debounceDuration = $derived<number>(storage.settings.showPopupOnSelection ? 400 : 200);

const debouncedSetup = useDebounce((target: Element) => {
	const isInAppElem = target.closest(CUSTOM_ELEMENT_TAG);
	if (isInAppElem) return;

	const selectedText = getSelectedText(target);

	store.selectedText = selectedText;
	store.selectedElemRect = getSelectedElemRect(target);
	store.selectedEndCoord = getSelectedEndCoord(target);
	store.isInTextField = isInTextField(target);
	store.hostname = window.location.hostname;

	if (storage.settings.showPopupOnSelection && store.selectedText) {
		store.openPopup();
	}
}, () => debounceDuration);

function onMouseup(event: MouseEvent) {
	if (event.button !== 0) return; // is left click
	const target = event.target as Element;
	debouncedSetup(target);
}

function onKeyup(event: KeyboardEvent) {
	const target = event.target as Element;
	const isTextField = isInTextField(target);
	if (!isTextField) return;

	const isSelectAll = (event.ctrlKey || event.metaKey) && event.code === 'KeyA';
	const isShiftSelection = event.shiftKey && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);

	if (!isSelectAll && !isShiftSelection) return;

	debouncedSetup(target);
}

async function shouldShowButton() {
	if (!storage.settings.hideButtonForUserLanguage) return true;

	const detectedLanguage = await detectLanguage(store.selectedText);

	if (!detectedLanguage) return true;
	const userLanguage = browser.i18n.getUILanguage();

	return !userLanguage.startsWith(detectedLanguage);
}

function onMessage(
	message: Message,
	_sender: Browser.runtime.MessageSender,
	sendResponse: (response?: Message) => void,
) {
	if (message.type === 'ping') {
		sendResponse({
			type: 'loaded',
			content: {},
		});
	}

	if (message.type === 'createPopup') {
		store.showPopup = true;
		store.cacheIndex = 0;

		if (message.content.text) {
			store.textToTranslate = message.content.text;
			store.translate();
		}
	}
}

onMount(async () => {
	browser.runtime.onMessage.addListener(onMessage);
	providerStore.isTranslationAPIAvailable = await isBrowserTranslationAvailable();
});

onDestroy(() => {
	browser.runtime.onMessage.removeListener(onMessage);
});
</script>
