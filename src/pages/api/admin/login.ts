import type { APIRoute } from 'astro';
import { getRuntimeCredentials, createSessionToken, createRefreshToken } from '../../../lib/auth';
import { ok, badRequest, unauthorized, serverError } from '../../../lib/response';
import type { LoginRequestBody } from '../../../types/api';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const { username, password } = body;

    if (!username || !password) {
      return badRequest('Usuario y contraseña requeridos');
    }

    const { username: expectedUser, password: expectedPass, secret } = await getRuntimeCredentials();

    if (username.trim() !== expectedUser || password !== expectedPass) {
      return unauthorized('Credenciales inválidas');
    }

    const sessionToken = await createSessionToken(username.trim(), password, secret);
    const refreshToken = await createRefreshToken(username.trim(), password, secret);

    const isSecure = new URL(request.url).protocol === 'https:';

    cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 15 * 60,
      secure: isSecure
    });

    cookies.set('admin_refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      secure: isSecure
    });

    return ok({ authenticated: true }, 'Autenticación exitosa');
  } catch (error) {
    return serverError(error);
  }
};
