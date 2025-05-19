{#if definitions}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div
			class="
				p-2
				max-h-96
				overflow-y-auto
				bg-surface
				scrollbar
			"
		>
			{#each definitions as definition, index (index)}
				<div class="mb-3 last:mb-0">
					<div class="mb-2 text-accent capitalize font-medium">{definition.pos}</div>
					<ul class="list-none space-y-3">
						{#each definition.entry as defEntry, index (index)}
							{@const defLabels = defEntry.label_info ? getLabels(defEntry.label_info) : []}
							<div class="flex gap-4">
								<div
									class="
										size-5
										flex
										items-center
										justify-center
										border
										border-variant-300-700
										rounded-full
										shrink-0
									"
								>{index + 1}</div>
								<li>
									{#each defLabels as label, index (index)}
										<span
											class="
												bg-surface-level-1
												text-primary
												text-xs
												uppercase
												font-medium
												mr-1
												px-1
												py-[2px]
												rounded
											"
										>{label}</span>
									{/each}
									<div>{defEntry.gloss}</div>
									{#if defEntry.example}
										<div class="text-secondary">"{defEntry.example}"</div>
									{/if}
									{#if defEntry.synsets}
										<div class="text-secondary mt-2 mb-1">
											{browser.i18n.getMessage('popup_definitions_synonyms')}
										</div>
										{#each sortSynonyms(defEntry.synsets) as entry, index (index)}
											{#if entry.label_info}
												{#each getLabels(entry.label_info) as label, index (index)}
													{#if !defLabels.includes(label)}
														<span class="ml-2 text-sm text-secondary italic">{label}:</span>
													{/if}
												{/each}
												{#each entry.synonym as synonym, index (index)}
													<span
														class="
															mr-1
															mb-1
															py-1
															px-2
															inline-block
															rounded-full
															text-secondary
															border
															border-variant-300-700
															hover:text-accent
															hover:bg-accent-primary/10
															transition-colors
															cursor-pointer
														"
														onclick={() => {
															getTranslate(synonym);
														}}
														onkeypress={e => {
															if (e.code === 'Enter')	getTranslate(synonym);
														}}
														role="button"
														tabindex="0"
													>{synonym}</span>
												{/each}
											{:else}
												{#each entry.synonym as synonym, index (index)}
													<span
														class="
															mr-1
															mb-1
															py-1
															px-2
															inline-block
															rounded-full
															text-secondary
															border
															border-variant-300-700
															hover:text-accent
															hover:bg-accent-primary/10
															transition-colors
															cursor-pointer
														"
														onclick={() => {
															getTranslate(synonym);
														}}
														onkeypress={e => {
															if (e.code === 'Enter') getTranslate(synonym);
														}}
														role="button"
														tabindex="0"
													>{synonym}</span>
												{/each}
											{/if}
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

function getTranslate(text: string) {
	store.textToTranslate = text;
	store.getTranslate();
}
</script>
