<TextField
	name="language-search"
	autocomplete="off"
	onkeydown={handleKeydown}
	placeholder={browser.i18n.getMessage('select_language_search_placeholder')}
	type="search"
	bind:value
	bind:ref={searchRef}
>
	{#snippet leadingIcon()}
		<span>
			<SearchRounded class="size-5" />
		</span>
	{/snippet}
	{#snippet trailingIcon()}
		<IconButton
			class="-mx-1.5 -my-1"
			color="standard"
			onclick={clearSearch}
			size="xs"
			title={browser.i18n.getMessage('tooltip_clear_search')}
		>
			<Cancel />
		</IconButton>
	{/snippet}
</TextField>

<script lang="ts">
import { onMount } from 'svelte';
import { Code } from '../../base/types/keyCodes';
import { getListboxCtx } from './context';
import IconButton from '../../base/IconButton.svelte';
import TextField from '../../base/TextField.svelte';
import Cancel from '~icons/material-symbols/cancel-outline-rounded';
import SearchRounded from '~icons/material-symbols/search-rounded';

interface Props {
	value: string
}

let {
	value = $bindable(''),
}: Props = $props();

const listboxCtx = getListboxCtx();
let searchRef = $state<HTMLInputElement | null>(null);

function clearSearch() {
	value = '';
	searchRef?.focus();
}

function handleKeydown(e: KeyboardEvent) {
	switch (e.code) {
		case Code.ArrowDown:
			e.preventDefault();
			listboxCtx.focusFirstItem();
			break;
		case Code.Tab:
			listboxCtx.close();
			break;
		case Code.Escape:
			e.preventDefault();
			if (value !== '') {
				value = '';
			} else {
				listboxCtx.closeWithFocus();
			}
			break;
	}
}

onMount(() => {
	value = '';
	searchRef?.focus();
	listboxCtx.searchRef = searchRef;
});
</script>
