<script lang="ts">
	import {
		NavBrand,
		Navbar,
		Avatar,
		A,
		Dropdown,
		DropdownHeader,
		DropdownItem
	} from 'flowbite-svelte';
	import MyAlert from '$lib/components/MyAlert.svelte';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	const flash = getFlash(page);

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

	import logoIcon from '$lib/assets/logo_icon.png';
	import { enhance } from '$app/forms';

	let dropdownOpen = false;
</script>

<!-- We need to make this transparent since a child has a rounded border. -->
<Navbar fluid border class="mb-3 border-gray-300 sm:rounded-lg dark:border-gray-600">
	<NavBrand href="/">
		<img src={logoIcon} class="-my-2 me-1 h-12 sm:-my-1 sm:me-3 sm:h-14" alt="HackBU Logo" />
		<span class="whitespace-nowrap text-2xl font-semibold">HackBU Home</span>
	</NavBrand>

	<div class="flex flex-wrap items-center justify-between gap-x-3">
		<A
			href="https://hackbu.org"
			color="hover:text-primary-700 text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
			aClass="font-medium"
		>
			Blog
		</A>
		<!--
			As far as Lucia is concerned, if we have authenticated with Google, then
			we have a perfectly valid user. For our purposes, though, sign-up
			is not complete until the user has completed the form. Therefore, we
			refrain from showing the avatar until *we* say sign-up is complete.
		 -->
		{#if $page.data?.user?.isSignedUp}
			{@const user = $page.data.user}
			<!-- This div ensures that the Dropdown doesn't count as its own flex child. -->
			<div>
				<Avatar
					id="avatar-menu"
					src={user.avatarUrl}
					class="hover:opacity-75 {dropdownOpen ? 'brightness-75' : ''}"
				/>
				<Dropdown
					triggeredBy="#avatar-menu"
					placement="bottom-end"
					border
					color="primary"
					bind:open={dropdownOpen}
				>
					<DropdownHeader>
						<span class="block text-sm">{user.name}</span>
						<span class="block truncate text-sm font-medium">{user.email}</span>
					</DropdownHeader>
					<form method="post" action="/?/logout" use:enhance>
						<DropdownItem type="submit">Sign out</DropdownItem>
					</form>
				</Dropdown>
			</div>
		{/if}
	</div>
</Navbar>

<div class="px-6 sm:px-[revert]">
	{#if $flash}
		<MyAlert type={$flash.type} sticky>
			{$flash.text}
		</MyAlert>
	{/if}
	<slot />
</div>
