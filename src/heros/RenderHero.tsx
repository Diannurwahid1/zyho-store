import React from 'react'

import type { Page } from '@/payload-types'

import { FlashSaleHero } from '@/heros/FlashSale'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  flashSale: FlashSaleHero,
}

type RenderHeroProps = Page['hero'] & {
  language?: 'id' | 'en'
  productCount?: number
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type, language, productCount, ...heroProps } = props

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type as keyof typeof heroes]

  if (!HeroToRender) return null

  // Pass all props including language and productCount for components that support it
  return <HeroToRender {...props} />
}
