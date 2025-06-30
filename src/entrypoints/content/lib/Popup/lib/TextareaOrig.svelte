<div class="relative z-0 w-full overflow-hidden rounded-xl leading-[0]">
	<div
		bind:this={highlightContainer}
		style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px"
		class={[
			'absolute top-0 right-0 left-0 -z-10 scrollbar-hidden max-h-80 min-h-2.5 w-full overflow-y-auto py-1 pr-9 pl-1',
			'border border-transparent whitespace-pre-line text-transparent',
		]}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedText}
	</div>
	<textarea
		bind:this={textarea}
		style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px"
		class={[
			'z-10 scrollbar max-h-80 min-h-2.5 w-full resize-none overflow-y-auto rounded-xl py-1 pr-9 pl-1 text-base',
			'border border-color-surface-high bg-transparent transition-colors',
			'focus:border-color-outline-variant focus:outline-none',
		]}
		oninput={onInput}
		onscroll={onScroll}
		rows="1"
		spellcheck="false"
		use:focus
		use:resize
	>{store.translated?.sentence.orig || store.textToTranslate}</textarea>
	{#if store.translated?.sentence.orig}
		<div transition:fade={{ duration: 150 }}>
			<Button
				class="absolute top-0.5 right-0.5"
				icon={mdiClose}
				iconSize="20"
				onclick={clearText}
				size="xs"
				title={browser.i18n.getMessage('tooltip_clear_text')}
			/>
		</div>
	{/if}
</div>

<script lang="ts">
import type { Action } from 'svelte/action';
import { fade } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import Button from '~/lib/Button.svelte';
import { mdiClose } from '@mdi/js';
import { escapeRegExp } from '~/utils';

let textarea = $state<HTMLTextAreaElement>();
let highlightContainer = $state<HTMLDivElement>();
let timer = $state<number>();
let highlightedText = $derived.by<string>(() => {
	let text = store.translated?.sentence.orig || store.textToTranslate;

	if (store.textToHighlight) {
		const escapedString = escapeRegExp(store.textToHighlight.trim());
		const re = new RegExp(escapedString, 'g');
		const replaceValue = '<span class="bg-color-primary/15 rounded-xs">$&</span>';
		return text.replace(re, replaceValue);
	}

	return text;
});

function onScroll(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	if (highlightContainer) highlightContainer.scrollTop = target.scrollTop;
}

const resize: Action<HTMLTextAreaElement> = () => {
	$effect(() => {
		if (store.translated?.sentence.orig || storage.settings.fontSize) {
			textareaResize();
		}
	});
};

function textareaResize() {
	if (textarea) {
		textarea.style.height = 'auto';
		const height = Math.max(textarea.scrollHeight, 34) + 2;
		textarea.style.height = `${height}px`;
	}
}

function debounceTranslate(text: string) {
	clearTimeout(timer);
	timer = window.setTimeout(() => {
		if (store.textToTranslate !== text) {
			store.textToTranslate = text;
			store.getTranslate();
		}
	}, 1000);
}

function onInput(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	const text = target.value.trim();
	debounceTranslate(text);
	textareaResize();
}

const focus: Action<HTMLTextAreaElement> = textarea => {
	if (!store.selectedText) {
		textarea.focus();
	}
};

function clearText() {
	if (textarea) {
		textarea.value = '';
		textarea.focus();
	}

	store.resetTranslate();
	textareaResize();
}
</script>
