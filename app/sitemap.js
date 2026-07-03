export default function sitemap() {
  const base = 'https://jaredduron.com'
  const lastModified = new Date()
  const routes = ['', '#work', '#about', '#services', '#process', '#testimonials', '#faq', '#contact', '#blog']
  return routes.map((r) => ({
    url: `${base}/${r}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: r === '' ? 1.0 : 0.7,
  }))
}
