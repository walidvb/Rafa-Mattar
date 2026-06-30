import type { NextApiRequest } from 'next';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_VALUE = '1';

export function parseCookies(req: NextApiRequest): Record<string, string> {
  const header = req.headers.cookie ?? '';

  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=');
        const key = part.slice(0, separator);
        const value = part.slice(separator + 1);
        return [key, decodeURIComponent(value)];
      })
  );
}

export function isAdminAuthenticated(req: NextApiRequest): boolean {
  const cookies = parseCookies(req);
  return cookies[ADMIN_SESSION_COOKIE] === ADMIN_SESSION_VALUE;
}

export function adminSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_SESSION_COOKIE}=${ADMIN_SESSION_VALUE}; HttpOnly; Path=/; SameSite=Strict${secure}`;
}

export function clearAdminSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${secure}`;
}
