import { env as cfEnv } from 'cloudflare:workers';
import { PRODUCT_LIMITS } from './constants';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  size?: number;
  mimeType?: string;
  error?: string;
}

// In-memory fallback map for local testing when R2 is unbound
const localMemoryBucket = new Map<string, { buffer: ArrayBuffer; contentType: string }>();

export async function uploadImageToR2(
  file: File,
  explicitEnv?: any
): Promise<UploadResult> {
  // Validate file presence
  if (!file || file.size === 0) {
    return { success: false, error: 'No se ha enviado ningún archivo de imagen' };
  }

  // Validate size limit (max 5MB)
  if (file.size > PRODUCT_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    return {
      success: false,
      error: `La imagen excede el límite de 5MB (tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
    };
  }

  // Validate MIME type
  if (!PRODUCT_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      success: false,
      error: `Formato de imagen no soportado (${file.type}). Use JPG, PNG, WebP o AVIF`
    };
  }

  const env = explicitEnv || cfEnv;
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const cleanExtension = fileExtension.replace(/[^a-z0-9]/g, '');
  const uniqueKey = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExtension}`;
  const arrayBuffer = await file.arrayBuffer();

  // Cloudflare R2 standard put
  if (env && env.IMAGES_BUCKET && typeof env.IMAGES_BUCKET.put === 'function') {
    try {
      await env.IMAGES_BUCKET.put(uniqueKey, arrayBuffer, {
        httpMetadata: {
          contentType: file.type
        }
      });

      return {
        success: true,
        url: `/api/images/${encodeURIComponent(uniqueKey)}`,
        key: uniqueKey,
        size: file.size,
        mimeType: file.type
      };
    } catch (err: any) {
      console.error('Error uploading to R2 bucket:', err);
      return { success: false, error: 'Error al almacenar la imagen en Cloudflare R2' };
    }
  }

  // Pure Web API fallback
  localMemoryBucket.set(uniqueKey, {
    buffer: arrayBuffer,
    contentType: file.type
  });

  return {
    success: true,
    url: `/api/images/${encodeURIComponent(uniqueKey)}`,
    key: uniqueKey,
    size: file.size,
    mimeType: file.type
  };
}

export async function deleteImageFromR2(key: string, explicitEnv?: any): Promise<boolean> {
  if (!key || typeof key !== 'string') return false;

  const env = explicitEnv || cfEnv;
  const decodedKey = decodeURIComponent(key);

  if (env && env.IMAGES_BUCKET && typeof env.IMAGES_BUCKET.delete === 'function') {
    try {
      await env.IMAGES_BUCKET.delete(decodedKey);
      return true;
    } catch (err) {
      console.error('Error deleting image from R2 bucket:', err);
      return false;
    }
  }

  if (localMemoryBucket.has(decodedKey)) {
    localMemoryBucket.delete(decodedKey);
    return true;
  }

  return false;
}

export async function getImageFromR2(key: string, explicitEnv?: any) {
  const env = explicitEnv || cfEnv;
  const decodedKey = decodeURIComponent(key);

  // Cloudflare R2 standard get
  if (env && env.IMAGES_BUCKET && typeof env.IMAGES_BUCKET.get === 'function') {
    return await env.IMAGES_BUCKET.get(decodedKey);
  }

  // In-memory fallback
  if (localMemoryBucket.has(decodedKey)) {
    const item = localMemoryBucket.get(decodedKey)!;
    return {
      body: item.buffer,
      httpMetadata: {
        contentType: item.contentType
      }
    };
  }

  return null;
}
