<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h1';
	export let textSizes = {
		h1: 'text-2xl font-bold sm:text-3xl',
		// NOTE: These all probably need to be adjusted.
		h2: 'text-4xl font-bold',
		h3: 'text-3xl font-bold',
		h4: 'text-2xl font-bold',
		h5: 'text-xl font-bold',
		h6: 'text-lg font-bold'
	};
</script>

<Heading {tag} customSize={textSizes[tag]} class="mb-2 sm:mb-2">
	<slot />
</Heading>
