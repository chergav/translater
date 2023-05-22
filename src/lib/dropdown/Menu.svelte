<div
	class="relative cursor-default"
	use:clickOutside
	on:click_outside={() => {
		$menuOpen = false;
	}}
>
	<slot />
</div>

<script>
import { menuOpen } from './store';
import { clickOutside } from '~/lib/utils/clickOutside';
</script>
