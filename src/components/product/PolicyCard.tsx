'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  content: string
  maxLength?: number
}

export function PolicyCard({ title, content, maxLength = 100 }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content) return null

  const shouldTruncate = content.length > maxLength
  const displayContent = isExpanded || !shouldTruncate ? content : `${content.substring(0, maxLength)}...`

  return (
    <div className="rounded-3xl border bg-background p-6">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="mt-2 font-semibold whitespace-pre-wrap">{displayContent}</p>
      {shouldTruncate && (
        <Button
          variant="link"
          className="mt-2 h-auto p-0 text-sm text-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Tutup' : 'Baca selengkapnya'}
        </Button>
      )}
    </div>
  )
}
