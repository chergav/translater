{#if store.translated?.dict}
	<div class="mt-1 overflow-hidden rounded-[14px]">
		<div class="scrollbar max-h-96 overflow-y-auto bg-color-surface p-2">
			<table class="w-full text-sm">
				<tbody>
					{#each store.translated.dict as dict, index (index)}
						<tr>
							<td
								class="w-full pb-2 font-medium text-color-primary capitalize"
								colspan="2"
							>{dict.pos}</td>
							{#if index === 0}
								<td>
									<span
										class="flex items-center gap-0.5 text-xs text-color-on-surface-variant"
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
								<td class="px-2 py-1 text-color-on-surface-variant">
									{#each entry.reverse_translation as reverse_translation, i (i)}
										{@const lastIndex = entry.reverse_translation.length - 1}
										<div class="inline-flex flex-wrap">
											<span
												class={[
													'mx-[-5px] my-[-1px] cursor-pointer rounded-md px-[5px] py-[1px] transition-colors',
													'hover:bg-color-primary/10 hover:text-color-primary',
													currentWord === reverse_translation && 'bg-color-primary/10 text-color-primary',
												]}
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
								<td class="py-1 text-end align-top">
									<div class="inline-flex w-fit items-center gap-[1px] overflow-hidden rounded-full whitespace-nowrap">
										{#each scoreHandler(entry.score) as item, index (index)}
											<div
												class={[
													'h-[6px] w-[12px]',
													item ? 'bg-color-primary' : 'bg-color-primary/10',
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
	store.translate();
}
</script>
