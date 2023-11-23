<script>
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
</script>
