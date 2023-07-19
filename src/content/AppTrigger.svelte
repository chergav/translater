<div class={$themeClass}>
	<div
		class="
			absolute
			z-[9999999]
			leading-[0]
		"
		use:triggerPosition
		use:clickOutside
		on:click_outside={destroyTrigger}
	>
	
		{#await promise then isNotYourLang}
			{#if showTrigger() && isNotYourLang}
				<div transition:fade={{ duration: 100 }}>
					<Trigger />
				</div>
			{/if}
		{/await}
	</div>
</div>

<script context="module">
import { loadFont } from '~/common/fontLoader';

loadFont();
</script>

<script>
import { fade } from 'svelte/transition';
import { destroyApp } from './utils/appsHandler';
import Trigger from './lib/Trigger.svelte';
import { computePosition, offset, flip } from '@floating-ui/dom';
import { persistentStore, themeClass } from '~/common/store';
import { store } from './store';
import { detectLanguage } from '~/common/browserApi';
import { clickOutside } from '~/lib/utils/clickOutside';

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

const destroyTrigger = () => {
	document.getSelection().removeAllRanges();

	destroyApp('trigger');
};
</script>
