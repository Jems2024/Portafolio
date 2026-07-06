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
    'filmmaker Barcelona','videographer Barcelona','videógrafo Barcelona','video production Barcelona','video production services Barcelona','video production company Barcelona','corporate video Barcelona','corporate videographer Barcelona','corporate video production Spain','commercial filmmaker Spain','brand filmmaker Barcelona','cinematic videographer Barcelona','event videographer Barcelona','product video Barcelona','documentary filmmaker Barcelona','documentary videographer Spain','English speaking filmmaker Barcelona','English speaking video crew Spain','freelance filmmaker Barcelona','freelance videographer Barcelona','diseñador gráfico Barcelona','graphic designer Barcelona','motion graphics Barcelona','color grading Barcelona','videomapping Barcelona','brand identity Barcelona','creative director Barcelona','productora audiovisual Cataluña','trade show videographer Spain','Meta Ads video production','YouTube video production Barcelona','podcast video production Barcelona','Jared Durón',
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
    siteName: 'Jared Durón — Filmmaker Barcelona',
    title: 'Jared Durón — Filmmaker & Graphic Designer Barcelona',
    description: 'Stories that move people. Films that grow brands. Filmmaker y diseñador gráfico basado en Barcelona.',
    images: [
      {
        url: 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/fsyjfym3_Foto%20perfil.jpg',
        width: 1200,
        height: 630,
        alt: 'Jared Durón Filmmaker & Graphic Designer Barcelona',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jared Durón — Filmmaker Barcelona',
    description: 'Stories that move people. Films that grow brands.',
    images: ['https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/fsyjfym3_Foto%20perfil.jpg'],
    creator: '@jared_duron10',
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
  name: 'Jared Durón',
  alternateName: 'Jared Duron',
  jobTitle: 'Filmmaker & Graphic Designer',
  description: 'Filmmaker y Diseñador Gráfico basado en Barcelona con más de 7 años de experiencia en producción audiovisual, video comercial, documental, eventos internacionales y diseño gráfico integral.',
  url: 'https://jaredduron.com',
  image: 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/fsyjfym3_Foto%20perfil.jpg',
  email: 'jaredmisaelduron@gmail.com',
  telephone: '+34-637-434-235',
  sameAs: [
    'https://www.behance.net/jaredduron',
    'https://www.instagram.com/jared_duron10/',
    'https://www.linkedin.com/in/jared-duron-87a041100/',
    'https://www.tiktok.com/@jems2124',
    'https://www.facebook.com/jaredmisael.duron/',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Barcelona',
    addressRegion: 'Cataluña',
    addressCountry: 'ES',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Jared Durón Films',
  },
  knowsAbout: [
    'Cinematography',
    'Filmmaking',
    'Video Production',
    'Graphic Design',
    'Documentary',
    'Commercial Video',
    'Color Grading',
    'Motion Graphics',
    'VideoMapping',
    'Event Videography',
  ],
}

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://jaredduron.com/#business',
  name: 'Jared Durón Films — Filmmaker & Graphic Designer Barcelona',
  image: 'https://customer-assets.emergentagent.com/job_filmmaker-barcelona/artifacts/fsyjfym3_Foto%20perfil.jpg',
  url: 'https://jaredduron.com',
  telephone: '+34-637-434-235',
  email: 'jaredmisaelduron@gmail.com',
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
    'Graphic Design',
    'VideoMapping',
    'Brand Identity',
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
      <body className="antialiased text-neutral-100 font-sans selection:bg-[#F5C518] selection:text-black">
        {children}
      </body>
    </html>
  )
}
