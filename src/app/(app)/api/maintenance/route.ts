import { NextResponse } from 'next/server'
import { isMaintenanceModeEnabled } from '@/lib/maintenance'

export async function GET() {
  return NextResponse.json({
    maintenance: isMaintenanceModeEnabled(),
  })
}
