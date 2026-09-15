import type { APIRoute } from 'astro';
import { getImageFromR2 } from '../../../lib/r2';
import { notFound } from '../../../lib/response';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const rawKey = params.key;
  if (!rawKey) {
    return notFound('Clave de imagen requerida');
  }

  const key = decodeURIComponent(rawKey);
  const object = await getImageFromR2(key);

  if (!object) {
    return notFound('Imagen no encontrada');
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  if (object.httpMetadata?.contentType) {
    headers.set('Content-Type', object.httpMetadata.contentType);
  } else {
    headers.set('Content-Type', 'image/webp');
  }

  return new Response(object.body, {
    status: 200,
    headers
  });
};
