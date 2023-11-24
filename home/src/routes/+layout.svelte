<script lang="ts">
	import { NavBrand, Navbar, Avatar } from 'flowbite-svelte';

	// This file is a Svelte component [1], which accomodates script, markup, and style sections.
	// We configured Vite to use the SvelteKit plugin [2], which understands Svelte component syntax.
	// The plugin uses Vite's built-in features [3] to preprocess each section of this file.
	//
	// [1] https://svelte.dev/docs/svelte-components
	// [2] https://kit.svelte.dev/docs/integrations#preprocessors
	// [3] https://vitejs.dev/guide/features.html

	// This line should make you feel uncomfy, so let's put the above into practice:
	// - vite-plugin-svelte parses this component and extracts the script.
	// - The plugin notices that PostCSS is being used here and defers to Vite.
	// - Vite notices that a CSS file is being imported.
	//   Vite also notices that we have a PostCSS config so it invokes the tool.
	// - PostCSS loads the Tailwind plugin, as configured. Tailwind also has its own config.
	// - PostCSS preprocesses the file.
	// - Vite injects the processed CSS into a new `<style>` in this component.
	import '../app.pcss';

	import logo_icon from '$lib/assets/logo_icon.png';
</script>

<!-- We need to make this transparent since a child has a rounded border. -->
<Navbar fluid border rounded class="mb-4 border-gray-300 dark:border-gray-600">
	<NavBrand href="/">
		<img src={logo_icon} class="-my-2 mr-1 h-12 sm:-my-1 sm:mr-3 sm:h-14" alt="HackBU Logo" />
		<span class="whitespace-nowrap text-2xl font-semibold"> HackBU Home</span>
	</NavBrand>

	<div class="flex flex-wrap items-center justify-between gap-x-5">
		<a
			href="https://hackbu.org"
			class="hover:text-primary-700 text-md font-medium text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			>Blog</a
		>
		<Avatar src="https://pbs.twimg.com/profile_images/1589351611398250497/ioox_g1x_400x400.jpg" />
	</div>
</Navbar>

<div class="px-6 sm:px-[revert]">
	<slot />
</div>
