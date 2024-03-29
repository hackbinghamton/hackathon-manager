import { lucia } from 'lucia';
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { discord, google } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { building, dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

import { client } from './db.js';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	adapter: postgresAdapter(client, {
		user: 'user',
		session: 'user_session',
		key: 'user_key'
	}),
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			orgRole: data.org_role,
			email: data.email,
			name: data.name,
			firstName: data.first_name,
			lastName: data.last_name,
			avatarUrl: data.avatar_url,
			domain: data.domain,
			joinDate: data.join_date,
			isSignedUp: data.is_signed_up
		};
	}
});

export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	redirectUri: env.GOOGLE_REDIRECT_URI,
	scope: ['https://www.googleapis.com/auth/userinfo.email'],
	accessType: 'offline'
});

export const discordClientId = env.DISCORD_CLIENT_ID;
if (!building && !discordClientId) {
	throw new Error('Discord OAuth client ID not provided.');
}
export const discordClientSecret = env.DISCORD_CLIENT_SECRET;
if (!building && !discordClientSecret) {
	throw new Error('Discord OAuth secret not provided.');
}
export const discordAuth = discord(auth, {
	clientId: discordClientId,
	clientSecret: discordClientSecret,
	redirectUri: env.DISCORD_REDIRECT_URI,
	scope: ['role_connections.write']
});

// Converts from relative number of seconds to Date.
export function relSecsToDate(expiresIn: number) {
	return new Date(Date.now() + expiresIn * 1000);
}

export type Auth = typeof auth;

type CookieSetParams = Parameters<Cookies['set']>;
export const OAUTH_STATE_COOKIE_OPTS: CookieSetParams[2] = {
	httpOnly: true,
	secure: !dev,
	path: '/',
	maxAge: 60 * 60
};
