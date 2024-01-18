import { error } from '@sveltejs/kit';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { auth, discordAuth, relSecsToDate } from '$lib/server/lucia';
import { db } from '$lib/server/db';
import { discordUser as discordUserTable } from 'lib/schema';
import { eq } from 'drizzle-orm';
import {
	COOKIE_KEY_DISCORD,
	MSG_NOT_SIGNED_IN_DISCORD,
	invalidateDiscordUser,
	pushDiscordMetadata
} from '$lib/server/discord.js';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async ({ url, cookies, locals }) => {
	// TODO: ratelimit this

	const session = await locals.authRequest.validate();
	if (!session) {
		throw error(422, {
			message: MSG_NOT_SIGNED_IN_DISCORD,
			recourse: 'signup'
		});
	}
	const userId = session.user.userId;

	const storedState = cookies.get('discord_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	if (!storedState || !state || storedState !== state || !code) {
		throw error(422, 'Invalid OAuth state or no authorization code.');
	}
	try {
		// For user details, see:
		// https://discord.com/developers/docs/resources/user#user-object
		const { createKey, discordUser, discordTokens } = await discordAuth.validateCallback(code);

		let needKey = true;
		// Each user can only have one linked Discord account.
		// Well, technically, we also only allow one linked Google at a time as well,
		// but the Discord limitation is woven into the design of the Discord user table.
		const discordUsers = await db
			.select()
			.from(discordUserTable)
			.where(eq(discordUserTable.userId, userId));
		if (discordUsers.length == 1) {
			const oldDiscordUser = discordUsers[0];
			if (oldDiscordUser.username != discordUser.username) {
				// Invalidate the user on Discord's end.
				await invalidateDiscordUser(oldDiscordUser);
				// Remove the row which depends on the key.
				await db.delete(discordUserTable).where(eq(discordUserTable.userId, userId));
				// Remove the association to this Discord account on our end.
				await auth.deleteKey('discord', oldDiscordUser.id);
			} else {
				needKey = false;
			}
		}
		if (needKey) {
			createKey(userId);
		}

		// Upsert the record in the auxilliary Discord user table.

		const payload = {
			id: discordUser.id,
			username: discordUser.username,
			accessToken: discordTokens.accessToken,
			refreshToken: discordTokens.refreshToken,
			accessTokenExpiry: relSecsToDate(discordTokens.accessTokenExpiresIn)
		};
		// *This* is the "Discord user" referred to in other parts of the codebase;
		// not Lucia's Discord user that we've been using here.
		await db
			.insert(discordUserTable)
			.values({
				userId: userId,
				...payload
			})
			.onConflictDoUpdate({ target: discordUserTable.userId, set: payload });

		await pushDiscordMetadata(payload.accessToken, {
			is_bing_student: session.user.domain == 'binghamton.edu'
		});

		const text = cookies.get(COOKIE_KEY_DISCORD)
			? 'All set! You can close this window now.'
			: 'All set! You can now go to Discord and check the top channel to claim your role.';
		cookies.delete(COOKIE_KEY_DISCORD, { path: '/' });
		throw redirect(
			'/profile',
			{
				type: 'success',
				text
			},
			cookies
		);
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
