import type { APIRoute } from 'astro';
import { uploadImageToR2 } from '../../../lib/r2';
import { ok, badRequest, serverError } from '../../../lib/response';
import type { UploadResponseData } from '../../../types/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return badRequest('La petición debe ser multipart/form-data');
    }

    const formData = await request.formData();
    const file = formData.get('image') || formData.get('file');

    if (!file || !(file instanceof File)) {
      return badRequest('No se encontró el archivo de imagen en el formulario');
    }

    const result = await uploadImageToR2(file);

    if (!result.success || !result.url) {
      return badRequest(result.error || 'Error al procesar la subida');
    }

    const uploadData: UploadResponseData = {
      url: result.url,
      key: result.key || '',
      size: result.size || file.size,
      mimeType: result.mimeType || file.type
    };

    return ok<UploadResponseData>(uploadData, 'Imagen subida exitosamente');
  } catch (error) {
    return serverError(error);
  }
};
