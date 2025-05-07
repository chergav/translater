<div class="relative w-full leading-[0] rounded-xl overflow-hidden">
	<textarea
		bind:this={textarea}
		style="font-size: {storage.settings.fontSize}px;"
		class="
			w-full
			max-h-80
			min-h-2.5
			pl-1
			py-1
			pr-[34px]
			bg-transparent
			resize-none
			overflow-y-auto
			border
			border-gray-300
			dark:border-gray-800
			focus:outline-none
			focus:ring-0
			focus:border-gray-400
			focus:dark:border-gray-700
			scrollbar
			rounded-xl
			transition-colors
			text-base
		"
		oninput={onInput}
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

let textarea = $state<HTMLTextAreaElement>();
let timer = $state<number>();

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
