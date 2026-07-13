export const CONSENT_STORAGE_KEY = 'jared-privacy-consent-v1'
export const CONSENT_CHANGE_EVENT = 'portfolio:consent-change'
export const CONSENT_OPEN_EVENT = 'portfolio:consent-open'

function normalizeConsent(value) {
  if (!value || typeof value !== 'object') return null
  return {
    necessary: true,
    analytics: value.analytics === true,
    external: value.external === true,
  }
}

export function readConsent() {
  if (typeof window === 'undefined') return null
  try {
    return normalizeConsent(JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY)))
  } catch {
    return null
  }
}

export function writeConsent(value) {
  if (typeof window === 'undefined') return null
  const normalized = normalizeConsent(value) || { necessary: true, analytics: false, external: false }
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalized))
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: normalized }))
  return normalized
}

export function openConsentPreferences() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))
}
