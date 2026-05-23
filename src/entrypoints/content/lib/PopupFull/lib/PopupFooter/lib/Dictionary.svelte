{#if store.translated?.dict}
	<div>
		<table class="w-full text-sm">
			<tbody>
				{#each store.translated.dict as dict, index (index)}
					<tr>
						<td
							class="w-full px-1.5 pb-2 font-medium text-color-primary capitalize"
							colspan="2"
						>{dict.pos}</td>
						{#if index === 0}
							<td>
								<span
									class="flex items-center gap-0.5 text-xs text-color-on-surface-variant"
									title="Indicates how often a translation appears in public documents"
								>
									{browser.i18n.getMessage('popup_dictionary_frequency')}
									<Help class="size-4" />
								</span>
							</td>
						{/if}
					</tr>

					{#each dict.entry as entry, index (index)}
						<tr class="border-b border-color-outline-variant last:border-none">
							<td class="py-1 align-top">
								<button
									class={[
										'rounded-sm px-1.5 font-medium whitespace-nowrap transition-colors ease-effects-fast',
										'outline-color-secondary focus-visible:outline-common',
										'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
									]}
									onclick={() => reverseTranslation(entry.word)}
									onkeypress={e => onKeydownReverse(e, entry.word)}
									type="button"
								>{entry.word}</button>
							</td>
							<td class="flex flex-wrap gap-1 px-2 py-1">
								{#each entry.reverse_translation as reverse_translation, i (i)}
									<button
										class={[
											'inline-flex rounded-sm px-1.5 transition-colors ease-effects-fast',
											'outline-color-secondary focus-visible:outline-common',
											'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
											currentWord === reverse_translation ?
												'bg-color-secondary-container text-color-on-secondary-container' :
												'bg-color-surface-container-high text-color-on-surface-variant',
										]}
										onclick={() => translate(reverse_translation)}
										onkeypress={e => onKeydownHandler(e, reverse_translation)}
										onmouseenter={() => currentWord = reverse_translation}
										onmouseleave={() => currentWord = ''}
										type="button"
									>
										{reverse_translation}
									</button>
								{/each}
							</td>
							<td class="py-1 text-end align-top">
								<div class="inline-flex w-fit items-center gap-px overflow-hidden rounded-full whitespace-nowrap">
									{#each scoreHandler(entry.score) as item, index (index)}
										<div
											class={[
												'h-[6px] w-[12px]',
												item ? 'bg-color-tertiary' : 'bg-color-surface-container-highest',
											]}
										></div>
									{/each}
								</div>
							</td>
						</tr>
					{/each}
					{#if !last(store.translated.dict, index)}
						<tr>
							<td class="p-2" colspan="3"></td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import Help from '~icons/material-symbols/help-outline-rounded';

let currentWord = $state<string>('');

function scoreHandler(n: number) {
	const score = isNaN(n) ? 0 : n;
	const mark = score < 0.005 ? [1, 0, 0] : score < 0.05 ? [1, 1, 0] : [1, 1, 1];
	return mark;
}

const last = (array: object[], index: number) => index === (array.length - 1);

function translate(text: string) {
	store.textToTranslate = text;
	store.translate();
}

function onKeydownHandler(e: KeyboardEvent, text: string) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		translate(text);
	}
}

function reverseTranslation(text: string) {
	store.reverseTranslation(text);
}

function onKeydownReverse(e: KeyboardEvent, text: string) {
	if (e.code === 'Space' || e.code === 'Enter') {
		e.preventDefault();
		reverseTranslation(text);
	}
}
</script>
