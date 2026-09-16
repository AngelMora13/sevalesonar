import type { APIRoute } from 'astro';
import { getDb, schema } from '../../../../db/client';
import { PRODUCT_LIMITS, VALID_CATEGORIES } from '../../../../lib/constants';
import { deleteImageFromR2 } from '../../../../lib/r2';
import { ok, badRequest, notFound, serverError } from '../../../../lib/response';
import type { UpdateProductRequestBody, PatchProductRequestBody } from '../../../../types/api';
import { eq, ne } from 'drizzle-orm';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return badRequest('ID de producto requerido');
    }

    const db = await getDb();
    const existing = await db.select().from(schema.products).where(eq(schema.products.id, id)).get();

    if (!existing) {
      return notFound('Producto no encontrado');
    }

    const body = (await request.json().catch(() => ({}))) as UpdateProductRequestBody;
    let { name, description, price, show_price, category, image_url, image_key, image_size, image_mime, active, is_featured, featured_label, featured_description, order_index } = body;

    // Validate name
    name = typeof name === 'string' ? name.trim() : existing.name;
    if (!name) {
      return badRequest('El nombre es obligatorio.');
    }
    if (name.length > PRODUCT_LIMITS.MAX_NAME_LENGTH) {
      return badRequest(`El nombre no debe superar los ${PRODUCT_LIMITS.MAX_NAME_LENGTH} caracteres.`);
    }

    // Validate description
    description = typeof description === 'string' ? description.trim() : existing.description;
    if (description.length > PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH) {
      return badRequest(`La descripción no debe superar los ${PRODUCT_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres.`);
    }

    // Validate category
    category = category || existing.category as 'ponquesitos' | 'otros_postres';
    if (!VALID_CATEGORIES.includes(category)) {
      return badRequest(`Categoría inválida (${category}). Opciones: ${VALID_CATEGORIES.join(', ')}.`);
    }

    price = typeof price === 'string' ? price.trim() : existing.price;

    const newImageKey = typeof image_key === 'string' ? image_key.trim() : existing.image_key;

    // If the image has changed and old product had an image key in R2, delete the old image
    if (existing.image_key && newImageKey !== existing.image_key) {
      await deleteImageFromR2(existing.image_key);
    }

    // If marking as featured, unset all others
    if (is_featured === true) {
      await db
        .update(schema.products)
        .set({ is_featured: false })
        .where(ne(schema.products.id, id));
    }

    const now = Math.floor(Date.now() / 1000);

    const updateData: Partial<typeof schema.products.$inferInsert> = {
      name,
      description,
      price,
      show_price: show_price !== undefined ? show_price : existing.show_price,
      category,
      image_url: typeof image_url === 'string' ? image_url.trim() : existing.image_url,
      image_key: newImageKey,
      image_size: typeof image_size === 'number' ? image_size : existing.image_size,
      image_mime: typeof image_mime === 'string' ? image_mime.trim() : existing.image_mime,
      active: active !== undefined ? active : existing.active,
      is_featured: is_featured !== undefined ? is_featured : existing.is_featured,
      featured_label: typeof featured_label === 'string' && featured_label.trim() ? featured_label.trim() : existing.featured_label,
      featured_description: typeof featured_description === 'string' && featured_description.trim() ? featured_description.trim() : existing.featured_description,
      order_index: typeof order_index === 'number' ? order_index : existing.order_index,
      updated_at: now
    };

    await db.update(schema.products).set(updateData).where(eq(schema.products.id, id));

    return ok({ id, ...updateData }, 'Producto actualizado con éxito');
  } catch (error) {
    return serverError(error);
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return badRequest('ID de producto requerido');
    }

    const body = (await request.json().catch(() => ({}))) as PatchProductRequestBody;
    const db = await getDb();

    const existing = await db.select().from(schema.products).where(eq(schema.products.id, id)).get();
    if (!existing) {
      return notFound('Producto no encontrado');
    }

    const updateData: any = {
      updated_at: Math.floor(Date.now() / 1000)
    };

    if (typeof body.active === 'boolean') {
      updateData.active = body.active;
    }
    if (typeof body.show_price === 'boolean') {
      updateData.show_price = body.show_price;
    }
    if (typeof body.is_featured === 'boolean') {
      if (body.is_featured === true) {
        // Unset any other featured product
        await db
          .update(schema.products)
          .set({ is_featured: false })
          .where(ne(schema.products.id, id));
      }
      updateData.is_featured = body.is_featured;
    }

    await db.update(schema.products).set(updateData).where(eq(schema.products.id, id));

    return ok(null, 'Estado modificado');
  } catch (error) {
    return serverError(error);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return badRequest('ID requerido');
    }

    const db = await getDb();
    const existing = await db.select().from(schema.products).where(eq(schema.products.id, id)).get();

    if (!existing) {
      return notFound('Producto no encontrado');
    }

    // Delete image from R2 bucket if exists
    if (existing.image_key) {
      await deleteImageFromR2(existing.image_key);
    }

    await db.delete(schema.products).where(eq(schema.products.id, id));

    return ok({ id }, 'Producto e imagen eliminados correctamente');
  } catch (error) {
    return serverError(error);
  }
};
