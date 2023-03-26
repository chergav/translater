<div>
	{#each themes as item (item.key)}
		<div class="mb-3">
			<label class="flex items-center cursor-pointer">
				<input
					type="radio"
					bind:group={$persistentStore.theme}
					value={item.key}
					class="mr-3"
				/>
				<span>{getMessage(item.value)}</span>
			</label>
		</div>
	{/each}
</div>

<script>
import { getMessage } from '@/common/browserApi';
import { persistentStore } from '@/common/store';
import { themes } from '@/common/settings';
</script>
