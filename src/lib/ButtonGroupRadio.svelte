<div class="flex w-fit shrink-0 items-center gap-0.5 overflow-hidden rounded-full select-none">
	{#each options as { label, value, icon } (value)}
		<label
			class={[
				'flex h-10 cursor-pointer items-center rounded-lg px-4 text-color-on-surface',
				'transition-[color,background-color,border-radius] duration-200',
				'bg-color-surface-container hover:bg-color-surface-high has-active:bg-color-surface-highest',
				'has-checked:bg-color-primary/100 has-checked:hover:bg-color-primary/90 has-checked:has-active:bg-color-primary/80',
				'has-checked:rounded-4xl has-checked:text-color-on-primary',
			]}
		>
			<div class="flex items-center gap-2">
				{#if icon}
					<div>
						<Icon d={icon} size="18" />
					</div>
				{/if}
				<span class="text-sm font-medium">{label}</span>
			</div>
			<input class="sr-only" type="radio" {value} bind:group />
		</label>
	{/each}
</div>

<script lang="ts">
import Icon from './Icon.svelte';

interface Option {
	label: string
	value: string
	icon?: string
}

interface Props {
	group: string
	options: Option[]
}

let {
	group = $bindable(),
	options,
}: Props = $props();
</script>
