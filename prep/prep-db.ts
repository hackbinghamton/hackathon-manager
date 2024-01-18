import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

// TODO: check whether these are null

const user = process.env.POSTGRES_USER_HOME;
if (!user) {
	throw new Error('User not provided.');
}
const password = process.env.POSTGRES_PASSWORD_HOME;
if (!password) {
	throw new Error('Password token not provided.');
}
const host = process.env.DB_HOST;
if (!host) {
	throw new Error('DB host not provided.');
}
const dbName = process.env.POSTGRES_DB;
if (!dbName) {
	throw new Error('DB not provided.');
}

export const client = postgres(`postgres://${user}:${password}@${host}/${dbName}`);
export const db = drizzle(client);

await migrate(db, { migrationsFolder: '../drizzle' });
await client.end();
