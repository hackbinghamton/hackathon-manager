import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { redirect as redirectFlash } from 'sveltekit-flash-message/server';
import { error, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { COOKIE_KEY_DISCORD, MSG_FROM_DISCORD } from '$lib/server/discord.js';

const schema = z.object({
	name: z.string().optional()
});

const ERROR_NOT_SIGNED_IN: App.Error = {
	message: "It doesn't look like you signed in.",
	recourse: 'signup'
};

export const load = async ({ parent }) => {
	const { user } = await parent();
	// This should only happen if a user manually navigates to this URL,
	// rather than being redirected from a callback.
	if (!user) {
		throw error(422, ERROR_NOT_SIGNED_IN);
	}
	if (user.isSignedUp) {
		throw redirect(302, '/profile');
	}

	const form = await superValidate(schema);
	return { form };
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, schema);
		if (!form.valid) {
			// This is a status message and not a flash message since we have a
			// perfectly fine alert element to stick the message in.
			//
			// As a form validation failure, we will ignore this text in the client
			// since we would like to know the number of errors.
			return message(form, { type: 'error', text: 'Invalid form' }, { status: 422 });
		}

		const session = await locals.authRequest.validate();
		const user = session?.user;
		if (!user) {
			throw error(422, ERROR_NOT_SIGNED_IN);
		}

		await auth.updateUserAttributes(user.userId, { is_signed_up: true });
		let text = 'Account successfully created!';
		if (cookies.get(COOKIE_KEY_DISCORD)) {
			text += ` ${MSG_FROM_DISCORD}`;
		}
		throw redirectFlash('/profile', { type: 'success', text }, cookies);
	}
};
