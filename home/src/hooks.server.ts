import { SvelteKitAuth } from '@auth/sveltekit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Google from '@auth/core/providers/google';
import { env } from '$env/dynamic/private';

import db from '$lib/db';

// See: https://authjs.dev/getting-started/providers/oauth-tutorial?frameworks=sveltekit#create-server-hook
export const handle = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })]
});
