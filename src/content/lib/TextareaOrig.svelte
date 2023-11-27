<div class="w-full leading-[0] rounded-xl overflow-hidden">
	<textarea
		bind:this={textarea}
		class="
			w-full
			max-h-80
			p-1
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
			{isLongText ? 'text-sm' : 'text-base'}
			transition-colors
		"
		rows="1"
		spellcheck="false"
		on:input={handleInput}
	>{$store.translated.sentences.orig}</textarea>
</div>

<script>
import { afterUpdate } from 'svelte';
import { store } from '~/content/store';

let textarea,
	timer,
	scrollOffset = 2,
	isLongText = false;

const autoHeight = () => {
	if (textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight + scrollOffset}px`;
	}
};

const getIsLongText = () => {
	isLongText = textarea
		? textarea.value.length > 150 || textarea.value.split('\n').length > 2
		: false;
};

const handleAutoTranslate = text => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		if ($store.selectedText !== text) {
			$store.selectedText = text;
		}
	}, 750);
};

const handleInput = ({ target }) => {
	const text = target.value.trim();
	autoHeight();
	handleAutoTranslate(text);
};

afterUpdate(() => {
	autoHeight();
	getIsLongText();
});
</script>
