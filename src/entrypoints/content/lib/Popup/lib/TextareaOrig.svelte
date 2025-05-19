<div class="relative w-full leading-[0] rounded-xl overflow-hidden z-0">
	<div
		bind:this={highlightContaner}
		style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px"
		class="
			absolute
			top-0
			left-0
			right-0
			w-full
			max-h-80
			min-h-2.5
			pl-1
			py-1
			pr-9
			whitespace-pre-line
			border
			border-transparent
			text-transparent
			overflow-y-auto
			scrollbar-hidden
			-z-10
		"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedText}
	</div>
	<textarea
		bind:this={textarea}
		style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px"
		class="
			w-full
			max-h-80
			min-h-2.5
			pl-1
			py-1
			pr-9
			bg-transparent
			resize-none
			overflow-y-auto
			border
			border-variant-200-800
			focus:outline-none
			focus:ring-0
			focus:border-variant-300-700
			scrollbar
			rounded-xl
			transition-colors
			text-base
			z-10
		"
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
				class="absolute top-1 right-1"
				icon={mdiClose}
				iconSize="20"
				onclick={clearText}
				small
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
let highlightContaner = $state<HTMLDivElement>();
let timer = $state<number>();
let highlightedText = $derived.by<string>(() => {
	let text = store.translated?.sentence.orig || store.textToTranslate;

	if (store.textToHighlight) {
		const escapedString = escapeRegExp(store.textToHighlight.trim());
		const re = new RegExp(escapedString, 'g');
		const replaceValue = '<span class="bg-accent-primary/15 rounded-xs">$&</span>';
		return text.replace(re, replaceValue);
	}

	return text;
});

function onScroll(event: Event) {
	const target = event.target as HTMLTextAreaElement;
	if (highlightContaner) highlightContaner.scrollTop = target.scrollTop;
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
