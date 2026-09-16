import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable(
  'products',
  {
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
    is_featured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
    featured_label: text('featured_label').default('Especialidad de la casa'),
    featured_description: text('featured_description').default('Horneados frescos cada mañana'),
    order_index: integer('order_index').notNull().default(0),
    created_at: integer('created_at').notNull().$defaultFn(() => Math.floor(Date.now() / 1000)),
    updated_at: integer('updated_at').notNull().$defaultFn(() => Math.floor(Date.now() / 1000))
  },
  (table) => [
    index('idx_products_active_order').on(table.active, table.order_index)
  ]
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
