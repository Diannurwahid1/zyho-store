import configPromise from '@payload-config'
import { getPayload } from 'payload'
import clsx from 'clsx'
import React, { Suspense } from 'react'

import { CategoryItem } from './Categories.client'

async function CategoryList() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    sort: 'title',
  })

  return (
    <div className="w-full">
      <h3 className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Category</h3>

      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-1 md:gap-2 md:overflow-visible md:px-0">
        <li className="shrink-0 md:shrink">
          <CategoryItem
            category={{
              id: 'all',
              title: 'All',
            } as any}
          />
        </li>
        {categories.docs.map((category) => {
          return (
            <li className="shrink-0 md:shrink" key={category.id}>
              <CategoryItem category={category} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded'
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300'
const items = 'bg-neutral-400 dark:bg-neutral-700'

export function Categories() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-1">
          <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Category</div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-1 md:gap-2 md:overflow-visible md:px-0">
            <div className={clsx(skeleton, activeAndTitles, 'h-11 w-32 rounded-full md:w-full')} />
            <div className={clsx(skeleton, items, 'h-11 w-32 rounded-full md:w-full')} />
            <div className={clsx(skeleton, items, 'h-11 w-32 rounded-full md:w-full')} />
            <div className={clsx(skeleton, items, 'h-11 w-32 rounded-full md:w-full')} />
          </div>
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  )
}
