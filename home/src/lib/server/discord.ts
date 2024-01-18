import { eq } from 'drizzle-orm';
import { db } from './db';
import { discordClientId, discordClientSecret, relSecsToDate } from './lucia';
import { discordUser as discordUserTable, type DiscordUser } from 'lib/schema';

// This should be consistent with the Discord prep script.
interface ConnectionMetadata {
	is_bing_student: boolean;
	// TODO: add a year
}

// Cookie indicating that this is a window opened by the Discord client.
export const COOKIE_KEY_DISCORD = 'is_from_discord';
export const MSG_NOT_SIGNED_IN_DISCORD =
	"It doesn't look like you're signed in. Note that Discord cannot be used as your primary sign-in.";
export const MSG_FROM_DISCORD =
	"Don't close this window yet - you still need to link your Discord account below.";

const API = 'https://discord.com/api/v10';

// Request headers for setting up OAuth, as per the RFC.
const DISCORD_OAUTH_SETUP_CREDS = {
	client_id: discordClientId,
	client_secret: discordClientSecret
};
const DISCORD_OAUTH_SETUP_HEADERS = {
	'Content-Type': 'application/x-www-form-urlencoded'
};

// Request headers for an established OAuth user.
function discordOauthHeaders(accessToken: string) {
	return { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };
}

async function handleError(response: Response, errorMsg: string) {
	if (!response.ok) {
		throw new Error(
			`${errorMsg}: [${response.status}] ${response.statusText}:\n${await response.text()}`
		);
	}
}

// Returns `true` iff the user has a valid token.
// This does not add any tolerance, so stay on top of your tokens.
export async function refreshDiscordToken(discordUser: DiscordUser, throwIfInvalid = false) {
	if (new Date() < discordUser.accessTokenExpiry) {
		return discordUser.accessToken;
	}
	// Docs: https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-refresh-token-exchange-example
	const url = `${API}/oauth2/token`;
	const body = {
		...DISCORD_OAUTH_SETUP_CREDS,
		grant_type: 'refresh_token',
		refresh_token: discordUser.refreshToken
	};
	const response = await fetch(url, {
		method: 'POST',
		headers: DISCORD_OAUTH_SETUP_HEADERS,
		body: new URLSearchParams(body)
	});
	if (!response.ok) {
		const { error }: { error: string } = await response.json();
		// Most likely, our app has been deauthorized by the user.
		// This also happens if the user re-authenticates with the same account.
		if (error == 'invalid_grant' && !throwIfInvalid) {
			return false;
		} else {
			throw new Error(`Failed to refresh Discord OAuth token: ${error}`);
		}
	}
	const json: { access_token: string; expires_in: number } = await response.json();
	const payload = {
		accessToken: json.access_token,
		accessTokenExpiry: relSecsToDate(json.expires_in)
	};
	discordUser = { ...discordUser, ...payload };
	const results = await db
		.update(discordUserTable)
		.set(payload)
		.where(eq(discordUserTable.userId, discordUser.userId))
		.returning({ _: discordUserTable.userId });
	if (results.length != 1) {
		throw new Error(`Failed to update Discord OAuth token.`);
	}
	return true;
}

// NOTE: This function must not throw if the Discord user is already invalid.
// This is important to prevent inconsistent state in consumers. Say we have:
//
// 	if (/* some condition that's true */) {
// 		invalidateDiscordUser(...)
// 		deleteKey(...)
// 	}
// 	createKey(...)
//
// and deleteKey throws due to some freak accident and doesn't do its job.
// Well, the `if` statement is still true, so we'll still go inside of it.
// If this function then unneededly throws, then `deleteKey` never gets a
// second chance to do its job.
//
// (in less words: this should be idemponent ^.^)
export async function invalidateDiscordUser(discordUser: DiscordUser) {
	// Discord themselves says that these credentials are already invalid.
	if (!(await refreshDiscordToken(discordUser))) {
		return;
	}

	// Docs: https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-token-revocation-example
	const url = `${API}/oauth2/token/revoke`;
	const body = {
		...DISCORD_OAUTH_SETUP_CREDS,
		token: discordUser.accessToken,
		token_type_hint: 'access_token'
	};
	const response = await fetch(url, {
		method: 'POST',
		headers: DISCORD_OAUTH_SETUP_HEADERS,
		body: new URLSearchParams(body)
	});
	handleError(response, 'Failed to revoke Discord OAuth token');
}

export async function pushDiscordMetadata(accessToken: string, metadata: ConnectionMetadata) {
	// Docs: https://discord.com/developers/docs/resources/user#update-current-user-application-role-connection
	const url = `${API}/users/@me/applications/${discordClientId}/role-connection`;
	const body = {
		platform_name: 'HackBU Discord Integration',
		metadata
	};
	const response = await fetch(url, {
		method: 'put',
		headers: discordOauthHeaders(accessToken),
		body: JSON.stringify(body)
	});
	handleError(response, 'Failed to push Discord connection metadata');
}
