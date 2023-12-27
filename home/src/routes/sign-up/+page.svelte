<script lang="ts">
	import { Label, Input, Helper, Hr, P, Heading, Button, Alert, A } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { dev } from '$app/environment';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	const { form, enhance, errors, allErrors, constraints, message } = superForm(data.form, {
		onError({ result }) {
			$message = { type: 'error', text: result.error.message };
		}
	});
</script>

<header>
	<Heading tag="h1" customSize="text-2xl font-bold sm:text-4xl" class=" mb-2 sm:mb-4"
		>Complete registration
	</Heading>
	<P>We need a little more info to complete your HackBU club registration.</P>
</header>

<Hr classHr="mx-auto my-2 sm:my-4 w-36 rounded bg-gray-700 h-1" />

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
			<Alert border color="red" class="mb-4">
				<ExclamationCircleSolid slot="icon" class="h-4 w-4" />
				{#if $allErrors.length}
					Please fix the above issue{$allErrors.length > 1 ? 's' : ''} and try again.
				{:else if $message.text == 'Internal Error'}
					Something went wrong on our end. If this persists, please reach out to <A
						href="mailto=hello@hackbu.org">hello@hackbu.org</A
					>.
				{:else}
					{$message.text}
				{/if}
			</Alert>
		{/if}
		<SuperDebug data={$form} display={dev} />
	</form>
</main>
