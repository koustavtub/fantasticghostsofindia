import type { APIRoute } from 'astro';
import { deleteSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ redirect, cookies }) => {
  deleteSessionCookie(cookies);
  return redirect('/admin/login');
};

export const prerender = false;
