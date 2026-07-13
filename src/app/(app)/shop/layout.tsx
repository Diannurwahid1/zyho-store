import { Categories } from '@/components/layout/search/Categories'
import { FilterList } from '@/components/layout/search/filter'
import { sorting } from '@/lib/constants'
import React, { Suspense } from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <div className="container my-6 flex flex-col gap-5 pb-4 md:my-12 md:gap-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:gap-4">
          <div className="w-full basis-1/5 flex-none flex-col gap-4 md:flex md:gap-8">
            <Categories />
            <FilterList list={sorting} title="Sort by" />
          </div>
          <div className="min-h-screen w-full">{children}</div>
        </div>
      </div>
    </Suspense>
  )
}
