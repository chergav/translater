{#if translate.dict}
	<div class="p-2 max-h-96 overflow-y-auto border-t border-gray-300 dark:border-gray-700">
		<table class="w-full text-sm text-gray-900 dark:text-white">
			<tbody>
				{#each translate.dict as dict, index}
					<tr>
						<td colspan="2" class="text-blue-600 capitalize pb-1">{dict.pos}</td>
						{#if index === 0}
							<td>
								<span class="text-gray-500 text-xs">
									{getMessage('tooltip_dictionary_frequency')}
								</span>
							</td>
						{/if}
					</tr>

					{#each dict.entry as entry}
						<tr>
							<td class="align-top whitespace-nowrap">
								{entry.word}
							</td>
							<td class="align-top px-2 text-gray-500">
								{#each entry.reverse_translation as reverse_translation, i}
									{@const lastIndex = entry.reverse_translation.length - 1}
									<div class="inline-flex flex-wrap">
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="
												cursor-pointer
												rounded-[4px]
												mx-[-4px]
												my-[-1px]
												px-1
												py-[1px]
												hover:text-gray-900
												hover:bg-gray-200
												dark:hover:bg-gray-700
												dark:hover:text-gray-300
												transition-colors
											"
											on:click={() => {
												dispatch('translateSynonym', reverse_translation)
											}}
										>
											{reverse_translation}
										</span>
										{#if i !== lastIndex}
											<span>,&ensp;</span>
										{/if}
									</div>
								{/each}
							</td>
							<td class="align-top text-end">
								<span class="inline-flex gap-1 whitespace-nowrap">
									{#each scoreHandler(entry.score) as item}
										<div
											class="
												w-[10px]
												h-[6px]
												rounded-[1px]
												{item ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
											"
										/>
									{/each}
								</span>
							</td>
						</tr>
					{/each}
					<tr>
						<td colspan="3" class="p-2" />
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<script>
import { createEventDispatcher } from 'svelte';
import { getMessage } from '@/common/browserApi';
export let translate;

const dispatch = createEventDispatcher();

const scoreHandler = n => {
	const score = isNaN(n) ? 0 : n;
	const mark = score < 0.005 ? [1, 0, 0] : score < 0.05 ? [1, 1, 0] : [1, 1, 1];
	return mark;
};
</script>
