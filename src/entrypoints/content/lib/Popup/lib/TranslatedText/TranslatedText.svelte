{#if store.translated}
	<div style="font-size: {storage.settings.fontSize}px; line-height: {storage.settings.fontSize * 1.6}px">
		{#if segments.length}
			{#each segments as segment, index (index)}
				<Segment {segment} />
			{/each}
		{:else}
			<p>{store.translated.sentence.trans}</p>
		{/if}
	</div>
{/if}

<script lang="ts">
import type { TransSegment } from '~/shared/types';
import { storage } from '~/shared/storage.svelte';
import { store } from '~/entrypoints/content/store.svelte';
import Segment from './lib/Segment.svelte';

let segments: TransSegment[] = $derived.by(() => {
	const alternativeTranslations = store.translated?.alternative_translations;

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
