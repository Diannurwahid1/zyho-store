'use client'

import { CURRENCY_PREFERENCE_COOKIE } from '@/utilities/pricing'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'

const OPTIONS = [
  { code: 'IDR', label: 'IDR' },
  { code: 'USD', label: 'USD' },
] as const

export function CurrencySwitch() {
  const { currency, setCurrency, supportedCurrencies } = useCurrency()

  if (supportedCurrencies.length < 2) {
    return null
  }

  const applyCurrency = (code: 'IDR' | 'USD') => {
    setCurrency(code)
    window.localStorage.setItem(CURRENCY_PREFERENCE_COOKIE, code)
    document.cookie = `${CURRENCY_PREFERENCE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-background p-1">
      {OPTIONS.map((option) => {
        const active = currency.code === option.code

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => applyCurrency(option.code)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition md:text-sm ${
              active ? 'bg-foreground text-background' : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
