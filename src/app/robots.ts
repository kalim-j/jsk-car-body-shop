import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/auth/', '/cart/'],
    },
    sitemap: 'https://jsk-car-body-shop.vercel.app/sitemap.xml',
  }
}
