<ButtonImage round on:click>
	<Icon
		class={expand ? 'transform -scale-y-100' : ''}
		d={heroChevronDown}
	/>
</ButtonImage>

<script>
import ButtonImage from '~/lib/ButtonImage.svelte';
import Icon from '~/lib/Icon.svelte';
import { heroChevronDown } from '~/icons/heroicons';

export let expand;
</script>
