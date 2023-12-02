<div class="relative w-full leading-[0] rounded-xl overflow-hidden">
	<textarea
		bind:this={textarea}
		class="
			w-full
			max-h-80
			pt-1
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
		"
		rows="1"
		spellcheck="false"
		on:input={onInput}
		use:textareaFocus
	>{$store.translated.sentences.orig}</textarea>
	{#if textarea && textarea.value !== ''}
		<div transition:fade={{ duration: 150 }}>
			<ButtonImage
				class="
					absolute
					top-1
					right-1
					w-[26px]
					h-[26px]
				"
				icon={heroXMark}
				round
				tooltip={{ title: 'Clear text' }}
				on:click={() => {
					textarea.value = '';
					$store.selectedText = '';
					textarea.focus();
				}}
			/>
		</div>
	{/if}
</div>

<script>
import { afterUpdate } from 'svelte';
import { fade } from 'svelte/transition';
import { store } from '~/content/store';
import ButtonImage from '~/lib/ButtonImage.svelte';
import { heroXMark } from '~/icons/heroicons';

let textarea,
	timer,
	scrollOffset = 2;

const textareaResize = () => {
	if (textarea) {
		const isLongText = textarea.value.length > 150 || textarea.value.split('\n').length > 2;
		textarea.style.fontSize = isLongText ? '14px' : '16px';
		textarea.style.lineHeight = isLongText ? '20px' : '24px';
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight + scrollOffset}px`;
	}
};

const debounceTranslate = text => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		if ($store.selectedText !== text) {
			$store.selectedText = text;
		}
	}, 750);
};

const onInput = ({ target }) => {
	const text = target.value.trim();
	debounceTranslate(text);
	textareaResize();
};

const textareaFocus = node => {
	if (!$store.selectedText) {
		node.focus();
	}
};

afterUpdate(() => {
	textareaResize();
});
</script>
