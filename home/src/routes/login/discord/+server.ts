import { MSG_NOT_SIGNED_IN_DISCORD } from '$lib/server/discord.js';
import { OAUTH_STATE_COOKIE_OPTS, discordAuth } from '$lib/server/lucia';
import { redirect, error } from '@sveltejs/kit';

export const GET = async ({ cookies, locals }) => {
	// TODO: ratelimit this

	const session = await locals.authRequest.validate();
	if (!session) {
		// We don't bother making this a nice error page because this should only be possible
		// if a user directly navigates to this URL.
		throw error(422, {
			message: MSG_NOT_SIGNED_IN_DISCORD,
			recourse: 'signup'
		});
	}

	const [url, state] = await discordAuth.getAuthorizationUrl();
	cookies.set('discord_oauth_state', state, OAUTH_STATE_COOKIE_OPTS);
	throw redirect(302, url);
};
