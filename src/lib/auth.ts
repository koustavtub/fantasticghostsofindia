import crypto from 'node:crypto';
import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'fgoi_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  const secret = import.meta.env.SESSION_SECRET ?? process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not set');
  }
  return secret;
}

function getAdminPassword(): string {
  const password = import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_PASSWORD is not set');
  }
  return password;
}

export function verifyPassword(input: string): boolean {
  const expected = getAdminPassword();
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export function createSessionToken(): string {
  const payload = JSON.stringify({
    admin: true,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  });
  const signature = crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('hex');

  return Buffer.from(JSON.stringify({ payload, signature })).toString('base64url');
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as {
      payload: string;
      signature: string;
    };

    const expectedSignature = crypto
      .createHmac('sha256', getSessionSecret())
      .update(decoded.payload)
      .digest('hex');

    const sigBuffer = Buffer.from(decoded.signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return false;
    }

    const session = JSON.parse(decoded.payload) as { admin: boolean; exp: number };
    return session.admin === true && session.exp > Date.now();
  } catch {
    return false;
  }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function setSessionCookie(cookies: AstroCookies, token: string, secure: boolean): void {
  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
    secure,
  });
}

export function deleteSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function buildSessionCookie(token: string, secure: boolean): string {
  const maxAge = Math.floor(SESSION_MAX_AGE_MS / 1000);
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];

  if (secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export function requireAuth(cookies: AstroCookies): boolean {
  return isAuthenticated(cookies);
}
