<script lang="ts">
	import { Alert, A } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	// Either provide this or provide child content.
	export let message: string | undefined = undefined;

	export let type: 'error' | 'success';
	export let sticky: boolean = false;

	const color = type == 'success' ? 'green' : 'red';
	const icon = type == 'success' ? InfoCircleSolid : ExclamationCircleSolid;
</script>

<Alert border dismissable={sticky} {color} class="mb-2 sm:mb-3 {sticky && 'sticky top-3'}">
	<svelte:component this={icon} slot="icon" class="h-4 w-4" />
	<slot>
		{#if message && message != 'Internal Error'}
			{message}
		{:else}
			Something went wrong on our end. If this persists, please reach out to <A
				href="mailto=hello@hackbu.org">hello@hackbu.org</A
			>.
		{/if}
	</slot>
</Alert>
