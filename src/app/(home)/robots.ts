import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: 'clerk.llmtrust.com'
    },
    sitemap: 'https://llmtrust.com/sitemap.xml',
  }
}
