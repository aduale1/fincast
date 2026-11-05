import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Fincast database schema.
 *
 * Rules that apply to every table:
 * - Money is an integer number of cents (see packages/shared/src/money.ts).
 * - Every row that belongs to a person has a user_id foreign key with ON DELETE CASCADE,
 *   so deleting an account removes all of its data, and queries can always be scoped by user.
 * - The database enforces basic rules itself (CHECK constraints), so bad data is rejected
 *   even if a bug slips past the API's validation. This is "defence in depth".
 */

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const incomeType = pgEnum('income_type', ['recurring', 'expected', 'one_off']);
export const frequency = pgEnum('frequency', ['once', 'weekly', 'biweekly', 'monthly', 'yearly']);
export const incomeStatus = pgEnum('income_status', ['active', 'received', 'late', 'lost']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // Stored lowercased by the API so "Me@x.com" and "me@x.com" are the same account.
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    everydaySpendingCents: integer('everyday_spending_cents').notNull().default(0),
    bufferCents: integer('buffer_cents').notNull().default(0),
    currency: text('currency').notNull().default('CAD'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('users_email_unique').on(t.email),
    check('users_everyday_spending_non_negative', sql`${t.everydaySpendingCents} >= 0`),
    check('users_buffer_non_negative', sql`${t.bufferCents} >= 0`),
  ],
);

export const sessions = pgTable(
  'sessions',
  {
    // A hash of the random token stored in the browser cookie. If the database leaked,
    // the hashes alone could not be used to log in as anyone.
    id: text('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('sessions_user_id_idx').on(t.userId)],
);

export const incomeSources = pgTable(
  'income_sources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    type: incomeType('type').notNull(),
    amountCents: integer('amount_cents').notNull(),
    frequency: frequency('frequency').notNull(),
    // The next date this money is expected to arrive. Recurring sources roll forward from here.
    nextDate: date('next_date', { mode: 'string' }).notNull(),
    // 0-100. Only meaningful for "expected" income; confirmed income is 100.
    confidence: smallint('confidence').notNull().default(100),
    status: incomeStatus('status').notNull().default('active'),
    ...timestamps,
  },
  (t) => [
    index('income_sources_user_id_idx').on(t.userId),
    check('income_sources_amount_positive', sql`${t.amountCents} > 0`),
    check('income_sources_confidence_range', sql`${t.confidence} BETWEEN 0 AND 100`),
  ],
);

export const bills = pgTable(
  'bills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    amountCents: integer('amount_cents').notNull(),
    frequency: frequency('frequency').notNull(),
    // First due date. With the frequency this generates every future due date,
    // including "the 31st" in shorter months (handled by the forecast engine).
    startDate: date('start_date', { mode: 'string' }).notNull(),
    // Optional: when the bill stops (for example a phone contract ending).
    endDate: date('end_date', { mode: 'string' }),
    ...timestamps,
  },
  (t) => [
    index('bills_user_id_idx').on(t.userId),
    check('bills_amount_positive', sql`${t.amountCents} > 0`),
    check('bills_end_after_start', sql`${t.endDate} IS NULL OR ${t.endDate} >= ${t.startDate}`),
  ],
);

export const balanceCheckins = pgTable(
  'balance_checkins',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    checkedOn: date('checked_on', { mode: 'string' }).notNull(),
    // Can be negative (an overdrawn account is real information).
    balanceCents: integer('balance_cents').notNull(),
    // What the forecast predicted for this date. Null for the very first check-in.
    // Comparing the two over time is how we detect drift.
    predictedCents: integer('predicted_cents'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // One check-in per user per day; a second one that day replaces the first.
    uniqueIndex('balance_checkins_user_day_unique').on(t.userId, t.checkedOn),
  ],
);

export const goals = pgTable(
  'goals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    targetCents: integer('target_cents').notNull(),
    targetDate: date('target_date', { mode: 'string' }).notNull(),
    savedCents: integer('saved_cents').notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index('goals_user_id_idx').on(t.userId),
    check('goals_target_positive', sql`${t.targetCents} > 0`),
    check('goals_saved_non_negative', sql`${t.savedCents} >= 0`),
  ],
);
