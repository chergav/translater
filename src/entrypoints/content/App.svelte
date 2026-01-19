<div
	data-accent={storage.settings.accentColor}
	data-theme={storage.themeClass}
	data-variant={storage.settings.themeVariant}
>
	{#await isTextInTargetLangPromise then isYourLang}
		{#if !isYourLang && isShowTrigger}
			<Trigger />
		{/if}
	{/await}

	{#if store.showPopup}
		<Popup />
	{/if}
</div>

<svelte:document onmouseup={onMouseup} />

<script lang="ts">
import type { Message } from '~/types';
import { storage } from '~/shared/storage.svelte';
import { store } from './store.svelte';
import { providerStore } from '~/entrypoints/options/lib/Providers/providerStore.svelte';
import Trigger from './lib/Trigger.svelte';
import Popup from './lib/Popup/Popup.svelte';
import { getSelectedText, getSelectedElemRect, getSelectedEndCoord, isInTextField } from './utils/coords';
import { CUSTOM_ELEMENT_TAG } from '~/shared/constants';
import { detectLanguage } from '~/shared/browser';
import { isBrowserTranslationAvailable } from '~/entrypoints/background/providers/browser';

let isTextInTargetLangPromise = $derived<Promise<boolean>>(isTextInTargetLang());
let isSettingsShowButton = $derived<boolean>(
	store.isInTextField
		? storage.settings.textFieldButtonShow
		: storage.settings.inlineButtonShow,
);
let isDomainInBlacklist = $derived<boolean>(storage.settings.blacklistDomainForInline.includes(store.hostname));
let isShowTrigger = $derived<boolean>(
	!!store.selectedText &&
	!!store.selectedEndCoord &&
	isSettingsShowButton &&
	!isDomainInBlacklist,
);

function onMouseup(event: MouseEvent) {
	if (event.button !== 0) return; // is left click
	const target = event.target as Element;
	const isInAppElem = target.closest(CUSTOM_ELEMENT_TAG);
	if (isInAppElem) return;

	const selectedText = getSelectedText();

	store.selectedText = selectedText;
	store.selectedElemRect = getSelectedElemRect();
	store.selectedEndCoord = getSelectedEndCoord();
	store.isInTextField = isInTextField();
	store.hostname = window.location.hostname;

	// console.debug('selectedElemRect', store.selectedElemRect);
	// console.debug('selectedEndCoord', store.selectedEndCoord);
}

async function isTextInTargetLang() {
	const detectedLanguage = await detectLanguage(store.selectedText);

	if (!detectedLanguage) return false;

	return storage.settings.targetLang.startsWith(detectedLanguage);
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

	return true;
}

$effect(() => {
	browser.runtime.onMessage.addListener(onMessage);

	return () => {
		browser.runtime.onMessage.removeListener(onMessage);
		storage.destroy();
	};
});

onMount(async () => {
	providerStore.isTranslationAPIAvailable = await isBrowserTranslationAvailable();
});
</script>
