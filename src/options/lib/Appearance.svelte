<div class="p-4">
	<Radio bind:selected={$persistentStore.theme} options={themes} />
</div>
<script>
import { persistentStore } from '~/common/store';
import { themes } from '~/common/settings';
import Radio from '~/lib/Radio.svelte';
</script>
