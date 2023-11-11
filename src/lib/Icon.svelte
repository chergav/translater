<svg
	class="{classSize} {className}"
	{fill}
	{stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	stroke-width="1.5"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<path {d} />
</svg>

<script>
export let color = 'currentColor';
export let stroke = color;
export let filled = false;
export let size = 'md';
export let d = '';

const sizes = {
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6'
};

let fill = filled ? color : 'none';
let classSize = sizes[size] || sizes.md;
let className = '';
export { className as class };
</script>
