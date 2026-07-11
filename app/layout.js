import { Poppins } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const siteUrl = 'https://portafolio-olive-beta-79.vercel.app'
const siteName = 'Jared Durón Portfolio'
const siteTitle = 'Jared Durón | Filmmaker y producción audiovisual en Barcelona'
const siteDescription = 'Filmmaker en Barcelona especializado en producción audiovisual, edición de vídeo, dirección de fotografía y diseño gráfico para marcas, agencias y productoras.'
const openGraphTitle = 'Jared Durón — Filmmaker in Barcelona'
const openGraphDescription = 'Producción audiovisual, filmmaking y diseño gráfico para marcas, agencias y productoras.'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-primary',
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
    'Jared Durón',
    'Jared Durón filmmaker',
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
  authors: [{ name: 'Jared Durón' }],
  creator: 'Jared Durón',
  publisher: 'Jared Durón',
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
    title: openGraphTitle,
    description: openGraphDescription,
  },
  twitter: {
    card: 'summary',
    title: openGraphTitle,
    description: openGraphDescription,
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
  name: 'Jared Durón',
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
