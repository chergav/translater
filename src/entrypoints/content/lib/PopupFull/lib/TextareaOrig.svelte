<div class="relative z-0 flex min-h-0 flex-col overflow-hidden">
	<div
		bind:this={highlightContainer}
		style={fontStyles}
		class={[
			'absolute inset-0 -z-10 scrollbar-hidden w-full overflow-y-auto py-1 pr-9 pl-1',
			'border border-transparent whitespace-pre-line text-transparent',
		]}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedText}
	</div>
	<textarea
		style={fontStyles}
		class={[
			'z-10 scrollbar min-h-[38px] w-full resize-none rounded-sm py-1 pr-9 pl-1 whitespace-pre-line',
			'border border-color-surface-high bg-transparent transition-colors hover:border-color-surface-highest',
			'focus:border-color-primary focus:outline-none',
		]}
		{@attach autoResize}
		{@attach focus}
		oninput={onInput}
		onscroll={onScroll}
		rows="1"
		spellcheck="false"
		bind:value
	></textarea>
	{#if value}
		<div
			class="absolute top-1 right-1 z-20"
			transition:fade={{ duration: 150 }}
		>
			<Button
				icon={mdiClose}
				onclick={clearText}
				size="xs"
				title={browser.i18n.getMessage('tooltip_clear_text')}
			/>
		</div>
	{/if}
</div>

<script lang="ts">
import type { Attachment } from 'svelte/attachments';
import { fade } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import { mdiClose } from '@mdi/js';
import { escapeRegExp } from '~/utils';

const MAX_HEIGHT = 300;
let value = $derived(store.translated?.sentence.orig || store.textToTranslate);
let highlightContainer = $state<HTMLDivElement>();
let timeoutId = $state<number>();
const fontStyles = $derived<string>(`font-size: ${storage.settings.fontSize}px; line-height: ${storage.settings.fontSize * 1.6}px`);
let highlightedText = $derived.by<string>(() => {
	let text = $state.snapshot(value);

	if (store.textToHighlight) {
		const escapedString = escapeRegExp(store.textToHighlight.trim());
		const re = new RegExp(escapedString, 'g');
		const replaceValue = '<span class="bg-color-primary/15 rounded-xs">$&</span>';
		return text.replace(re, replaceValue);
	}

	return text;
});

const autoResize: Attachment<HTMLTextAreaElement> = el => {
	if (value !== undefined) {
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + 4 + 'px';
		console.debug('autoResize', el.style.height);
	}
	console.debug('autoResize');
};

function onScroll(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	if (highlightContainer) highlightContainer.scrollTop = target.scrollTop;
}

function debounceTranslate(text: string) {
	clearTimeout(timeoutId);
	timeoutId = window.setTimeout(() => {
		if (store.textToTranslate !== text) {
			store.textToTranslate = text;
			store.translate();
		}
	}, 1000);
}

function onInput(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	const text = target.value.trim();
	debounceTranslate(text);
}

const focus: Attachment<HTMLTextAreaElement> = el => {
	if (!value) el.focus();
};

function clearText() {
	value = '';
	store.resetTranslateStore();
}
</script>
