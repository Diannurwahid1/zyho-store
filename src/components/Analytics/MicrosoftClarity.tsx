'use client'

import Clarity from '@microsoft/clarity'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const projectID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
const enabledInDevelopment = process.env.NEXT_PUBLIC_CLARITY_ENABLE_IN_DEV === 'true'
const requireConsent = process.env.NEXT_PUBLIC_CLARITY_REQUIRE_CONSENT === 'true'
const consentStorageKey = 'clarity-consent'
const consentEventName = 'clarity-consent-change'

type ClarityConsentState = 'denied' | 'granted'

const shouldInitializeClarity = () =>
  Boolean(projectID) && (process.env.NODE_ENV === 'production' || enabledInDevelopment)

const applyConsent = (state: ClarityConsentState) => {
  Clarity.consentV2({
    ad_Storage: 'denied',
    analytics_Storage: state === 'granted' ? 'granted' : 'denied',
  })
}

export const setMicrosoftClarityConsent = (state: ClarityConsentState) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(consentStorageKey, state)
  window.dispatchEvent(new CustomEvent<ClarityConsentState>(consentEventName, { detail: state }))
}

export const MicrosoftClarity = () => {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    if (!shouldInitializeClarity() || !projectID || initialized.current) return

    Clarity.init(projectID)
    initialized.current = true

    if (requireConsent) {
      const storedConsent = window.localStorage.getItem(consentStorageKey)
      applyConsent(storedConsent === 'granted' ? 'granted' : 'denied')
    }

    Clarity.setTag('site', 'citracommerce')
    Clarity.setTag('runtime', process.env.NODE_ENV)
  }, [])

  useEffect(() => {
    if (!shouldInitializeClarity() || !initialized.current || !pathname) return

    Clarity.setTag('page_path', pathname)
    Clarity.event('page_view')
  }, [pathname])

  useEffect(() => {
    if (!requireConsent || !shouldInitializeClarity()) return

    const handleConsentChange = (event: Event) => {
      const detail = (event as CustomEvent<ClarityConsentState>).detail
      applyConsent(detail === 'granted' ? 'granted' : 'denied')
    }

    window.addEventListener(consentEventName, handleConsentChange)

    return () => {
      window.removeEventListener(consentEventName, handleConsentChange)
    }
  }, [])

  return null
}
