<div class={$themeClass}>
	<div
		id="trigger-contaner"
		class="
			absolute
			z-[99999]
			leading-[0]
			overflow-hidden
		"
		use:triggerPosition
	>
		{#await promise then isNotYourLang}
			{#if showTrigger() && isNotYourLang}
				<TheTrigger />
			{/if}
		{/await}
	</div>
</div>

<svelte:document on:mousedown={removeTrigger} />

<script context="module">
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import { apps } from './index';
import TheTrigger from './TheTrigger.svelte';
import { computePosition, offset, flip } from '@floating-ui/dom';
import { persistentStore, themeClass } from '@/common/store';
import { store } from './store';
import { detectLanguage } from '@/common/browserApi';

const removeTrigger = event => {
	const isLeftClick = event.button === 0;
	if (!isLeftClick) return;

	const isInTriggerElem = event.target.closest(apps.trigger.tag);
	if (isInTriggerElem) return;

	const triggerElem = document.querySelector(apps.trigger.tag);

	if (triggerElem) {
		apps.trigger.app.$destroy();
		triggerElem.remove();
		document.getSelection().removeAllRanges();
	}
};

const reference = {
	getBoundingClientRect: () => $store.selectedEndCoord,
};

const triggerPosition = trigger => {
	computePosition(reference, trigger, {
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [
			offset({
				alignmentAxis: 15, // half button width
			}),
			flip(),
		],
	}).then(({ x, y }) => {
		Object.assign(trigger.style, {
			left: `${x}px`,
			top: `${y}px`,
		});
	});
};

const isOptionShowButton = () => $store.isInTextField ? $persistentStore.textFieldButtonShow : $persistentStore.inlineButtonShow;

const isDomainInBlacklist = () => $persistentStore.blacklistDomainForInline.includes($store.hostname);

const showTrigger = () => isOptionShowButton() && !isDomainInBlacklist();

const isNotYourLang = async () => {
	const selectedText = document.getSelection().toString().trim();

	const detectedLanguage = await detectLanguage(selectedText);

	return $persistentStore.targetLang !== detectedLanguage;
};

let promise = isNotYourLang();
</script>
