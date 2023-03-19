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

<script context="module">
import { loadFont } from '@/common/fontLoader';

loadFont();
</script>

<script>
import TheTrigger from './TheTrigger.svelte';
import { computePosition, offset, flip } from '@floating-ui/dom';
import { persistentStore, themeClass } from '@/common/store';
import { store } from './store';
import { detectLanguage } from '@/common/browserApi';

const reference = {
	getBoundingClientRect: () => $store.selectedEndCoord,
};

const triggerPosition = trigger => {
	computePosition(reference, trigger, {
		strategy: 'absolute',
		placement: 'bottom-end',
		middleware: [
			offset({
				alignmentAxis: 15,
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

const showTrigger = () => $store.isInTextField ? $persistentStore.textFieldButtonShow : $persistentStore.inlineButtonShow;

const isNotYourLang = async () => {
	const selectedText = document.getSelection().toString().trim();

	const detectedLanguage = await detectLanguage(selectedText);

	return $persistentStore.targetLang !== detectedLanguage;
};

let promise = isNotYourLang();
</script>
