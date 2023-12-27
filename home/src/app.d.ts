// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success';
				text: string;
			};
		}
		interface PageData {
			// See: https://github.com/ciscoheat/sveltekit-flash-message.
			flash?: Superforms.Message;
		}
	}
}

export {};
