<script lang="ts">
	import { Label, Input, Helper, P, Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { dev } from '$app/environment';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import MyAlert from '$lib/components/MyAlert.svelte';
	import MyHeading from '$lib/components/MyHeading.svelte';

	export let data;

	const { form, enhance, errors, allErrors, constraints, message } = superForm(data.form, {
		// Catch errors so that we don't get whisked away from the form to an error page.
		onError({ result }) {
			$message = { type: 'error', text: result.error.message };
		}
	});

	// In this form, we have some inputs taken from Google that we don't want
	// the user to edit. Although these are not literally sent when the form is
	// submitted [1], from the user's perspective it might as well be. It's part of
	// the information that is going into their new account which we are asking
	// for them to review.
	//
	// Flowbite Svelte doesn't have any default styling for `readonly`, so here we
	// copy some of the styling from `disabled`.
	//
	// [1] relevant to: https://stackoverflow.com/a/7730719/5719930.
	const inputClass = 'read-only:cursor-not-allowed';
</script>

<header>
	<MyHeading tag="h1">Complete registration</MyHeading>
	<P>We need a little more info to complete your HackBU club registration.</P>
</header>

<main>
	<form method="POST" use:enhance>
		<div class="mb-4">
			<Label for="email" class="mb-2">B-mail</Label>
			<Input type="email" id="email" readonly value="hello@example.com" />
		</div>

		<div class="mb-4">
			<Label for="name" class="mb-2">meow</Label>
			<Input
				id="name"
				name="name"
				aria-invalid={$errors.name ? 'true' : undefined}
				bind:value={$form.name}
				{...$constraints.name}
			/>
			{#if $errors.name}<Helper color="red" class="mt-2 font-medium">{$errors.name}</Helper>{/if}
		</div>

		<Button type="submit" class="mb-4">Submit</Button>
		{#if $message?.type == 'error'}
			{@const text = $allErrors.length
				? `Please fix the above issue${$allErrors.length > 1 ? 's' : ''} and try again.`
				: $message.text}
			<MyAlert type="error" message={text} />
		{/if}
		<SuperDebug data={$form} display={dev} />
	</form>
</main>
