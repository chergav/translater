{#if $store.translated.definitions}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div
			class="
			p-2
			max-h-96
			overflow-y-auto
			bg-white
			dark:bg-gray-900
			scrollbar
		"
		>
			{#each definitions as definition}
				<div class="mb-3 last:mb-0">
					<div class="text-blue-600 capitalize">{definition.pos}</div>
					<ul class="marker:text-gray-500 list-decimal pl-5 space-y-3">
						{#each definition.entry as defEntry}
							{@const defLabels = defEntry.label_info
								? getLabels(defEntry.label_info)
								: []}
							<li class="mb-2 pl-2">
								{#each defLabels as label}
									<span
										class="
										bg-gray-300
										text-gray-800
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
										{getMessage('popup_definitions_synonyms')}
									</div>
									{#each sortSynonyms(defEntry.synsets) as entry}
										{#if entry.label_info}
											{#each getLabels(entry.label_info) as label}
												{#if !defLabels.includes(label)}
													<span class="ml-2 text-xs text-gray-500"
														>{label}:</span
													>
												{/if}
											{/each}
											{#each entry.synonym as synonym}
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
													role="button"
													tabindex="0"
													on:click={() => {
														$store.selectedText = synonym;
													}}
													on:keypress={e => {
														if (e.code === 'Enter') {
															$store.selectedText = synonym;
														}
													}}
												>
													{synonym}
												</span>
											{/each}
										{:else}
											{#each entry.synonym as synonym}
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
													role="button"
													tabindex="0"
													on:click={() => {
														$store.selectedText = synonym;
													}}
													on:keypress={e => {
														if (e.code === 'Enter') {
															$store.selectedText = synonym;
														}
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
	</div>
{/if}

<script>
import { getMessage } from '~/common/browserApi';
import { store } from '~/content/store';

const sortSynonyms = synonyms =>
	synonyms.sort((a, b) => (a.label_info ? 1 : b.label_info ? -1 : 0));

const addSynonymToDefinition = translated => {
	const { definitions, synsets } = translated;

	if (!Object.hasOwn($store.translated, 'synsets')) {
		return definitions;
	}

	const synsetsById = {};

	for (const synset of synsets) {
		for (const synsetEntry of synset.entry) {
			synsetsById[synsetEntry.definition_id] = [
				...(synsetsById[synsetEntry.definition_id] || []),
				synsetEntry
			];
		}
	}

	for (const definition of definitions) {
		for (const defEntry of definition.entry) {
			if (synsetsById[defEntry.definition_id]) {
				defEntry.synsets = synsetsById[defEntry.definition_id];
			}
		}
	}

	delete $store.translated.synsets;

	return definitions;
};

$: definitions = addSynonymToDefinition($store.translated);

const getLabels = label =>
	Object.hasOwn(label, 'subject')
		? label.subject
		: Object.hasOwn(label, 'register')
			? label.register
			: [];
</script>
