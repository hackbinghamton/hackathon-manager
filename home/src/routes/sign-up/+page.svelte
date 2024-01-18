<script lang="ts">
	import { Label, Input, P, Button, type SelectOptionType, Select } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { dev } from '$app/environment';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import MyAlert from '$lib/components/MyAlert.svelte';
	import MyHeading from '$lib/components/MyHeading.svelte';
	import MyMultiSelect from '$lib/components/MyMultiSelect.svelte';
	import { UniRole, GradSem } from '$lib/common.js';
	import FormError from '$lib/components/FormError.svelte';

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

	const uniRoleOptions = [
		{
			name: 'Undergraduate Student (BS or BA)',
			value: UniRole.Undergrad
		},
		{
			name: "Master's Student",
			value: UniRole.Masters
		},
		{
			name: 'PhD Student or Candidate',
			value: UniRole.PhD
		},
		{
			name: 'Faculty or Staff',
			value: UniRole.FacStaff
		}
	];

	const gradSemOptions = [
		{
			name: 'Spring',
			value: GradSem.Spring
		},
		{
			name: 'Winter',
			value: GradSem.Winter
		}
	];

	const majors = [
		'Computer Science',
		'Mathematics',
		'Computer Engineering',
		'Electrical Engineering',
		'Business Administration'
	];
	const majorOptions: SelectOptionType<string>[] = majors.map((major) => ({
		name: major,
		value: major
	}));
</script>

<header>
	<MyHeading tag="h1">Complete registration</MyHeading>
	<P>We just need a little more info to get started:</P>
</header>

<main>
	<form method="POST" use:enhance class="mt-2">
		<div class="mb-2 grid gap-2 sm:grid-cols-2 sm:gap-6">
			<div>
				<Label for="first-name" class="mb-2">First Name</Label>
				<Input
					type="text"
					id="first-name"
					readonly
					class={inputClass}
					value={data.user?.firstName}
				/>
			</div>
			<div>
				<Label for="last-name" class="mb-2">Last Name</Label>
				<Input type="text" id="last-name" readonly class={inputClass} value={data.user?.lastName} />
			</div>
		</div>

		<div class="mb-2">
			<Label for="email" class="mb-2">B-mail</Label>
			<!-- In practice, the server script for this page ensures
				 that the user is not null. -->
			<Input type="email" id="email" readonly class={inputClass} value={data.user?.email} />
		</div>

		<div class="mb-2">
			<Label for="status-select" class="mb-2">Current status</Label>
			<!-- Background styling taken from <Input>. -->
			<Select
				name="uniRole"
				id="status-select"
				items={uniRoleOptions}
				class="bg-gray-50 dark:bg-gray-700"
				bind:value={$form.uniRole}
				placeholder=""
			/>
			<FormError error={$errors.uniRole} />
		</div>

		<div class="mb-2">
			<Label for="major-select" class="mb-2"
				>{$form.uniRole == UniRole.Undergrad ? 'Major(s)' : 'Department(s)'}</Label
			>
			<MyMultiSelect
				name="majors"
				id="major-select"
				items={majorOptions}
				class="bg-gray-50 dark:bg-gray-700"
				bind:value={$form.majors}
			/>
			<!-- TODO: Look into why this behaves weirdly. -->
			<FormError error={$errors.majors?._errors} />
		</div>

		{#if $form.uniRole != UniRole.FacStaff}
			<div class="mb-2">
				<!-- TODO: Do this correctly with a fieldset: https://stackoverflow.com/a/9004357/5719930 -->
				<Label class="mb-2">Anticipated graduation</Label>
				<div class="flex gap-2">
					<Select
						name="gradSem"
						items={gradSemOptions}
						class="w-auto bg-gray-50 dark:bg-gray-700"
						bind:value={$form.gradSem}
						placeholder=""
					/>
					<Input
						name="gradYear"
						items={gradSemOptions}
						placeholder="20XX"
						class="box-content w-[5ch]"
						required
						bind:value={$form.gradYear}
					/>
				</div>
				<!-- TODO: maybe don't just stack these on top of each other -->
				<FormError error={$errors.gradSem} />
				<FormError error={$errors.gradYear} />
			</div>
		{/if}

		<Button type="submit" class="mb-4 mt-3">Submit</Button>
		{#if $message?.type == 'error'}
			{@const text = $allErrors.length
				? `Please fix the above issue${$allErrors.length > 1 ? 's' : ''} and try again.`
				: $message.text}
			<MyAlert type="error" message={text} />
		{/if}
		<SuperDebug data={$form} display={dev} />
	</form>
</main>
