import type { MetadataRoute } from 'next'

const routes = [
  '',
  '/about',
  '/book-ride',
  '/dashboard',
  '/errand',
  '/food-delivery',
  '/help',
  '/history',
  '/login',
  '/orders',
  '/package-delivery',
  '/payment-methods',
  '/privacy',
  '/profile',
  '/settings',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routes.map((route) => ({
    url: `https://baratonride.com${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
