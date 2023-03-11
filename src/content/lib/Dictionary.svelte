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
								{#if entry.gender}
									<span class="text-gray-500 text-xs">
										{gender[entry.gender]}
									</span>
								{/if}
							</td>
							<td class="align-top px-2 text-gray-500">
								{entry.reverse_translation.join(', ')}
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
										></div>
									{/each}
								</span>
							</td>
						</tr>
					{/each}
					<tr>
						<td colspan="3" class="p-2"></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<script>
import { getMessage } from '@/common/browserApi';
export let translate;

const gender = {
	1: 'муж.',
	2: 'жен.',
	3: 'сред.',
};

const scoreHandler = n => {
	const score = isNaN(n) ? 0 : n;
	const mark = score < .005 ? [1,0,0] : score < .05 ? [1,1,0] : [1,1,1];
	return mark;
};
</script>
