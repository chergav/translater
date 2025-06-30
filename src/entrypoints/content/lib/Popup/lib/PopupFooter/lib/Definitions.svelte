{#if definitions}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div class="scrollbar max-h-96 overflow-y-auto bg-color-surface p-2">
			{#each definitions as definition, index (index)}
				<div class="mb-3 last:mb-0">
					<div class="mb-2 font-medium text-color-primary capitalize">{definition.pos}</div>
					<ul class="list-none space-y-3">
						{#each definition.entry as defEntry, index (index)}
							{@const defLabels = defEntry.label_info ? getLabels(defEntry.label_info) : []}
							<div class="flex gap-4">
								<span class="flex size-5 shrink-0 items-center justify-center rounded-full border border-color-surface-high">
									{index + 1}
								</span>
								<li>
									{#each defLabels as label, index (index)}
										<span class="mr-1 rounded bg-color-surface-high px-1 py-[2px] text-xs font-medium uppercase">
											{label}
										</span>
									{/each}
									<div>{defEntry.gloss}</div>
									{#if defEntry.example}
										<div class="text-color-on-surface-variant">"{defEntry.example}"</div>
									{/if}
									{#if defEntry.synsets}
										<div class="mt-2 mb-1 text-color-on-surface-variant">
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
												<span
													class={[
														'mr-1 mb-1 inline-block cursor-pointer rounded-full px-2 py-1 transition-colors',
														'border border-color-surface-high text-color-on-surface-variant',
														'hover:bg-color-primary/10 hover:text-color-primary',
													]}
													onclick={() => {
														translate(synonym);
													}}
													onkeypress={e => {
														if (e.code === 'Enter')	translate(synonym);
													}}
													role="button"
													tabindex="0"
												>{synonym}</span>
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
	</div>
{/if}

<script lang="ts">
import type { Translated, Entry2, LabelInfo } from '~/shared/translate.types';
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
	store.getTranslate();
}
</script>
