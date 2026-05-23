{#if definitions}
	<div>
		{#each definitions as definition, index (index)}
			<div class="mb-3 last:mb-0">
				<div class="mb-2 font-medium text-color-primary capitalize">{definition.pos}</div>
				<ul class="list-none space-y-3">
					{#each definition.entry as defEntry, index (index)}
						{@const defLabels = defEntry.label_info ? getLabels(defEntry.label_info) : []}
						<div class="flex gap-3">
							<span class="flex size-5 shrink-0 items-center justify-center rounded-full border border-color-outline-variant">
								{index + 1}
							</span>
							<li>
								{#if defLabels.length}
									<div class="mb-1 flex items-center gap-1">
										{#each defLabels as label, index (index)}
											<span class="rounded-sm bg-color-surface-container-high px-1 py-0.5 text-xs font-medium uppercase">
												{label}
											</span>
										{/each}
									</div>
								{/if}
								<span
									class={[
										'cursor-pointer rounded-xs text-color-on-surface',
										'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
										'transition-colors ease-effects-fast',
										'outline-color-secondary focus-visible:outline-common',
									]}
									onclick={() => translate(defEntry.gloss)}
									onkeydown={e => onKeydownHandler(e, defEntry.gloss)}
									role="button"
									tabindex="0"
									title="Translate definition"
								>{defEntry.gloss}</span>
								{#if defEntry.example}
									<br>
									<span
										class={[
											'cursor-pointer rounded-xs text-color-on-surface-variant',
											'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
											'transition-colors ease-effects-fast',
											'outline-color-secondary focus-visible:outline-common',
										]}
										onclick={() => translate(defEntry.example!)}
										onkeydown={e => onKeydownHandler(e, defEntry.example!)}
										role="button"
										tabindex="0"
										title="Translate example"
									>"{defEntry.example}"</span>
								{/if}
								{#if defEntry.synsets}
									<div class="my-1 text-color-on-surface-variant">
										{browser.i18n.getMessage('popup_definitions_synonyms')}
									</div>
									{#each sortSynonyms(defEntry.synsets) as entry, index (index)}
										{#if entry.label_info}
											{#each getLabels(entry.label_info) as label, index (index)}
												{#if !defLabels.includes(label)}
													<span class="ml-2 text-sm text-color-on-surface-variant italic">{label}:</span>
												{/if}
											{/each}
										{/if}
										{#each entry.synonym as synonym, index (index)}
											<button
												class={[
													'mr-1 mb-1 inline rounded-sm px-1.5 transition-colors ease-effects-fast',
													'outline-color-secondary focus-visible:outline-common',
													'bg-color-surface-container-high text-color-on-surface-variant',
													'hover:bg-color-secondary-container hover:text-color-on-secondary-container',
												]}
												onclick={() => translate(synonym)}
												onkeypress={e => onKeydownHandler(e, synonym)}
												type="button"
											>{synonym}</button>
										{/each}
									{/each}
								{/if}
							</li>
						</div>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
{/if}

<script lang="ts">
import type { Translated, Entry2, LabelInfo } from '~/types/google';
import { store } from '~/entrypoints/content/store.svelte';

let definitions = $derived(addSynonymToDefinition(store.translated));

function addSynonymToDefinition(translated: Translated | null) {
	if (!translated || !translated.definitions) return;

	const { definitions, synsets } = $state.snapshot(translated);

	if (!Object.hasOwn(translated, 'synsets')) {
		return translated.definitions;
	}

	const synsetsById: { [key: string]: Entry2[] } = {};

	for (const synset of synsets) {
		for (const synsetEntry of synset.entry) {
			synsetsById[synsetEntry.definition_id] = [
				...(synsetsById[synsetEntry.definition_id] || []),
				synsetEntry,
			];
		}
	}

	for (const definition of definitions) {
		for (const definitionEntry of definition.entry) {
			if (synsetsById[definitionEntry.definition_id]) {
				definitionEntry.synsets = synsetsById[definitionEntry.definition_id];
			}
		}
	}

	return definitions;
}

const sortSynonyms = (synonyms: Entry2[]) => synonyms.sort((a, b) => (a.label_info ? 1 : b.label_info ? -1 : 0));

function getLabels(label: LabelInfo) {
	return Object.hasOwn(label, 'subject')
		? label.subject
		: Object.hasOwn(label, 'register')
			? label.register
			: [];
}

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
</script>
