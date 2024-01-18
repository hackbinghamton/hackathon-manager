import { GradSem, OrgRole, UniRole } from './index.js';
import {
	pgTable,
	bigint,
	varchar,
	text,
	boolean,
	timestamp,
	pgEnum,
	smallint
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const orgRoleEnum = pgEnum('org_role', [
	OrgRole.Member,
	OrgRole.Helper,
	OrgRole.Organizer,
	OrgRole.SeniorOrganizer
]);

export const uniRoleEnum = pgEnum('uni_role', [
	UniRole.Undergrad,
	UniRole.Masters,
	UniRole.PhD,
	UniRole.FacStaff
]);

export const gradSemEnum = pgEnum('grad_sem', [GradSem.Spring, GradSem.Winter]);

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

	// For permissions.
	orgRole: orgRoleEnum('org_role').notNull(),
	email: varchar('email', { length: 254 }).notNull(),
	// May need to be deducted from first + last name.
	name: text('name').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	avatarUrl: text('avatar_url').notNull(),
	// May need to be deducted from email.
	// NOTE: The Discord connection metadata depends on this.
	domain: text('domain').notNull(),
	// This is the datetime when the user successfully authenticates via OAuth,
	// which is a little bit earlier than they complete the sign-up process.
	joinDate: timestamp('join_date', { withTimezone: true, mode: 'date' }).notNull(),
	isSignedUp: boolean('is_signed_up').notNull()
});

// This table is populated by the sign-up process ("regular" as opposed to hackathon).
// It is separate from the user table so that we can be clearer about what is and
// is not optional.
export const registrationRegular = pgTable('registration_regular', {
	userId: varchar('user_id', {
		length: 15
	})
		.primaryKey()
		.references(() => user.id),
	uniRole: uniRoleEnum('uni_role').notNull(),
	majors: text('majors').array().notNull(),
	gradSem: gradSemEnum('grad_sem'),
	gradYear: smallint('grad_year')
});

// Scheme for the sign-up phase, *after* authentication.
export const userSignupSchema = createInsertSchema(registrationRegular, {
	// First, we need to apply some common default values.
	// This has a couple of purposes:
	// - These will be bound to input elements, so we need them to not be null.
	//   This is especially important for MultiSelect.
	// - We want to pre-select common options, for convenience.

	uniRole: (schema) => schema.uniRole.default(UniRole.Undergrad),
	// First part is a workaround for https://github.com/drizzle-team/drizzle-orm/issues/1110.
	// TODO: Update once workaround is fixed.
	majors: z.array(z.string()).default([]),
	gradSem: (schema) => schema.gradSem.default(GradSem.Spring),
	gradYear: (schema) => schema.gradYear.gte(2000).lte(3000)
})
	// Perform pre-processing.
	.transform((val) => {
		// TODO: reject blank majors in the frontend as well.
		if (val.majors) {
			val.majors = val.majors.reduce((majors, major) => {
				major = major.trim();
				if (major) {
					majors.push(major);
				}
				return majors;
			}, [] as string[]);
		}
		return val;
	})
	// Perform error-checking.
	.superRefine((val, ctx) => {
		const addReqField = (name: string) => {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Required field',
				path: [name]
			});
		};

		// This field is not conditional, but does rely on preprocessing,
		// so we handle it in refine.
		if (!val.majors || val.majors?.length === 0) {
			addReqField('majors');
		} else if (val.majors.length > 4) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "That's a lot of majors!",
				path: ['majors']
			});
		}
		if (val.uniRole != UniRole.FacStaff) {
			if (!val.gradSem) {
				addReqField('gradSem');
			}
			if (!val.gradYear) {
				addReqField('gradYear');
			}
		}
	})
	// Perform post-processing.
	// Undo the default values we added if they ended up being N/A.
	.transform((val) => {
		if (val.uniRole == UniRole.FacStaff) {
			val.gradSem = null;
			val.gradYear = null;
		}
		return val;
	});

export const discordUser = pgTable('discord_user', {
	userId: varchar('user_id', {
		length: 15
	})
		.primaryKey()
		.references(() => user.id),
	id: text('id').notNull(),
	username: text('username').notNull(),
	accessToken: text('access_token').notNull(),
	refreshToken: text('refresh_token').notNull(),
	accessTokenExpiry: timestamp('access_token_expiry', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
	// TODO: Add a generated column referencing a discord key,
	// once Drizzle supports it. Currently blocked by:
	// https://github.com/drizzle-team/drizzle-orm/issues/295
});

// Not to be confused with Lucia's DiscordUser.
export type DiscordUser = typeof discordUser.$inferSelect;

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
