import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals }) => {
	const session = await locals.authRequest.validate();
	if (session) {
		return {
			user: session.user
		};
	}
});
