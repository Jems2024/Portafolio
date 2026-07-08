import { Inter, Playfair_Display } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const siteUrl = 'https://portafolio-olive-beta-79.vercel.app'
const siteName = 'Jared Duron Portfolio'
const siteTitle = 'Jared Duron - Filmmaker and Videographer in Barcelona'
const siteDescription = 'Jared Duron is a filmmaker, videographer and visual creator based in Barcelona, creating cinematic videos, brand films, corporate videos, event coverage, social media content and visual storytelling for brands, agencies and creative projects.'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'Jared Duron',
    'Jared Duron filmmaker',
    'filmmaker Barcelona',
    'videographer Barcelona',
    'produccion audiovisual Barcelona',
    'brand films',
    'video corporativo',
    'event coverage',
    'social media content',
    'visual storytelling',
    'diseno grafico',
  ],
  authors: [{ name: 'Jared Duron' }],
  creator: 'Jared Duron',
  publisher: 'Jared Duron',
  alternates: {
    canonical: siteUrl,
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
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
  },
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
  name: 'Jared Duron',
  jobTitle: 'Filmmaker / Videographer / Visual Creator',
  url: siteUrl,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Barcelona',
    addressCountry: 'Spain',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  inLanguage: ['es', 'en', 'ca'],
  description: siteDescription,
  publisher: {
    '@type': 'Person',
    name: 'Jared Duron',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
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
        <Analytics />
      </body>
    </html>
  )
}
