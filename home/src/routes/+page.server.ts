import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { auth } from '$lib/server/lucia.js';

export const actions = {
	logout: async ({ locals, cookies }) => {
		const session = await locals.authRequest.validate();
		if (!session) {
			return fail(401);
		}
		await auth.invalidateSession(session.sessionId);
		locals.authRequest.setSession(null);
		throw redirect('/', { type: 'success', text: 'See you later!' }, cookies);
	}
};
