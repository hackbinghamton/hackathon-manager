import { error, redirect } from '@sveltejs/kit';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { auth, googleAuth } from '$lib/server/lucia.js';
import { OrgRole } from 'lib/schema';

export const load = async ({ url, cookies, locals }) => {
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	if (!storedState || !state || storedState !== state || !code) {
		throw error(422, 'Invalid OAuth state or no authorization code.');
	}
	try {
		// For user details, see:
		// https://developers.google.com/identity/openid-connect/openid-connect#an-id-tokens-payload
		const { getExistingUser, createUser, googleUser } = await googleAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) {
				auth.updateUserAttributes(existingUser.userId, {
					email: googleUser.email,
					name: googleUser.name,
					first_name: googleUser.given_name,
					last_name: googleUser.family_name,
					avatar_url: googleUser.picture,
					domain: googleUser.hd
				});
				return existingUser;
			}

			// This is a seemingly rare and super poorly documented case. See:
			// https://jpassing.com/2021/01/27/what-does-the-email_verified-claim-indicate-in-google-idtokens/
			if (!googleUser.email_verified) {
				throw error(422, {
					message: "This email hasn't been verified through Google.",
					recourse: 'signup'
				});
			}
			if (googleUser.hd != 'binghamton.edu') {
				throw error(422, {
					message: "This doesn't look like a Binghamton University Google Account.",
					recourse: 'signup'
				});
			}

			if (!googleUser.email) {
				throw new Error('Missing user email. Scope issue?');
			}
			const newUser = await createUser({
				attributes: {
					org_role: OrgRole.Member,
					email: googleUser.email,
					name: googleUser.name,
					first_name: googleUser.given_name,
					last_name: googleUser.family_name,
					avatar_url: googleUser.picture,
					domain: googleUser.hd,
					join_date: new Date(),
					is_signed_up: false
				}
			});
			return newUser;
		};

		const user = await getUser();
		const session = await auth.createSession({ userId: user.userId, attributes: {} });
		locals.authRequest.setSession(session);
		throw redirect(302, '/sign-up');
	} catch (e) {
		if (e instanceof OAuthRequestError) {
			throw error(422, {
				message: 'Invalid OAuth authorization code. Did you refresh this page?',
				recourse: 'signup'
			});
		}
		// Propagate it as an unexpected error because we want details in the console.
		throw e;
	}
};
