import type { Metadata } from 'next'

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { MemberTierShowcase } from '@/components/member/MemberTierShowcase'
import { Button } from '@/components/ui/button'
import {
  MEMBER_TIER_ORDER,
  buildMemberSnapshot,
  formatIDR,
  getMemberTierConfig,
} from '@/lib/member'
import { getEligibleVouchers } from '@/lib/vouchers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(201,139,98,0.24),rgba(15,23,42,0.94)_42%,rgba(2,6,23,1)_100%)] p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.35)]">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Member access
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Masuk dulu untuk buka halaman Member.</h1>
            <p className="max-w-xl text-sm text-white/72 md:text-base">
              Login dengan Google akan langsung membuat akun member baru dan otomatis mulai dari tier Bronze.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GoogleSignInButton className="border-white/10 bg-white text-slate-950 hover:bg-white/90" redirect="/account" />
            <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Link href="/login?redirect=%2Faccount">Login dengan email</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const member = buildMemberSnapshot(user)
  const vouchers = await getEligibleVouchers({
    payload,
    user: {
      id: user.id,
      memberTier: user.memberTier,
      totalSpentIDR: user.totalSpentIDR,
    },
  })
  const currentTierIndex = MEMBER_TIER_ORDER.indexOf(member.tier)
  const tierCards = MEMBER_TIER_ORDER.map((tier, index) => {
    const config = getMemberTierConfig(tier)
    const isCurrent = tier === member.tier
    const isUnlocked = index <= currentTierIndex
    const progressToNextTier = isCurrent
      ? member.nextTier
        ? Math.min(
            (member.totalSpentIDR / getMemberTierConfig(member.nextTier).minSpent) * 100,
            100,
          )
        : 100
      : isUnlocked
        ? 100
        : Math.min((member.totalSpentIDR / config.minSpent) * 100, 100)

    return {
      accent: config.accent,
      benefitTitle: config.benefitTitle,
      benefits: config.benefits,
      memberSince: new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(member.memberSince)),
      minSpent: config.minSpent,
      progressToNextTier: Number(progressToNextTier.toFixed(0)),
      spentLabel: formatIDR(config.minSpent),
      statusLabel: isCurrent
        ? member.nextTier
          ? `${formatIDR(member.totalSpentIDR)} / ${formatIDR(getMemberTierConfig(member.nextTier).minSpent)}`
          : 'Tier tertinggi sudah terbuka'
        : isUnlocked
          ? 'Benefit tier ini sudah aktif'
          : `Butuh total transaksi ${formatIDR(config.minSpent)}`,
      tier,
      tierLabel: config.label,
    }
  })
  const memberSinceLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(member.memberSince))

  return (
    <div className="min-w-0 w-full space-y-8">
      <MemberTierShowcase
        cards={tierCards}
        currentTier={member.tier}
        currentTierLabel={member.tierLabel}
        memberName={user.name || user.email}
        memberSinceLabel={memberSinceLabel}
        nextTierLabel={member.nextTier ? getMemberTierConfig(member.nextTier).label : null}
        remainingToNextTierLabel={formatIDR(member.spentToNextTier)}
        totalSpentLabel={formatIDR(member.totalSpentIDR)}
      />

      <section className="min-w-0 rounded-[2rem] border bg-card/70 p-5 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Promo member tersedia</h2>
            <p className="mt-1 text-sm text-muted-foreground">Voucher yang masih aktif untuk tier akun Anda langsung muncul di sini.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/checkout">Gunakan di checkout</Link>
          </Button>
        </div>

        {vouchers.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed p-6 text-sm text-muted-foreground">
            Belum ada voucher aktif untuk tier Anda saat ini.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {vouchers.map((voucher) => (
              <article key={voucher.id} className="rounded-[1.5rem] border bg-background p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Voucher</p>
                    <h3 className="mt-2 text-xl font-semibold">{voucher.code}</h3>
                  </div>
                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {voucher.discountLabel}
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{voucher.benefitSummary}</p>
                <div className="mt-5 space-y-2 text-sm">
                  <p>Min. belanja: <span className="font-medium">{formatIDR(voucher.minimumSpend)}</span></p>
                  <p>Limit per akun: <span className="font-medium">{voucher.perUserLimit}x</span></p>
                  <p>Tier: <span className="font-medium uppercase">{voucher.allowedTiers.length ? voucher.allowedTiers.join(', ') : 'semua member'}</span></p>
                  <p>
                    Berlaku sampai:{' '}
                    <span className="font-medium">
                      {voucher.expiresAt
                        ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(voucher.expiresAt))
                        : 'tanpa batas'}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Member area untuk melihat tier, benefit, dan voucher yang tersedia.',
  openGraph: mergeOpenGraph({
    title: 'Member',
    url: '/account',
  }),
  title: 'Member',
}
