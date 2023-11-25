{#if $store.listboxOpen}
	<svelte:element
		this={tag}
		bind:this={element}
		style:right
		style:bottom
		style:left
		role="listbox"
		tabindex="0"
		{...$$restProps}
		transition:fly={{ duration: 150, y: -10 }}
	>
		<slot />
	</svelte:element>
{/if}

<script>
// import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
import { useListboxContext } from './Listbox.svelte';

let tag = 'ul';
let element;
let right;
let bottom;
let left;

const store = useListboxContext();

// const setListPosition = () => {
// 	console.log(element.getBoundingClientRect());
// 	const { bottom: _bottom, right: _right, left: _left } = element.getBoundingClientRect();

// 	bottom = _bottom > window.innerHeight ? '100%' : undefined;
// 	right = _right > window.innerWidth ? 0 : undefined;
// 	left = _left < 0 ? 0 : undefined;
// };

// $: if (element && $store.listboxOpen) {
// 	setListPosition();
// 	// observer = new IntersectionObserver(([entry]) => {
// 	// 	// console.log(entry);
// 	// 	if (entry.isIntersecting) {
// 	// 		console.log(entry);
// 	// 		setListPosition(entry.boundingClientRect);
// 	// 	}
// 	// });
// 	// observer.observe(element);
// }

// $: console.log(element);
// onMount(() => {
// 	console.log('onMount');
// });
</script>
