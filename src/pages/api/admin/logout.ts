import type { APIRoute } from 'astro';
import { ok } from '../../../lib/response';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const isSecure = new URL(request.url).protocol === 'https:';

  cookies.delete('admin_session', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure
  });

  cookies.delete('admin_refresh', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecure
  });

  return ok(null, 'Sesión cerrada correctamente');
};
