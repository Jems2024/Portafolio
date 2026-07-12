import { Poppins } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
const siteName = 'Jared Durón Portfolio'
const siteTitle = 'Jared Durón | Filmmaker en Barcelona'
const siteDescription = 'Filmmaker en Barcelona especializado en producción audiovisual, fotografía, edición de vídeo y diseño gráfico para marcas, agencias y productoras.'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-primary',
  display: 'swap',
})

export const metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: 'Jared Durón' }],
  creator: 'Jared Durón',
  publisher: 'Jared Durón',
  alternates: {
    canonical: siteUrl || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl || undefined,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: siteUrl ? [{ url: `${siteUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Jared Durón, filmmaker en Barcelona' }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: siteUrl ? [`${siteUrl}/og-image.jpg`] : undefined,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  category: 'creative portfolio',
}

export const viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jared Durón',
  jobTitle: 'Filmmaker',
  ...(siteUrl ? { url: siteUrl } : {}),
  sameAs: [
    'https://www.behance.net/jaredduron',
    'https://www.instagram.com/jared_duron10/',
    'https://www.linkedin.com/in/jared-duron-87a041100/',
    'https://www.tiktok.com/@jems2124',
    'https://www.facebook.com/jaredmisael.duron/',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  ...(siteUrl ? { url: siteUrl } : {}),
  inLanguage: ['es', 'en', 'ca'],
  description: siteDescription,
  publisher: {
    '@type': 'Person',
    name: 'Jared Durón',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://customer-assets.emergentagent.com" />
        <link rel="preconnect" href="https://mir-s3-cdn-cf.behance.net" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased text-neutral-100 font-sans selection:bg-[#F5C518] selection:text-black">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
