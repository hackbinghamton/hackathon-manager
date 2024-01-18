<script>
	import { Helper } from "flowbite-svelte";

	export let error;
</script>

{#if error}<Helper color="red" class="mt-2 font-medium">{error}</Helper>{/if}
