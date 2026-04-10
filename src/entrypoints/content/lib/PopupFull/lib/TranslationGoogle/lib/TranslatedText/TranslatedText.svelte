{#if segments.length}
	{#each segments as segment, index (index)}
		<Segment {segment} />
	{/each}
{:else}
	<p>{translated.sentence.trans}</p>
{/if}

<script lang="ts">
import type { TransSegment } from '~/types';
import type { Translated } from '~/types/google';
import Segment from './lib/Segment.svelte';

interface Props {
	translated: Translated
}

let { translated }: Props = $props();

let segments: TransSegment[] = $derived.by(() => {
	const alternativeTranslations = translated.alternative_translations;

	if (!alternativeTranslations?.length) return [];

	return alternativeTranslations.map(seg => {
		if (seg.src_phrase.startsWith('\n') || seg.raw_src_segment.startsWith('\n')) {
			return {
				text: seg.raw_src_segment,
				alternatives: [],
				rawSegment: '',
			};
		}

		const text = seg?.alternative && seg.alternative[0] ? seg.alternative[0].word_postproc : '';
		const alts = (seg.alternative || []).map(a => a.word_postproc);
		const alternatives = [...new Set(alts)]; // remove duplicates

		return {
			text,
			alternatives,
			rawSegment: seg.raw_src_segment, // original text
		};
	});
});
</script>
