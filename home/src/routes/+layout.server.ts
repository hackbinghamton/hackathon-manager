import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	// See: https://authjs.dev/getting-started/providers/oauth-tutorial?frameworks=sveltekit#exposing-the-session-via-page-store
	const data = { session: await event.locals.getSession() };
	return data;
});
