import type { Config } from 'drizzle-kit';

export default {
	schema: 'lib/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		host: process.env.DB_HOST,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB
	}
} satisfies Config;
