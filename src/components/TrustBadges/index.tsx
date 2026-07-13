'use client'

import Image from 'next/image'
import React from 'react'

interface TrustBadgesSettings {
  totalUsers?: string
  satisfactionRate?: string
  supportAvailability?: string
  partnerLogos?: Array<{
    logo?: {
      url?: string
      alt?: string
    } | null
    name?: string
  }>
}

interface TrustBadgesProps {
  language?: 'id' | 'en'
  settings?: {
    trustBadges?: TrustBadgesSettings
  }
}

const defaultPartners: TrustBadgesSettings['partnerLogos'] = [
  { name: 'OpenAI', logo: null },
  { name: 'Anthropic', logo: null },
  { name: 'Google AI', logo: null },
  { name: 'Microsoft', logo: null },
]

export const TrustBadges: React.FC<TrustBadgesProps> = ({ 
  language = 'en',
  settings
}) => {
  const isIndonesian = language === 'id'
  const trustBadges = settings?.trustBadges
  
  // Use settings data if available, otherwise use defaults
  const totalUsers = trustBadges?.totalUsers || '10,000+'
  const satisfactionRate = trustBadges?.satisfactionRate || '99%'
  const supportAvailability = trustBadges?.supportAvailability || '24/7'
  
  const partners = trustBadges?.partnerLogos && trustBadges.partnerLogos.length > 0
    ? trustBadges.partnerLogos
    : defaultPartners

  return (
    <section className="border-y border-border bg-background px-4 py-8 md:py-10">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 text-center md:mb-8">
          <h2 className="mb-2 text-lg font-bold text-foreground md:text-2xl">
            {isIndonesian 
              ? `Dipercaya oleh ${totalUsers} Pengguna` 
              : `Trusted by ${totalUsers} Users`}
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            {isIndonesian
              ? 'Bergabung dengan ribuan pengguna yang telah merasakan kemudahan akses AI premium kami.'
              : 'Join thousands of users who have experienced our premium AI access.'}
          </p>
        </div>

        {/* Partner Logos */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 md:mb-10 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex h-10 items-center justify-center opacity-60 transition-transform hover:scale-110 hover:opacity-100 md:h-12"
            >
              {partner.logo && typeof partner.logo === 'object' && partner.logo.url ? (
                <Image
                  src={partner.logo.url}
                  alt={partner.logo.alt || partner.name || 'Partner logo'}
                  width={120}
                  height={48}
                  className="object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="text-base font-semibold text-muted-foreground md:text-lg">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-5 md:mt-10 md:grid-cols-3 md:gap-6">
          <div className="text-center">
            <div className="mb-1 text-xl font-bold text-foreground md:text-3xl">
              {totalUsers}
            </div>
            <div className="text-sm text-muted-foreground">
              {isIndonesian ? 'Pengguna Aktif' : 'Active Users'}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xl font-bold text-foreground md:text-3xl">
              {satisfactionRate}
            </div>
            <div className="text-sm text-muted-foreground">
              {isIndonesian ? 'Kepuasan Pelanggan' : 'Customer Satisfaction'}
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xl font-bold text-foreground md:text-3xl">
              {supportAvailability}
            </div>
            <div className="text-sm text-muted-foreground">
              {isIndonesian ? 'Dukungan Pelanggan' : 'Customer Support'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
