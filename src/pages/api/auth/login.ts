import type { APIRoute } from 'astro';
import { createSessionToken, setSessionCookie, verifyPassword } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect, url, cookies }) => {
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '');
  const secure = url.protocol === 'https:';

  if (!verifyPassword(password)) {
    return redirect('/admin/login?error=invalid');
  }

  const token = createSessionToken();
  setSessionCookie(cookies, token, secure);
  return redirect('/admin');
};

export const prerender = false;
