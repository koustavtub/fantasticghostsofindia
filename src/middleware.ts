import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuthenticated(context.cookies)) {
      return context.redirect('/admin/login');
    }
  }

  if (pathname === '/admin/login' && isAuthenticated(context.cookies)) {
    return context.redirect('/admin');
  }

  return next();
});
