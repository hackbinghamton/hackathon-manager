import type { Config } from 'drizzle-kit';

// TODO: proper db migration

export default {
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		host: process.env.DB_HOST,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB
	}
} satisfies Config;
