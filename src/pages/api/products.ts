import type { APIRoute } from 'astro';
import { getDb, schema } from '../../db/client';
import { ok, serverError } from '../../lib/response';
import { eq, desc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();

    const activeProducts = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.active, true))
      .orderBy(schema.products.order_index, desc(schema.products.created_at));

    return ok(activeProducts, 'Catálogo obtenido exitosamente', {
      'Cache-Control': 'public, max-age=60, s-maxage=300'
    });
  } catch (error) {
    return serverError(error);
  }
};
