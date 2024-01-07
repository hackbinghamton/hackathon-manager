import { COOKIE_KEY_DISCORD } from '$lib/server/discord.js';
import { OAUTH_STATE_COOKIE_OPTS } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	cookies.set(COOKIE_KEY_DISCORD, '1', { ...OAUTH_STATE_COOKIE_OPTS, maxAge: 5 * 60 });
	throw redirect(302, '/login/google');
};
