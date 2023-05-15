<ButtonImage on:click>
	<Icon
		d={heroChevronDown}
		class="
			{expand ? 'rotate-180' : ''}
			transition-transform
		"
	/>
</ButtonImage>

<script>
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroChevronDown } from '@icons/heroicons';

export let expand;
</script>
