<script lang="ts">
	import { page } from '$app/stores';
	import { A, Button } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import MyAlert from '$lib/components/MyAlert.svelte';
	import MyHeading from '$lib/components/MyHeading.svelte';
	import SignInButtonGoogle from '$lib/components/SignInButtonGoogle.svelte';
</script>

<heading>
	<MyHeading tag="h1">Error {$page.status}</MyHeading>
</heading>

<main>
	<MyAlert type="error" message={$page.error?.message} />

	{#if $page.error?.recourse == 'signup'}
		If you'd like to try again:
		<br />
		<SignInButtonGoogle class="my-2" />
		<br />
		Or, return to the homepage:
	{:else}
		<!-- This is slightly redundant with the Internal Error message. -->
		If you need help, feel free to <A href="mailto=hello@hackbu.org">reach out to us</A>.
	{/if}
	<br />
	<Button href="/" class="mt-2 sm:mt-3">
		<ArrowLeftOutline class="me-2 h-3.5 w-3.5" />
		Go back home
	</Button>
</main>
