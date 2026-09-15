import type { ApiResponse } from '../types/api';

const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

export function json<T>(data: ApiResponse<T>, status = 200, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...extraHeaders
    }
  });
}

// 200 OK
export function ok<T>(data?: T, message?: string, extraHeaders?: HeadersInit): Response {
  return json<T>({ success: true, data, message }, 200, extraHeaders);
}

// 201 Created
export function created<T>(data?: T, message?: string, extraHeaders?: HeadersInit): Response {
  return json<T>({ success: true, data, message }, 201, extraHeaders);
}

// 400 Bad Request
export function badRequest(error: string, details?: any): Response {
  return json({ success: false, error, data: details }, 400);
}

// 401 Unauthorized
export function unauthorized(error = 'No autorizado. Se requiere sesión de administrador.'): Response {
  return json({ success: false, error }, 401);
}

// 403 Forbidden
export function forbidden(error = 'Acceso denegado.'): Response {
  return json({ success: false, error }, 403);
}

// 404 Not Found
export function notFound(error = 'Recurso no encontrado.'): Response {
  return json({ success: false, error }, 404);
}

// 500 Server Error
export function serverError(error: unknown = 'Error interno del servidor.'): Response {
  const message = error instanceof Error ? error.message : String(error);
  return json({ success: false, error: message }, 500);
}
