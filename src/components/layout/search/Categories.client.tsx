'use client'
import React, { useCallback, useMemo } from 'react'

import { Category } from '@/payload-types'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import clsx from 'clsx'

type Props = {
  category: Category
}

export const CategoryItem: React.FC<Props> = ({ category }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAllCategory = String(category.id) === 'all'

  const isActive = useMemo(() => {
    if (isAllCategory) return !searchParams.get('category')
    return searchParams.get('category') === String(category.id)
  }, [category.id, isAllCategory, searchParams])

  const setQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (isAllCategory || isActive) {
      params.delete('category')
    } else {
      params.set('category', String(category.id))
    }

    const newParams = params.toString()

    router.push(pathname + '?' + newParams)
  }, [category.id, isActive, isAllCategory, pathname, router, searchParams])

  return (
    <button
      onClick={() => setQuery()}
      className={clsx(
        'flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-left text-sm whitespace-nowrap transition-colors hover:cursor-pointer md:w-full md:rounded-2xl',
        isActive
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-card text-foreground hover:border-foreground/30',
      )}
    >
      <span
        className={clsx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
          isActive
            ? 'bg-background/15 text-background'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {isAllCategory ? 'A' : category.title.slice(0, 1).toUpperCase()}
      </span>
      <span className="truncate">{category.title}</span>
    </button>
  )
}
