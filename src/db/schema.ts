import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, uuid, decimal, jsonb, numeric, integer } from "drizzle-orm/pg-core";

// Define enums
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system', 'data']);
export const creditTransactionTypeEnum = pgEnum('credit_transaction_type', ['credit', 'debit']);
export const aiAppStatusEnum = pgEnum('ai_app_status', ['active', 'inactive', 'deleted']);

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  first_name: text('first_name'),
  last_name: text('last_name'),
  avatarUrl: text('avatar_url'),

  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  llmId: uuid('llm_id')
    .references(() => llms.id, { onDelete: 'set null' }),
  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const llms = pgTable('llm', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  created_date: text('created'),
  website: text('website'),
  description: text('description'),
  provider: text('provider'),
  api_access: boolean('api_access'),
  status: text('status').default('verified'),
  average_rating: decimal('average_rating', { precision: 3, scale: 2 }),
  pricing_input: decimal('pricing_input', { precision: 10, scale: 2 }),
  pricing_output: decimal('pricing_output', { precision: 10, scale: 2 }),

  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const tags = pgTable('tag', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const reviews = pgTable('review', {
  id: uuid('id').primaryKey().defaultRandom(),
  rating: integer('rating'),
  content: jsonb('content'),
  llmId: uuid('llm_id').references(() => llms.id, { onDelete: 'cascade' }),
  aiAppId: uuid('ai_app_id').references(() => aiApps.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const apiKeys = pgTable('api_key', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull(),
  name: text('name'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const credits = pgTable('credit', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  userId: text('userId').references(() => users.id),
  type: creditTransactionTypeEnum('type').notNull(),


  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const aiApps = pgTable('ai_app', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  website: text('website'),
  status: aiAppStatusEnum('status').default('active'),
  slug: text('slug'),
  image: text('image'),
  average_rating: decimal('average_rating', { precision: 3, scale: 2 }),

  createdAt: timestamp({ mode: 'date', precision: 3 }).defaultNow(),
  updatedAt: timestamp({ mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
});

export const aiAppsLlms = pgTable('ai_apps_llms', {
  id: uuid('id').primaryKey().defaultRandom(),
  aiAppId: uuid('ai_app_id')
    .notNull()
    .references(() => aiApps.id, { onDelete: 'cascade' }),
  llmId: uuid('llm_id')
    .notNull()
    .references(() => llms.id, { onDelete: 'cascade' }),
});

// Create a table to indicate a conversation can have multiple tags
export const llmsTags = pgTable(
  'llms_tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    llmId: uuid('llm_id')
      .notNull()
      .references(() => llms.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
);

// Create a table to indicate a conversation can have multiple user
export const conversationsUsers = pgTable(
  'conversations_users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
);

// Export all tables for use in the application
export const schema = {
  users,
  llms,
  conversations,
  messages,
  reviews,
  credits,
  apiKeys,
  tags,
  aiApps,

  aiAppsLlms,
  conversationsUsers,
  llmsTags,
};

export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type LLM = typeof llms.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type AiApp = typeof aiApps.$inferSelect;
export type Review = typeof reviews.$inferSelect;
