'use client'

import React from 'react'
import { WaitlistBlastButton } from '@/components/WaitlistBlastButton'

const WaitlistBlastPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>WhatsApp Blast</h1>
      <p>Pilih waitlist untuk mengirim notifikasi WhatsApp:</p>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Waitlist ID: 2</h3>
        <p>Google AI Pro— Gemini Access 18 Months</p>
        <WaitlistBlastButton waitlistId="2" />
      </div>
    </div>
  )
}

export default WaitlistBlastPage