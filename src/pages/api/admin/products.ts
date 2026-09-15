import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../db/client';
import { PRODUCT_LIMITS, VALID_CATEGORIES } from '../../../lib/constants';
import { ok, created, badRequest, serverError } from '../../../lib/response';
import type { CreateProductRequestBody } from '../../../types/api';
import { sql, desc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const db = await getDb();
    const allProducts = await db
      .select()
      .from(schema.products)
      .orderBy(desc(schema.products.order_index), desc(schema.products.created_at));

    return ok(allProducts, 'Productos obtenidos exitosamente');
  } catch (error) {
    return serverError(error);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const db = await getDb();

    // 1. Check max 50 products limit to prevent DB collapse
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.products);
    const totalCount = Number(countResult[0]?.count || 0);

    if (totalCount >= PRODUCT_LIMITS.MAX_PRODUCTS) {
      return badRequest(`Límite máximo alcanzado. No se pueden crear más de ${PRODUCT_LIMITS.MAX_PRODUCTS} productos.`);
    }

    const body = (await request.json().catch(() => ({}))) as CreateProductRequestBody;
    let { name, description, price, show_price, category, image_url, image_key, image_size, image_mime, active } = body;

    // 2. Validate name (max 30 chars, required)
    name = typeof name === 'string' ? name.trim() : '';
    if (!name) {
      return badRequest('El nombre del producto es obligatorio.');
    }
    if (name.length > PRODUCT_LIMITS.MAX_NAME_LENGTH) {
      return badRequest(`El nombre no debe superar los ${PRODUCT_LIMITS.MAX_NAME_LENGTH} caracteres (actual: ${name.length}).`);
    }

    // 3. Validate description (max 500 chars)
    description = typeof description === 'string' ? description.trim() : '';
    if (description.length > PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH) {
      return badRequest(`La descripción no debe superar los ${PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres (actual: ${description.length}).`);
    }

    // 4. Validate category (fixed in code)
    if (!category || !VALID_CATEGORIES.includes(category)) {
      return badRequest(`Categoría inválida. Las categorías permitidas son: ${VALID_CATEGORIES.join(', ')}.`);
    }

    // 5. Price (free text string)
    price = typeof price === 'string' ? price.trim() : '';

    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = Math.floor(Date.now() / 1000);

    const newProduct = {
      id: newId,
      name,
      description,
      price,
      show_price: show_price === false ? false : true,
      category,
      image_url: typeof image_url === 'string' ? image_url.trim() : '',
      image_key: typeof image_key === 'string' ? image_key.trim() : '',
      image_size: typeof image_size === 'number' ? image_size : 0,
      image_mime: typeof image_mime === 'string' ? image_mime.trim() : '',
      active: active === false ? false : true,
      order_index: totalCount + 1,
      created_at: now,
      updated_at: now
    };

    await db.insert(schema.products).values(newProduct);

    return created(newProduct, 'Producto creado exitosamente');
  } catch (error) {
    return serverError(error);
  }
};
