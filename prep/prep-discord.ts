// This script registers connection metadata with Discord.
// It's based off of this tutorial:
// https://discord.com/developers/docs/tutorials/configuring-app-metadata-for-linked-roles
// The style should match the Discord API code in our server project.

const discordClientId = process.env.DISCORD_CLIENT_ID;
if (!discordClientId) {
	throw new Error('Discord application ID not provided.');
}
const discordToken = process.env.DISCORD_TOKEN;
if (!discordToken) {
	throw new Error('Discord API token not provided.');
}

const API = 'https://discord.com/api/v10';

// Docs: https://discord.com/developers/docs/resources/application-role-connection-metadata
const url = `${API}/applications/${discordClientId}/role-connections/metadata`;
const body = [
	{
		key: 'is_bing_student',
		name: 'Binghamton University Student',
		description: 'Signed up with a binghamton.edu email.',
		type: 7 // BOOLEAN_EQUAL
	}
];
const response = await fetch(url, {
	method: 'PUT',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bot ${discordToken}`
	},
	body: JSON.stringify(body)
});
if (response.ok) {
	const data = await response.json();
	console.log(`Success! Discord says:`);
	console.log(data);
	process.exit(0);
} else {
	const text = await response.text();
	console.error(`Fail! Discord says:`);
	console.error(text);
	process.exit(1);
}
