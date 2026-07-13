'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Instagram, Linkedin, Palette, Youtube } from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/social-links'
import { trackEvent } from '@/lib/analytics'
import { useConsent } from '@/hooks/use-consent'

const ICONS = {
  instagram: Instagram,
  youtube: Youtube,
  behance: Palette,
  linkedin: Linkedin,
}

let embedSocialPromise

function loadEmbedSocial() {
  if (embedSocialPromise) return embedSocialPromise
  embedSocialPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('EmbedSocialHashtagScript')
    if (existing?.dataset.loaded === 'true') {
      resolve()
      return
    }

    const script = existing || document.createElement('script')
    const onLoad = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    const onError = () => {
      embedSocialPromise = undefined
      reject(new Error('EmbedSocial failed to load'))
    }
    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })

    if (!existing) {
      script.id = 'EmbedSocialHashtagScript'
      script.src = 'https://embedsocial.com/cdn/ht.js'
      script.async = true
      document.head.appendChild(script)
    }
  })
  return embedSocialPromise
}

function SocialWall({ copy }) {
  const widgetId = process.env.NEXT_PUBLIC_EMBEDSOCIAL_WIDGET_ID
  const wallRef = useRef(null)
  const trackedRef = useRef(false)
  const { consent, save } = useConsent()
  const [saveData, setSaveData] = useState(false)
  const [manualRequest, setManualRequest] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    setSaveData(navigator.connection?.saveData === true)
  }, [])

  useEffect(() => {
    if (!widgetId || !wallRef.current || manualRequest || consent?.external !== true || saveData) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setShouldLoad(true)
      observer.disconnect()
    }, { rootMargin: '500px 0px', threshold: 0.01 })
    observer.observe(wallRef.current)
    return () => observer.disconnect()
  }, [consent?.external, manualRequest, saveData, widgetId])

  useEffect(() => {
    if (!widgetId || !shouldLoad) return undefined
    let active = true
    let contentObserver
    let timeoutId
    const markLoaded = () => {
      if (!active) return
      window.clearTimeout(timeoutId)
      contentObserver?.disconnect()
      setStatus('loaded')
      if (!trackedRef.current) {
        trackedRef.current = true
        trackEvent('social_wall_load', { source_count: SOCIAL_LINKS.length })
      }
    }
    setStatus('loading')
    loadEmbedSocial()
      .then(() => {
        if (!active) return
        const host = wallRef.current?.querySelector('.embedsocial-hashtag')
        if (!host) throw new Error('EmbedSocial container is unavailable')
        if (host.childElementCount > 0) {
          markLoaded()
          return
        }
        contentObserver = new MutationObserver(() => {
          if (host.childElementCount > 0) markLoaded()
        })
        contentObserver.observe(host, { childList: true, subtree: true })
        timeoutId = window.setTimeout(() => {
          contentObserver?.disconnect()
          if (active) setStatus('error')
        }, 12000)
      })
      .catch(() => { if (active) setStatus('error') })
    return () => {
      active = false
      window.clearTimeout(timeoutId)
      contentObserver?.disconnect()
    }
  }, [shouldLoad, widgetId])

  if (!widgetId) return null

  const requestManually = () => {
    if (consent?.external !== true) {
      save({ necessary: true, analytics: consent?.analytics === true, external: true })
    }
    setManualRequest(true)
    setShouldLoad(true)
  }

  const manualOnly = !shouldLoad && (consent?.external !== true || saveData)
  return (
    <div ref={wallRef} className="social-wall mt-12">
      {manualOnly ? (
        <button type="button" onClick={requestManually} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#F5C518]/55 px-5 py-3 text-sm font-medium text-[#F5C518] transition-colors hover:bg-[#F5C518]/10">
          {copy.manual}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : (
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-3 md:p-5" aria-live="polite" aria-busy={status === 'loading'}>
          <div className="embedsocial-hashtag min-h-[480px]" data-ref={widgetId} />
          {status === 'loading' && (
            <div className="absolute inset-3 grid animate-pulse grid-cols-1 gap-4 md:inset-5 md:grid-cols-2 lg:grid-cols-3" aria-label={copy.loading}>
              {Array.from({ length: 6 }, (_, index) => <div key={index} className="min-h-48 rounded-xl border border-white/5 bg-white/[0.045]" />)}
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#071126] p-6 text-center text-sm text-white/65">
              <p>{copy.error}</p>
              <button type="button" onClick={() => { setStatus('idle'); setShouldLoad(false); window.setTimeout(() => setShouldLoad(true), 0) }} className="min-h-11 rounded-full border border-[#F5C518]/55 px-5 py-2 text-[#F5C518]">{copy.retry}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SocialSection({ locale, copy }) {
  return (
    <section id="social" aria-labelledby="social-title" className="deferred-section relative border-t border-white/5 px-6 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <header className="max-w-4xl">
          <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">{copy.eyebrow}</div>
          <h2 id="social-title" className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-balance">
            <span className="block text-white">{copy.title}</span>
            <span className="block text-white">{copy.titleLead} <span className="text-[#F5C518]">{copy.highlight}</span></span>
          </h2>
          <p className="mt-7 max-w-[760px] text-base leading-[1.75] text-white/62 md:text-lg">{copy.description}</p>
        </header>

        <nav aria-label={copy.navLabel} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SOCIAL_LINKS.map((social) => {
            const Icon = ICONS[social.icon]
            return (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackEvent('social_click', { network: social.id, location: 'social_section' })}
                className="group flex min-h-56 flex-col rounded-2xl border border-[#F5C518]/20 bg-[#0A1630]/70 p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-[#F5C518]/65 hover:bg-[#0D1D3C] focus-visible:border-[#F5C518] motion-reduce:transform-none"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#F5C518]/30 bg-[#F5C518]/[0.06] text-[#F5C518]">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/35 transition-colors group-hover:text-[#F5C518]" />
                </div>
                <div className="mt-8 text-xl font-semibold">{social.name}</div>
                <div className="mt-1 text-sm text-[#F5C518]">{social.user}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{social.description[locale]}</p>
                <span className="sr-only">{social.ariaLabel[locale]}</span>
              </a>
            )
          })}
        </nav>

        <SocialWall copy={copy.wall} />

        <a
          href={SOCIAL_LINKS[0].url}
          target="_blank"
          rel="me noopener noreferrer"
          onClick={() => trackEvent('social_click', { network: 'instagram', location: 'social_section_cta' })}
          className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium transition-colors hover:border-[#F5C518]/65 hover:text-[#F5C518]"
        >
          {copy.cta}
          <span className="sr-only"> · {SOCIAL_LINKS[0].ariaLabel[locale]}</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
