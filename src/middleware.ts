import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken, verifyRefreshToken, createSessionToken, getRuntimeCredentials } from './lib/auth';
import { unauthorized } from './lib/response';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Protect /admin routes and /api/admin/* endpoints (except /api/admin/login and /admin/login)
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login';

  if ((isAdminRoute || isAdminApi) && !isLoginRoute) {
    const sessionCookie = context.cookies.get('admin_session')?.value;
    const refreshCookie = context.cookies.get('admin_refresh')?.value;

    let isAuthenticated = false;

    if (sessionCookie) {
      const sessionResult = await verifySessionToken(sessionCookie);
      if (sessionResult.valid) {
        isAuthenticated = true;
      }
    }

    // Auto-renew if session expired or missing but refresh token is valid
    if (!isAuthenticated && refreshCookie) {
      const refreshResult = await verifyRefreshToken(refreshCookie);
      if (refreshResult.valid) {
        const { username, password, secret } = await getRuntimeCredentials();
        const newSessionToken = await createSessionToken(username, password, secret);
        context.cookies.set('admin_session', newSessionToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          maxAge: 15 * 60,
          secure: url.protocol === 'https:'
        });
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      if (isAdminApi) {
        return unauthorized('No autorizado. Credenciales o sesión inválida.');
      }
      return context.redirect('/admin/login');
    }
  }

  return next();
});
