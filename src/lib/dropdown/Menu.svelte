<div
	class="relative cursor-default"
	on:click_outside={() => {
		$menuOpen = false;
	}}
	use:clickOutside
>
	<slot />
</div>

<script>
import { menuOpen } from './store';
import { clickOutside } from '~/lib/utils/clickOutside';
</script>
