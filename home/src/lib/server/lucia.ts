import { lucia } from 'lucia';
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { google } from '@lucia-auth/oauth/providers';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

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

export type Auth = typeof auth;
