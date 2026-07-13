'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import React from 'react'

export const ChatButtonCell: React.FC<{ rowData: any }> = ({ rowData }) => {
  const { config } = useConfig()
  const adminRoute = config?.routes?.admin || '/admin'
  
  if (!rowData?.id) return null

  return (
    <Link 
      href={`${adminRoute}/collections/support-tickets/${rowData.id}/chat`}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        backgroundColor: 'var(--theme-success-400)',
        color: 'white',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 500,
      }}
    >
      View Chat
    </Link>
  )
}
