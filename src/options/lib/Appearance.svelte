<div class="p-6 flex flex-col gap-4">
	<Radio options={themes} bind:selected={$persistentStore.theme} />
</div>

<script>
import { persistentStore } from '~/common/store';
import { themes } from '~/common/settings';
import Radio from '~/lib/Radio.svelte';
</script>
