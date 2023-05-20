<ButtonImage on:click round>
	<Icon
		d={heroChevronDown}
		class="{expand ? 'transform -scale-y-100' : ''}"
	/>
</ButtonImage>

<script>
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroChevronDown } from '~/icons/heroicons';

export let expand;
</script>
