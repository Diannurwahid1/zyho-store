'use client'
import { WaitlistBlastButton } from '@/components/WaitlistBlastButton'

export default function WaitlistBlastField(props: any) {
  const waitlistId = props?.id || props?.data?.id
  if (!waitlistId) return null
  return <WaitlistBlastButton waitlistId={waitlistId} />
}
