// console app: robots.ts
import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/signin',
        disallow: '/',
      }
    ],
    sitemap: 'https://console.shipoff.in/sitemap.xml',
  }
}