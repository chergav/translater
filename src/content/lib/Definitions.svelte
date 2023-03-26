<div class="p-2 max-h-96 overflow-y-auto border-t border-gray-300 dark:border-gray-700 scrollbar">
	{#each addSynonymToDefinition() as definition}
		<div class="mb-3">
			<div class="text-blue-600 capitalize">{definition.pos}</div>
			<ul class="marker:text-gray-500 marker:border list-decimal pl-5 space-y-3">
				{#each definition.entry as defEntry}
					{@const defLabels = defEntry.label_info ? getLabels(defEntry.label_info) : []}
					<li class="mb-2 pl-2">
						{#each defLabels as label}
							<span
								class="
									bg-gray-300
									text-gray-900
									text-xs
									uppercase
									font-medium
									mr-1
									px-1
									py-[2px]
									rounded
									dark:bg-gray-700
									dark:text-gray-400
								"
							>
								{label}
							</span>
						{/each}
						<div>{defEntry.gloss}</div>
						{#if defEntry.example}
							<div class="text-gray-500">"{defEntry.example}"</div>
						{/if}
						{#if defEntry.synsets}
							<div class="text-gray-500 mt-2 mb-1">
								{getMessage('tooltip_definitions_synonyms')}
							</div>
							{#each sortSynonyms(defEntry.synsets) as entry}
								{#if entry.label_info}
									{#each getLabels(entry.label_info) as label}
										{#if !defLabels.includes(label)}
											<span class="ml-2 text-xs text-gray-500">{label}:</span>
										{/if}
									{/each}
									{#each entry.synonym as synonym}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="
												mr-1
												mb-1
												px-2
												inline-block
												rounded-full
												text-gray-500
												border
												border-gray-200
												dark:border-gray-700
												transition-colors
												cursor-pointer
											"
											on:click={() => {
												dispatch('translateWord', synonym);
											}}
										>
											{synonym}
										</span>
									{/each}
								{:else}
									{#each entry.synonym as synonym}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="
												mr-1
												mb-1
												px-2
												inline-block
												rounded-full
												text-gray-500
												border
												border-gray-200
												dark:border-gray-700
												transition-colors
												cursor-pointer
											"
											on:click={() => {
												dispatch('translateWord', synonym);
											}}
										>
											{synonym}
										</span>
									{/each}
								{/if}
							{/each}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<script>
import { getMessage } from '@/common/browserApi';
import { createEventDispatcher } from 'svelte';
export let translate;

const dispatch = createEventDispatcher();

const sortSynonyms = synonyms =>
	synonyms.sort((a, b) => (a.label_info ? 1 : b.label_info ? -1 : 0));

const addSynonymToDefinition = () => {
	const { definitions, synsets } = translate;

	if (translate.synsets) {
		for (const definition of definitions) {
			for (const defEntry of definition.entry) {
				for (const synset of synsets) {
					for (const synEntry of synset.entry) {
						if (defEntry.definition_id === synEntry.definition_id) {
							defEntry.synsets = [...(defEntry.synsets || []), synEntry];
						}
					}
				}
			}
		}
	}

	delete translate.synsets;

	return definitions;
};

const getLabels = label =>
	label.hasOwnProperty('subject')
		? label.subject
		: label.hasOwnProperty('register')
		? label.register
		: [];
</script>
