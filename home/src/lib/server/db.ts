import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '$env/dynamic/private';

export const client = postgres(
	`postgres://${env.POSTGRES_USER_HOME}:${env.POSTGRES_PASSWORD_HOME}@${env.DB_HOST}/${env.POSTGRES_DB}`
);
export const db = drizzle(client);
