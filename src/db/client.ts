import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import * as schema from './schema';
import { env } from 'cloudflare:workers'

export async function getEnv(): Promise<Record<string, any>> {
  return env
}

export async function getDb(explicitEnv?: any) {
  const env = explicitEnv || await getEnv();

  if (env && env.DB) {
    return drizzleD1(env.DB, { schema });
  }
  throw new Error('No Cloudflare D1 binding "DB" found and unable to initialize fallback.');
}

export { schema };
