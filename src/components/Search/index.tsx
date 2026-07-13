'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { SearchIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  className?: string
  placeholder?: string
}

export const Search: React.FC<Props> = ({ className, placeholder = 'Search for products...' }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams?.get('q') || '')
  const lastPushedUrlRef = useRef('')

  useEffect(() => {
    setValue(searchParams?.get('q') || '')
  }, [searchParams])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString())
      const trimmedValue = value.trim()

      if (trimmedValue) {
        newParams.set('q', trimmedValue)
      } else {
        newParams.delete('q')
      }

      const nextUrl = createUrl('/shop', newParams)

      if (nextUrl !== lastPushedUrlRef.current) {
        lastPushedUrlRef.current = nextUrl
        router.replace(nextUrl)
      }
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [router, searchParams, value])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams.toString())
    const trimmedValue = value.trim()

    if (trimmedValue) {
      newParams.set('q', trimmedValue)
    } else {
      newParams.delete('q')
    }

    const nextUrl = createUrl('/shop', newParams)
    lastPushedUrlRef.current = nextUrl
    router.replace(nextUrl)
  }

  return (
    <form className={cn('relative w-full', className)} onSubmit={onSubmit}>
      <input
        autoComplete="off"
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-black dark:text-white dark:placeholder:text-neutral-400"
        name="search"
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <SearchIcon className="h-4" />
      </div>
    </form>
  )
}
