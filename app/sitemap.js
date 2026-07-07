export default function sitemap() {
  const baseUrl = 'https://portafolio-olive-beta-79.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
