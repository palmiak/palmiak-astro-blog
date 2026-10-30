import { defineMiddleware } from 'astro:middleware';

// The site uses trailing slashes (`trailingSlash: 'always'`), and the dev server answers 404 without one.
// In dev, send /style-guide to /style-guide/ and generated files such as /og/home.png to /og/home.png/
// so typed addresses work. Production hosts redirect on their own.
export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) return next();

  const { pathname, search } = context.url;
  if (pathname.endsWith('/') || pathname.startsWith('/@') || pathname.startsWith('/_')) return next();

  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  if (!isFile) return context.redirect(`${pathname}/${search}`, 301);

  // A file: only redirect when nothing served it (generated endpoints), not for real static files
  const response = await next();
  return response.status === 404 ? context.redirect(`${pathname}/${search}`, 301) : response;
});
