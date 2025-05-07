{#if store.translated?.dict}
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
			<table class="w-full text-sm text-gray-800 dark:text-gray-200">
				<tbody>
					{#each store.translated.dict as dict, index (index)}
						<tr>
							<td
								class="
									w-full
									pb-2
									text-purple-700
									dark:text-purple-300
									capitalize
									font-medium
								"
								colspan="2"
							>{dict.pos}</td>
							{#if index === 0}
								<td>
									<span
										class="flex items-center gap-0.5 text-gray-500 text-xs"
										title="Indicates how often a translation appears in public documents"
									>
										{browser.i18n.getMessage('popup_dictionary_frequency')}
										<Icon d={mdiHelpCircleOutline} size="18" />
									</span>
								</td>
							{/if}
						</tr>

						{#each dict.entry as entry, index (index)}
							<tr>
								<td class="py-1 align-top whitespace-nowrap">
									{entry.word}
								</td>
								<td class="px-2 py-1 text-gray-500">
									{#each entry.reverse_translation as reverse_translation, i (i)}
										{@const lastIndex = entry.reverse_translation.length - 1}
										<div class="inline-flex flex-wrap">
											<span
												class="
													cursor-pointer
													rounded-md
													mx-[-5px]
													my-[-1px]
													px-[5px]
													py-[1px]
													hover:text-purple-800
													hover:bg-purple-900/10
													dark:hover:bg-purple-100/10
													dark:hover:text-purple-200
													transition-colors
													{currentWord === reverse_translation
														? 'text-purple-800 bg-purple-900/10 dark:bg-purple-100/10 dark:text-purple-200'
														: ''}
												"
												onclick={() => {
													getTranslate(reverse_translation);
												}}
												onkeypress={e => {
													if (e.code === 'Enter')	getTranslate(reverse_translation);
												}}
												onmouseenter={() => {
													currentWord = reverse_translation;
												}}
												onmouseleave={() => {
													currentWord = '';
												}}
												role="button"
												tabindex="0"
											>
												{reverse_translation}
											</span>
											{#if i !== lastIndex}
												<span>,&ensp;</span>
											{/if}
										</div>
									{/each}
								</td>
								<td class="py-1 align-top text-end">
									<div
										class="
											w-fit
											inline-flex
											items-center
											rounded-full
											overflow-hidden
											divide-x
											divide-white
											dark:divide-gray-900
										"
									>
										{#each scoreHandler(entry.score) as item, index (index)}
											<div
												class="
													w-[12px]
													h-[6px]
													{item ? 'bg-purple-800 dark:bg-purple-200' : 'bg-purple-900/10 dark:bg-purple-100/10'}
												"
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
	</div>
{/if}

<script lang="ts">
import { store } from '~/entrypoints/content/store.svelte';
import Icon from '~/lib/Icon.svelte';
import { mdiHelpCircleOutline } from '@mdi/js';

let currentWord = $state<string>('');

function scoreHandler(n: number) {
	const score = isNaN(n) ? 0 : n;
	const mark = score < 0.005 ? [1, 0, 0] : score < 0.05 ? [1, 1, 0] : [1, 1, 1];
	return mark;
}

const last = (array: object[], index: number) => index === (array.length - 1);

function getTranslate(text: string) {
	store.textToTranslate = text;
	store.getTranslate();
}
</script>
