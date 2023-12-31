import { auth } from '$lib/server/lucia';

export const handle = async ({ event, resolve }) => {
	event.locals.authRequest = auth.handleRequest(event);

	const response = await resolve(event);
	return response;
};
