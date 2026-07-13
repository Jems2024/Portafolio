'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CONSENT_OPEN_EVENT } from '@/lib/consent'
import { useConsent } from '@/hooks/use-consent'

const COPY = {
  es: {
    title: 'Privacidad y contenido externo',
    body: 'Usamos almacenamiento necesario para recordar tus preferencias. La analítica y el contenido externo solo se cargan si los aceptas.',
    necessary: 'Necesarias',
    necessaryHelp: 'Preferencias básicas del sitio.',
    analytics: 'Analítica',
    analyticsHelp: 'Google Analytics 4, sin datos del formulario.',
    external: 'Contenido externo',
    externalHelp: 'Feed social externo mediante Elfsight.',
    reject: 'Rechazar opcionales',
    save: 'Guardar preferencias',
    accept: 'Aceptar todo',
  },
  en: {
    title: 'Privacy and external content',
    body: 'Necessary storage remembers your preferences. Analytics and external content load only if you accept them.',
    necessary: 'Necessary',
    necessaryHelp: 'Basic site preferences.',
    analytics: 'Analytics',
    analyticsHelp: 'Google Analytics 4, without form data.',
    external: 'External content',
    externalHelp: 'External social feed through Elfsight.',
    reject: 'Reject optional',
    save: 'Save preferences',
    accept: 'Accept all',
  },
  ca: {
    title: 'Privacitat i contingut extern',
    body: 'Fem servir emmagatzematge necessari per recordar les preferències. L’analítica i el contingut extern només es carreguen si els acceptes.',
    necessary: 'Necessàries',
    necessaryHelp: 'Preferències bàsiques del lloc.',
    analytics: 'Analítica',
    analyticsHelp: 'Google Analytics 4, sense dades del formulari.',
    external: 'Contingut extern',
    externalHelp: 'Feed social extern mitjançant Elfsight.',
    reject: 'Rebutjar opcionals',
    save: 'Desar preferències',
    accept: 'Acceptar-ho tot',
  },
}

function GoogleAnalytics({ enabled }) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!enabled || !measurementId) return null

  const safeId = JSON.stringify(measurementId)
  return (
    <>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${safeId},{anonymize_ip:true});`}
      </Script>
    </>
  )
}

export default function ConsentManager() {
  const { consent, ready, save } = useConsent()
  const [locale, setLocale] = useState('es')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ analytics: false, external: false })

  useEffect(() => {
    const updateLocale = (event) => {
      const nextLocale = event?.detail || window.localStorage.getItem('locale') || 'es'
      setLocale(COPY[nextLocale] ? nextLocale : 'es')
    }
    updateLocale()
    window.addEventListener('portfolio:locale-change', updateLocale)
    return () => window.removeEventListener('portfolio:locale-change', updateLocale)
  }, [])

  useEffect(() => {
    if (!ready) return
    setDraft({ analytics: consent?.analytics === true, external: consent?.external === true })
    if (!consent) setOpen(true)
  }, [consent, ready])

  useEffect(() => {
    const showPreferences = () => {
      setDraft({ analytics: consent?.analytics === true, external: consent?.external === true })
      setOpen(true)
    }
    window.addEventListener(CONSENT_OPEN_EVENT, showPreferences)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, showPreferences)
  }, [consent])

  const choose = (value) => {
    save({ necessary: true, ...value })
    setOpen(false)
  }

  const copy = COPY[locale]
  return (
    <>
      <GoogleAnalytics enabled={consent?.analytics === true} />
      {ready && open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="privacy-consent-title"
          className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-3xl rounded-2xl border border-[#F5C518]/35 bg-[#071126]/98 p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-6"
        >
          <div id="privacy-consent-title" className="text-lg font-semibold">{copy.title}</div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/68">{copy.body}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="flex min-h-20 items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm">
              <input type="checkbox" checked disabled className="mt-1 accent-[#F5C518]" />
              <span><span className="block font-medium">{copy.necessary}</span><span className="mt-1 block text-xs leading-relaxed text-white/50">{copy.necessaryHelp}</span></span>
            </label>
            <label className="flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm hover:border-[#F5C518]/45">
              <input type="checkbox" checked={draft.analytics} onChange={(event) => setDraft({ ...draft, analytics: event.target.checked })} className="mt-1 accent-[#F5C518]" />
              <span><span className="block font-medium">{copy.analytics}</span><span className="mt-1 block text-xs leading-relaxed text-white/50">{copy.analyticsHelp}</span></span>
            </label>
            <label className="flex min-h-20 cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm hover:border-[#F5C518]/45">
              <input type="checkbox" checked={draft.external} onChange={(event) => setDraft({ ...draft, external: event.target.checked })} className="mt-1 accent-[#F5C518]" />
              <span><span className="block font-medium">{copy.external}</span><span className="mt-1 block text-xs leading-relaxed text-white/50">{copy.externalHelp}</span></span>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2 text-xs font-medium uppercase tracking-[0.12em]">
            <button type="button" onClick={() => choose({ analytics: false, external: false })} className="min-h-11 rounded-full border border-white/20 px-4 py-2 text-white/70 hover:border-white/55 hover:text-white">{copy.reject}</button>
            <button type="button" onClick={() => choose(draft)} className="min-h-11 rounded-full border border-[#F5C518]/55 px-4 py-2 text-[#F5C518] hover:bg-[#F5C518]/10">{copy.save}</button>
            <button type="button" onClick={() => choose({ analytics: true, external: true })} className="min-h-11 rounded-full bg-[#F5C518] px-4 py-2 text-[#071126] hover:bg-[#ffd94f]">{copy.accept}</button>
          </div>
        </div>
      )}
    </>
  )
}
