import { pgTable, bigint, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Make sure that you add additional columns to the
// Lucia.DatabaseUserAttributes type and the getUserAttributes function.
//
// Also be aware that Lucia doesn't support the existence
// of *any* default values here.
export const user = pgTable('user', {
	// Authentication

	id: varchar('id', {
		length: 15
	}).primaryKey(),

	// User Info

	email: varchar('email', { length: 254 }).notNull(),
	// May need to be deducted from first + last name.
	name: text('name').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	avatarUrl: text('avatar_url').notNull(),
	// May need to be deducted from email.
	domain: text('domain').notNull(),

	// Our Stuff

	// This is the datetime when the user successfully authenticates via OAuth,
	// which is a little bit earlier than they complete the sign-up process.
	joinDate: timestamp('join_date', { withTimezone: true, mode: 'date' }).notNull(),
	isSignedUp: boolean('is_signed_up').notNull()
});

// Make sure that you add additional columns to the Lucia.DatabaseSessionAttributes type.
export const session = pgTable('user_session', {
	id: varchar('id', {
		length: 128
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint('active_expires', {
		mode: 'number'
	}).notNull(),
	idleExpires: bigint('idle_expires', {
		mode: 'number'
	}).notNull()
});

export const key = pgTable('user_key', {
	id: varchar('id', {
		length: 255
	}).primaryKey(),
	userId: varchar('user_id', {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar('hashed_password', {
		length: 255
	})
});
