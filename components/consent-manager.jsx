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
          className="fixed inset-x-4 bottom-4 z-[120] mx-auto max-w-3xl rounded-none border border-[#415A77]/50 bg-[#1B263B] p-5 text-[#E0E1DD] shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-xl md:p-6"
        >
          <div id="privacy-consent-title" className="text-lg font-semibold tracking-tight">{copy.title}</div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#778DA9]">{copy.body}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <label className="flex min-h-20 items-start gap-3 rounded-none border border-[#415A77]/30 bg-[#0D1B2A]/80 p-3 text-sm">
              <input type="checkbox" checked disabled className="mt-1 accent-[#778DA9]" />
              <span><span className="block font-medium text-[#E0E1DD]">{copy.necessary}</span><span className="mt-1 block text-xs leading-relaxed text-[#778DA9]">{copy.necessaryHelp}</span></span>
            </label>
            <label className="flex min-h-20 cursor-pointer items-start gap-3 rounded-none border border-[#415A77]/30 bg-[#0D1B2A]/80 p-3 text-sm hover:border-[#778DA9]/60">
              <input type="checkbox" checked={draft.analytics} onChange={(event) => setDraft({ ...draft, analytics: event.target.checked })} className="mt-1 accent-[#778DA9]" />
              <span><span className="block font-medium text-[#E0E1DD]">{copy.analytics}</span><span className="mt-1 block text-xs leading-relaxed text-[#778DA9]">{copy.analyticsHelp}</span></span>
            </label>
            <label className="flex min-h-20 cursor-pointer items-start gap-3 rounded-none border border-[#415A77]/30 bg-[#0D1B2A]/80 p-3 text-sm hover:border-[#778DA9]/60">
              <input type="checkbox" checked={draft.external} onChange={(event) => setDraft({ ...draft, external: event.target.checked })} className="mt-1 accent-[#778DA9]" />
              <span><span className="block font-medium text-[#E0E1DD]">{copy.external}</span><span className="mt-1 block text-xs leading-relaxed text-[#778DA9]">{copy.externalHelp}</span></span>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2 text-xs font-medium uppercase tracking-[0.12em]">
            <button type="button" onClick={() => choose({ analytics: false, external: false })} className="min-h-11 rounded-none border border-[#415A77]/40 px-4 py-2 text-[#778DA9] hover:border-[#778DA9] hover:text-[#E0E1DD]">{copy.reject}</button>
            <button type="button" onClick={() => choose(draft)} className="min-h-11 rounded-none border border-[#415A77] px-4 py-2 text-[#E0E1DD] hover:bg-[#415A77]/20">{copy.save}</button>
            <button type="button" onClick={() => choose({ analytics: true, external: true })} className="min-h-11 rounded-none bg-[#E0E1DD] px-4 py-2 text-[#0D1B2A] font-semibold hover:bg-[#778DA9] hover:text-[#0D1B2A]">{copy.accept}</button>
          </div>
        </div>
      )}
    </>
  )
}
