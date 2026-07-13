'use client'

import type { MemberTier } from '@/lib/member'

import { MEMBER_TIER_ORDER } from '@/lib/member'
import { Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type TierCard = {
  accent: string
  benefitTitle: string
  benefits: string[]
  memberSince: string
  minSpent: number
  progressToNextTier: number
  spentLabel: string
  statusLabel: string
  tier: MemberTier
  tierLabel: string
}

type Props = {
  cards: TierCard[]
  currentTier: MemberTier
  currentTierLabel: string
  memberName: string
  memberSinceLabel: string
  nextTierLabel?: string | null
  remainingToNextTierLabel: string
  totalSpentLabel: string
}

const tierBackgrounds: Record<MemberTier, string> = {
  bronze: '/media/bronze-tier-zyho.webp',
  silver: '/media/silver-tier-zyho.webp',
  gold: '/media/gold-tier-zyho.webp',
  diamond: '/media/diamond-tier-zyho.webp',
}

const tierBadgeStyles: Record<MemberTier, string> = {
  bronze: 'border-[#c98b62]/40 bg-[#c98b62]/15 text-[#f7b58a]',
  silver: 'border-slate-200/30 bg-slate-200/12 text-slate-100',
  gold: 'border-[#f0c24c]/40 bg-[#f0c24c]/15 text-[#f9dd7d]',
  diamond: 'border-cyan-100/35 bg-cyan-100/12 text-cyan-50',
}

export const MemberTierShowcase: React.FC<Props> = ({
  cards,
  currentTier,
  memberName,
  memberSinceLabel,
  nextTierLabel,
  remainingToNextTierLabel,
  totalSpentLabel,
}) => {
  const currentTierIndex = MEMBER_TIER_ORDER.indexOf(currentTier)
  const heroCarouselRef = useRef<HTMLDivElement | null>(null)
  const defaultIndex = Math.max(MEMBER_TIER_ORDER.indexOf(currentTier), 0)
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const activeCard = cards[activeIndex] || cards[defaultIndex] || cards[0]
  const activeIsUnlocked = MEMBER_TIER_ORDER.indexOf(activeCard.tier) <= currentTierIndex

  useEffect(() => {
    const node = heroCarouselRef.current
    if (!node) return

    const updateActiveIndex = () => {
      const firstCard = node.firstElementChild as HTMLElement | null
      const cardWidth = firstCard?.offsetWidth || 1
      const gap = 12
      const nextIndex = Math.round(node.scrollLeft / Math.max(cardWidth + gap, 1))
      setActiveIndex(Math.max(0, Math.min(nextIndex, cards.length - 1)))
    }

    const firstCard = node.firstElementChild as HTMLElement | null
    if (firstCard) {
      node.scrollTo({
        left: (firstCard.offsetWidth + 12) * defaultIndex,
        behavior: 'auto',
      })
    }

    updateActiveIndex()
    node.addEventListener('scroll', updateActiveIndex, { passive: true })

    return () => node.removeEventListener('scroll', updateActiveIndex)
  }, [cards.length, defaultIndex])

  return (
    <section className="mx-auto flex min-w-0 w-full max-w-full flex-col gap-3 overflow-x-hidden">
      <div
        ref={heroCarouselRef}
        className="flex min-w-0 w-full snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
      >
        {cards.map((card) => {
          const isCurrent = card.tier === currentTier
          const isUnlocked = MEMBER_TIER_ORDER.indexOf(card.tier) <= currentTierIndex

          return (
            <article
              key={card.tier}
              className="relative min-h-[224px] min-w-0 w-full shrink-0 snap-start overflow-hidden rounded-[1.7rem] border border-[#d79f74]/30 bg-black shadow-[0_22px_70px_rgba(15,23,42,0.32)] lg:min-h-[320px] lg:rounded-[2rem]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(10,10,14,0.08), rgba(10,10,14,0.82)), url(${tierBackgrounds[card.tier]})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.84)_100%)]" />
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 bg-black/24" />
              )}

              <div className="relative flex h-full min-w-0 flex-col justify-between px-3.5 py-4 text-white sm:px-4 lg:px-7 lg:py-6">
                <div className="max-w-[72%] space-y-2 sm:max-w-[64%] lg:max-w-[52%]">
                  <div className="inline-flex rounded-full border border-white/12 bg-black/25 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/72 backdrop-blur sm:text-[10px] lg:px-3 lg:text-[11px]">
                    {isCurrent ? 'Current tier' : isUnlocked ? 'Unlocked tier' : 'Locked tier'}
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-[1.7rem] font-semibold leading-none tracking-tight sm:text-[1.95rem] lg:text-[3rem]">
                      {card.tierLabel}
                    </h1>
                    <p className="text-[12px] text-white/72 sm:text-[13px] lg:text-base">
                      Welcome back, <span className="font-semibold text-white">{memberName}</span>
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[10px] text-white/74 backdrop-blur sm:text-[11px] lg:px-3">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>Member since {memberSinceLabel}</span>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3 border-t border-white/10 pt-3.5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:pt-5">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">Total transaksi</p>
                    <p className="text-[1.55rem] font-semibold leading-none sm:text-[1.8rem] lg:text-[2.5rem]">
                      {totalSpentLabel}
                    </p>
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="flex min-w-0 flex-col gap-1.5 text-[11px] sm:text-[12px] lg:flex-row lg:items-center lg:justify-between lg:text-sm">
                      <span className="min-w-0 text-white/72">
                        {card.tier === currentTier
                          ? nextTierLabel
                            ? `${remainingToNextTierLabel} ke ${nextTierLabel}`
                            : 'Semua tier terbuka'
                          : isUnlocked
                            ? 'Tier ini sudah terbuka'
                            : `Buka tier ini di ${card.spentLabel}`}
                      </span>
                      <span className="block min-w-0 text-left font-medium text-white/92 lg:text-right">{card.statusLabel}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/12">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: card.accent,
                          width: `${card.progressToNextTier}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {cards.map((card, index) => (
          <span
            key={`${card.tier}-hero-dot`}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/26'
            }`}
          />
        ))}
      </div>

      <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-white/8 bg-[#111214] p-3.5 shadow-[0_16px_50px_rgba(15,23,42,0.18)] lg:p-5">
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Your {activeCard.tierLabel.replace(' Member', '')} Benefits
          </h2>
          <p className="text-xs text-white/48 sm:text-sm">
            Benefit akan ikut berubah sesuai card tier yang sedang aktif di atas.
          </p>
        </div>

        <div className="space-y-2.5">
          {activeCard.benefits.map((benefit, index) => (
            <article
              key={benefit}
              className={`flex min-w-0 flex-col gap-2 rounded-2xl border px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 ${
                activeIsUnlocked
                  ? 'border-white/8 bg-white/[0.04]'
                  : 'border-white/8 bg-white/[0.03]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="min-w-0 text-sm font-medium text-white">
                    {index === 0
                      ? 'Earn member value'
                      : index === 1
                        ? 'Priority service'
                        : 'Exclusive member access'}
                  </p>
                  {!activeIsUnlocked && (
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${tierBadgeStyles[activeCard.tier]}`}>
                      Read only
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-white/58">{benefit}</p>
              </div>

              <span className="pt-0.5 text-left text-[11px] font-semibold text-white/66 sm:text-right">
                {activeIsUnlocked
                  ? index === 0
                    ? 'Active'
                    : index === 1
                      ? 'Priority'
                      : 'Member'
                  : 'Locked'}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
