export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

  if (!baseUrl) return []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
