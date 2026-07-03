import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

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
  metadataBase: new URL('https://jaredduron.com'),
  title: {
    default: 'Jared Duron — Filmmaker Barcelona | Cinematic Video Production',
    template: '%s | Jared Duron — Filmmaker Barcelona',
  },
  description: 'Filmmaker y videographer en Barcelona especializado en producción audiovisual cinematográfica para marcas premium, agencias creativas y productoras internacionales. Video corporativo, publicidad, documentales y eventos.',
  keywords: [
    'filmmaker Barcelona',
    'videographer Barcelona',
    'director de fotografía Barcelona',
    'video production Barcelona',
    'corporate videographer Barcelona',
    'commercial filmmaker Spain',
    'product video Barcelona',
    'brand filmmaker Barcelona',
    'event videographer Barcelona',
    'cinematic video Barcelona',
    'productora audiovisual Barcelona',
    'vídeo corporativo Barcelona',
    'Jared Duron',
  ],
  authors: [{ name: 'Jared Duron' }],
  creator: 'Jared Duron',
  publisher: 'Jared Duron',
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
      'en-US': '/en',
      'ca-ES': '/ca',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://jaredduron.com',
    siteName: 'Jared Duron — Filmmaker Barcelona',
    title: 'Jared Duron — Filmmaker Barcelona | Cinematic Video Production',
    description: 'Stories that move people. Films that grow brands. Filmmaker cinematográfico basado en Barcelona.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=srgb&fm=jpg&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'Jared Duron Filmmaker Barcelona',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jared Duron — Filmmaker Barcelona',
    description: 'Stories that move people. Films that grow brands.',
    images: ['https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=srgb&fm=jpg&w=1200&h=630&q=85'],
    creator: '@jaredduron',
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
  icons: {
    icon: '/favicon.ico',
  },
  category: 'creative',
}

export const viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jared Duron',
  jobTitle: 'Filmmaker & Director of Photography',
  description: 'Cinematic filmmaker based in Barcelona specializing in commercial video, documentaries, brand storytelling and event coverage.',
  url: 'https://jaredduron.com',
  image: 'https://images.unsplash.com/photo-1515138692129-197a2c608cfd?crop=entropy&cs=srgb&fm=jpg&w=800&q=85',
  sameAs: [
    'https://www.behance.net/jaredduron',
    'https://www.instagram.com/jaredduron',
    'https://www.linkedin.com/in/jaredduron',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Barcelona',
    addressRegion: 'Cataluña',
    addressCountry: 'ES',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Jared Duron Films',
  },
  knowsAbout: [
    'Cinematography',
    'Filmmaking',
    'Video Production',
    'Documentary',
    'Commercial Video',
    'Color Grading',
    'Motion Graphics',
  ],
}

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://jaredduron.com/#business',
  name: 'Jared Duron Films — Filmmaker Barcelona',
  image: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85',
  url: 'https://jaredduron.com',
  telephone: '+34-600-000-000',
  priceRange: '€€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Barcelona',
    addressLocality: 'Barcelona',
    postalCode: '08001',
    addressRegion: 'Cataluña',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.3874,
    longitude: 2.1686,
  },
  areaServed: ['Barcelona', 'Cataluña', 'Spain', 'Europe', 'Worldwide'],
  serviceType: [
    'Video Production',
    'Cinematography',
    'Commercial Filmmaking',
    'Documentary Production',
    'Corporate Video',
    'Event Videography',
    'Color Grading',
    'Motion Graphics',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://videos.pexels.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      </head>
      <body className="antialiased bg-[#0A0A0A] text-neutral-100 font-sans selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  )
}
