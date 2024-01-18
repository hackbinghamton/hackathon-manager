declare global {
	// Lucia types. See:
	// https://lucia-auth.com/getting-started/#set-up-types
	declare namespace Lucia {
		type Auth = import('./lib/server/lucia.js').Auth;
		type DatabaseUserAttributes = {
			org_role: string;
			email: string;
			name: string;
			first_name: string;
			last_name: string;
			avatar_url: string;
			domain: string;
			join_date: Date;
			is_signed_up: boolean;
		};
		// This type is the empty object.
		type DatabaseSessionAttributes = Record<string, never>;
	}

	// SvelteKit + Superforms for SvelteKit types. See:
	// https://kit.svelte.dev/docs/types#app
	// https://superforms.rocks/concepts/messages#strongly-typed-message
	namespace App {
		interface Error {
			message: string;
			recourse?: 'signup';
		}
		interface Locals {
			authRequest: import('lucia').AuthRequest<import('./lib/server/lucia.js').Auth>;
		}
		interface PageData {
			// See: https://github.com/ciscoheat/sveltekit-flash-message.
			flash?: Superforms.Message;
			user?: import('lucia').User;
		}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success';
				text: string;
			};
		}
	}
}

export {};
