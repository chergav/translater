<label class="group/textarea relative z-0 flex min-h-0 flex-col overflow-hidden">
	<div
		bind:this={highlightContainer}
		class={[
			'absolute inset-0 -z-10 scrollbar-hidden w-full overflow-y-auto py-2 pr-9 pl-1.5',
			'whitespace-pre-line text-transparent',
			fontClass,
		]}
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html highlightedText}
	</div>
	<textarea
		class={[
			'z-10 scrollbar min-h-10 w-full resize-none rounded-sm py-2 pr-9 pl-1.5 whitespace-pre-line',
			'border-none bg-transparent text-color-on-surface caret-color-primary outline-none focus:outline-none',
			fontClass,
		]}
		{@attach autoResize}
		{@attach focus}
		oninput={onInput}
		onscroll={onScroll}
		rows="1"
		spellcheck="false"
		bind:value
	></textarea>
	<span
		class={[
			'pointer-events-none absolute inset-0 rounded-sm',
			'before:absolute before:inset-0 before:rounded-[inherit] before:border',
			'before:transition-[border-color] before:ease-effects-fast',
			'before:border-color-outline-variant group-has-hover/textarea:before:border-color-outline',
			'after:absolute after:inset-0 after:rounded-[inherit] after:border-3 after:opacity-0',
			'after:transition-opacity after:ease-effects-fast',
			'after:border-color-primary group-has-focus/textarea:after:opacity-100 group-has-active/textarea:after:opacity-100',
		]}
	></span>
	{#if value}
		<span
			class="absolute top-1 right-1 z-20"
			transition:fade={{ duration: 150 }}
		>
			<IconButton
				color="standard"
				onclick={clearText}
				size="xs"
				title={browser.i18n.getMessage('tooltip_clear_text')}
			>
				<Close />
			</IconButton>
		</span>
	{/if}
</label>

<script lang="ts">
import type { Attachment } from 'svelte/attachments';
import { fade } from 'svelte/transition';
import { store } from '~/entrypoints/content/store.svelte';
import { storage } from '~/shared/storage.svelte';
import { getFontClass } from '~/entrypoints/content/utils/fontSizeToClass';
import IconButton from '~/lib/base/IconButton.svelte';
import Close from '~icons/material-symbols/close-rounded';

const MAX_HEIGHT = 300;
let value = $derived(store.translated?.sentence.orig || store.textToTranslate);
let highlightContainer = $state<HTMLDivElement>();
let timeoutId = $state<number>();
const fontClass = $derived<string>(getFontClass(storage.settings.fontSize));
let highlightedText = $derived.by<string>(() => {
	let text = $state.snapshot(value);

	if (store.textToHighlight) {
		const escapedString = RegExp.escape(store.textToHighlight.trim());
		const re = new RegExp(escapedString, 'g');
		const replaceValue = '<span class="bg-color-secondary-container">$&</span>';
		return text.replace(re, replaceValue);
	}

	return text;
});

const autoResize: Attachment<HTMLTextAreaElement> = el => {
	if (value !== undefined) {
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + 'px';
	}
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
