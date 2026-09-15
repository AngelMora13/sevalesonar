import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name', { length: 30 }).notNull(),
  description: text('description', { length: 500 }).notNull().default(''),
  price: text('price').notNull().default(''),
  show_price: integer('show_price', { mode: 'boolean' }).notNull().default(true),
  category: text('category').notNull().default('ponquesitos'),
  image_url: text('image_url').notNull().default(''),
  image_key: text('image_key').notNull().default(''),
  image_size: integer('image_size').notNull().default(0),
  image_mime: text('image_mime').notNull().default(''),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  order_index: integer('order_index').notNull().default(0),
  created_at: integer('created_at').notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
  updated_at: integer('updated_at').notNull().$defaultFn(() => Math.floor(Date.now() / 1000))
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
