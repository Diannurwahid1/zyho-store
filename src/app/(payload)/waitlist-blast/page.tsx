'use client'

import React from 'react'
import { AdminView } from 'payload'
import { WaitlistBlastButton } from '@/components/WaitlistBlastButton'

const WaitlistBlastPage: React.FC = () => {
  return (
    <AdminView>
      <div className="gutter--left gutter--right">
        <h1>WhatsApp Blast</h1>
        <p>Pilih waitlist untuk mengirim notifikasi WhatsApp:</p>
        <div className="grid">
          <div className="card">
            <h3>Waitlist ID: 2</h3>
            <p>Google AI Pro— Gemini Access 18 Months</p>
            <WaitlistBlastButton waitlistId="2" />
          </div>
        </div>
      </div>
    </AdminView>
  )
}

export default WaitlistBlastPage