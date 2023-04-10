<Radio bind:selected={$persistentStore.theme} options={themes} />

<script>
import { persistentStore } from '~/common/store';
import { themes } from '~/common/settings';
import Radio from '~/lib/Radio.svelte';
</script>
