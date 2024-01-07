import { OAUTH_STATE_COOKIE_OPTS, googleAuth } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();
	url.searchParams.append('hd', 'binghamton.edu');
	cookies.set('google_oauth_state', state, OAUTH_STATE_COOKIE_OPTS);
	throw redirect(302, url);
};
