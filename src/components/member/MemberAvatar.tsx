'use client'

import type { User } from '@/payload-types'

type Props = {
  className?: string
  fallbackLabel?: string
  name?: null | string
  sizeClassName?: string
  user?: null | Pick<User, 'avatar' | 'googleAvatarURL' | 'name'>
}

const buildAvatarURL = (user?: null | Pick<User, 'avatar' | 'googleAvatarURL'>) => {
  if (user?.googleAvatarURL) {
    return user.googleAvatarURL
  }

  if (user?.avatar && typeof user.avatar === 'object' && 'url' in user.avatar && user.avatar.url) {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}${user.avatar.url}`
  }

  return null
}

const getInitials = (value?: null | string) => {
  if (!value) return 'MB'

  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase()
}

export const MemberAvatar: React.FC<Props> = ({
  className = '',
  fallbackLabel,
  name,
  sizeClassName = 'h-11 w-11',
  user,
}) => {
  const imageURL = buildAvatarURL(user)
  const initials = getInitials(name || user?.name || fallbackLabel)

  if (imageURL) {
    return (
      <div className={`${sizeClassName} overflow-hidden rounded-full border border-white/12 bg-white/10 ${className}`}>
        <div
          aria-label={name || user?.name || 'Member avatar'}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${imageURL})` }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClassName} flex items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] text-sm font-semibold text-white ${className}`}
    >
      {initials}
    </div>
  )
}
