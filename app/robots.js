export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://jaredduron.com/sitemap.xml',
    host: 'https://jaredduron.com',
  }
}
