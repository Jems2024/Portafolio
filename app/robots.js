export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
  }
}
