import { type MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:9002';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/features',
    '/pricing',
    '/contact',
    '/case-studies',
    '/login',
    '/signup',
  ];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
