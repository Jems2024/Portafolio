'use client'

import Script from 'next/script'
import { ArrowUpRight } from 'lucide-react'
import { useConsent } from '@/hooks/use-consent'
import { trackEvent } from '@/lib/analytics'

const LOAD_COPY = {
  es: 'Ver el feed social',
  en: 'View social feed',
  ca: 'Veure el feed social',
}

const TITLE_COPY = {
  es: { lead: 'Redes', highlight: 'sociales.' },
  en: { lead: 'Social', highlight: 'media.' },
  ca: { lead: 'Xarxes', highlight: 'socials.' },
}

export default function SocialFeed({ locale }) {
  const { consent, save } = useConsent()
  const title = TITLE_COPY[locale] || TITLE_COPY.es

  const enableFeed = () => {
    save({ necessary: true, analytics: consent?.analytics === true, external: true })
    trackEvent('social_feed_consent', { provider: 'elfsight' })
  }

  return (
    <section id="social-feed" aria-labelledby="social-feed-title" className="deferred-section border-y border-white/5 px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1600px]">
        <h2 id="social-feed-title" className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-balance">
          {title.lead} <span className="text-[#F5C518]">{title.highlight}</span>
        </h2>

        <div className="social-feed mt-8 min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#071126]/70 p-2 sm:mt-10 sm:p-4">
          {consent?.external === true ? (
            <>
              <Script
                id="elfsight-platform"
                src="https://elfsightcdn.com/platform.js"
                strategy="lazyOnload"
                async
                onLoad={() => trackEvent('social_feed_load', { provider: 'elfsight' })}
              />
              <div className="elfsight-app-d9e77578-d874-4183-9a5a-ead69cd9c8cf" data-elfsight-app-lazy="" />
            </>
          ) : (
            <div className="flex min-h-[288px] items-center justify-center p-6">
              <button
                type="button"
                onClick={enableFeed}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#F5C518]/55 px-5 py-3 text-sm font-medium text-[#F5C518] transition-colors hover:bg-[#F5C518]/10"
              >
                {LOAD_COPY[locale] || LOAD_COPY.es}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
