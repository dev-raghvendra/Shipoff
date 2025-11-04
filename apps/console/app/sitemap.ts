// console app: app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://console.shipoff.in'
  
  return [
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ]
}