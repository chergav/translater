import { mount } from 'svelte';
import App from './App.svelte';
import '~/assets/tailwind.css';
import '@fontsource-variable/inter/index.css';

const app = mount(App, {
	target: document.getElementById('app')!,
});

export default app;
