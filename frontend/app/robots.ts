import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_BASE_URL || 'http://localhost'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login', '/register'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
