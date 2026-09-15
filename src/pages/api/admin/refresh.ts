import type { APIRoute } from 'astro';
import { verifyRefreshToken, createSessionToken, getRuntimeCredentials } from '../../../lib/auth';
import { ok, unauthorized, serverError } from '../../../lib/response';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const refreshCookie = cookies.get('admin_refresh')?.value;

    if (!refreshCookie) {
      return unauthorized('Token de refresco no encontrado');
    }

    const verifyResult = await verifyRefreshToken(refreshCookie);
    if (!verifyResult.valid) {
      return unauthorized('Token de refresco inválido o expirado');
    }

    const { username, password, secret } = await getRuntimeCredentials();
    const newSessionToken = await createSessionToken(username, password, secret);
    const isSecure = new URL(request.url).protocol === 'https:';

    cookies.set('admin_session', newSessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 15 * 60,
      secure: isSecure
    });

    return ok({ refreshed: true }, 'Sesión renovada');
  } catch (error) {
    return serverError(error);
  }
};
