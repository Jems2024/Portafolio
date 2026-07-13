'use client'

import { useCallback, useEffect, useState } from 'react'
import { CONSENT_CHANGE_EVENT, CONSENT_STORAGE_KEY, readConsent, writeConsent } from '@/lib/consent'

export function useConsent() {
  const [consent, setConsent] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const update = (event) => {
      setConsent(event?.detail || readConsent())
      setReady(true)
    }
    const onStorage = (event) => {
      if (event.key === CONSENT_STORAGE_KEY) update()
    }

    update()
    window.addEventListener(CONSENT_CHANGE_EVENT, update)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, update)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const save = useCallback((value) => writeConsent(value), [])
  return { consent, ready, save }
}
