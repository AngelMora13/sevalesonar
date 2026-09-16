import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/c802218ea7fba684008e249aee2bec446bce894038961652e3c883bacab58643.sqlite',
  },

});
