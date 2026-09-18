import { SignJWT, jwtVerify } from 'jose';
import { env as cfEnv } from 'cloudflare:workers';

const SESSION_COOKIE_NAME = 'admin_session';
const REFRESH_COOKIE_NAME = 'admin_refresh';

const SESSION_EXPIRATION_SECONDS = 15 * 60; // 15 minutos
const REFRESH_EXPIRATION_SECONDS = 24 * 60 * 60; // 1 día

// Computes a distinct HMAC-SHA256 hash using the Web Crypto API
export async function computeHash(input: string, saltSuffix: string, secretKey: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = enc.encode(`${secretKey}:${saltSuffix}`);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(input));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getRuntimeCredentials(explicitEnv?: any) {
  const env = explicitEnv || cfEnv;
  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;
  const secret = env.AUTH_SECRET;
  if (!username || !password || !secret) {
    throw new Error('El administrador no esta disponible. Por favor, intenta mas tarde.');
  }
  return { username, password, secret };
}

// Generates distinct hashes for user and password
export async function generateCredentialsHashes(username: string, password: string, secret: string) {
  const userHash = await computeHash(username, 'user-distinct-salt-sevalesonar-v1', secret);
  const passHash = await computeHash(password, 'pass-distinct-salt-sevalesonar-v1', secret);
  return { userHash, passHash };
}

// Signs a 15-minute Session JWT using jose
export async function createSessionToken(username: string, password: string, secret: string): Promise<string> {
  const { userHash, passHash } = await generateCredentialsHashes(username, password, secret);
  const secretKey = new TextEncoder().encode(secret);

  return await new SignJWT({
    type: 'session',
    userHash,
    passHash
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_SECONDS}s`)
    .sign(secretKey);
}

// Signs a 1-day Refresh JWT using jose
export async function createRefreshToken(username: string, password: string, secret: string): Promise<string> {
  const { userHash, passHash } = await generateCredentialsHashes(username, password, secret);
  const secretKey = new TextEncoder().encode(`${secret}:refresh-token-salt`);

  return await new SignJWT({
    type: 'refresh',
    userHash,
    passHash
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_EXPIRATION_SECONDS}s`)
    .sign(secretKey);
}

// Verifies session token and checks hashes against current runtime credentials
export async function verifySessionToken(token: string, explicitEnv?: any): Promise<{ valid: boolean; reason?: string }> {
  try {
    const { username, password, secret } = await getRuntimeCredentials(explicitEnv);
    const secretKey = new TextEncoder().encode(secret);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256']
    });

    if (payload.type !== 'session') {
      return { valid: false, reason: 'Invalid token type' };
    }

    const { userHash: expectedUserHash, passHash: expectedPassHash } =
      await generateCredentialsHashes(username, password, secret);

    if (payload.userHash !== expectedUserHash || payload.passHash !== expectedPassHash) {
      return { valid: false, reason: 'Credentials mismatch' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, reason: error.message || 'Token verification failed' };
  }
}

// Verifies refresh token against current runtime credentials
export async function verifyRefreshToken(token: string, explicitEnv?: any): Promise<{ valid: boolean; reason?: string }> {
  try {
    const { username, password, secret } = await getRuntimeCredentials(explicitEnv);
    const secretKey = new TextEncoder().encode(`${secret}:refresh-token-salt`);

    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256']
    });

    if (payload.type !== 'refresh') {
      return { valid: false, reason: 'Invalid refresh token type' };
    }

    const { userHash: expectedUserHash, passHash: expectedPassHash } =
      await generateCredentialsHashes(username, password, secret);

    if (payload.userHash !== expectedUserHash || payload.passHash !== expectedPassHash) {
      return { valid: false, reason: 'Credentials mismatch' };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, reason: error.message || 'Refresh token verification failed' };
  }
}

export { SESSION_COOKIE_NAME, REFRESH_COOKIE_NAME, SESSION_EXPIRATION_SECONDS, REFRESH_EXPIRATION_SECONDS };
