import {
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const ghosts = pgTable('ghosts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  alternateNames: text('alternate_names').array().notNull().default([]),
  region: text('region').notNull(),
  gender: text('gender').notNull().default('Unknown'),
  summary: text('summary').notNull(),
  appearance: text('appearance').notNull(),
  behavior: text('behavior').notNull(),
  lore: text('lore').notNull(),
  protection: text('protection').notNull(),
  tags: text('tags').array().notNull().default([]),
  images: text('images').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Ghost = typeof ghosts.$inferSelect;
export type NewGhost = typeof ghosts.$inferInsert;
