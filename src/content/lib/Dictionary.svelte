{#if $store.translated.dict}
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
					{#each $store.translated.dict as dict, index}
						<tr>
							<td class="text-blue-600 capitalize pb-1" colspan="2">{dict.pos}</td>
							{#if index === 0}
								<td>
									<span class="text-gray-500 text-xs">
										{getMessage('popup_dictionary_frequency')}
									</span>
								</td>
							{/if}
						</tr>

						{#each dict.entry as entry}
							<tr>
								<td class="align-top whitespace-nowrap">
									{entry.word}
								</td>
								<td class="align-top px-2 py-.5 text-gray-500">
									{#each entry.reverse_translation as reverse_translation, i}
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
													hover:text-gray-800
													hover:bg-gray-200
													dark:hover:bg-gray-700
													dark:hover:text-gray-300
													transition-colors
													{currentWord === reverse_translation
														? 'text-gray-800 bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
														: ''}
												"
												role="button"
												tabindex="0"
												on:click={() => {
													$store.selectedText = reverse_translation;
												}}
												on:keypress={e => {
													if (e.code === 'Enter') {
														$store.selectedText = reverse_translation;
													}
												}}
												on:mouseenter={() => {
													currentWord = reverse_translation;
												}}
												on:mouseleave={() => {
													currentWord = '';
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
						{#if !last($store.translated.dict, index)}
							<tr>
								<td class="p-2" colspan="3" />
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<script>
import { store } from '~/content/store';
import { getMessage } from '~/common/browserApi';

let currentWord;

const scoreHandler = n => {
	const score = isNaN(n) ? 0 : n;
	const mark = score < 0.005 ? [1, 0, 0] : score < 0.05 ? [1, 1, 0] : [1, 1, 1];
	return mark;
};

const last = (array, index) => index === (array.length - 1);
</script>
