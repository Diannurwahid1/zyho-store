'use client'
import { WaitlistBlastButton } from '@/components/WaitlistBlastButton'
import React from 'react'

export const WaitlistBlastField: React.FC<any> = (props) => {
  const waitlistId = props?.id || props?.data?.id
  if (!waitlistId) return null
  return <WaitlistBlastButton waitlistId={waitlistId} />
}
