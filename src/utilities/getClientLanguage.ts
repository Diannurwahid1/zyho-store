import { headers } from 'next/headers'

/**
 * Detect user language based on IP geolocation
 * Returns 'id' for Indonesian IPs, 'en' for others
 */
export async function getClientLanguage(): Promise<'id' | 'en'> {
  try {
    const headersList = await headers()

    const host = headersList.get('host') || ''
    if (
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.includes('0.0.0.0')
    ) {
      return 'id'
    }
    
    // Check for Cloudflare country header
    const cfCountry = headersList.get('cf-ipcountry')
    if (cfCountry === 'ID') {
      return 'id'
    }

    // Check for Vercel geolocation
    const vercelCountry = headersList.get('x-vercel-ip-country')
    if (vercelCountry === 'ID') {
      return 'id'
    }

    // Check for standard geolocation headers
    const country = headersList.get('x-country-code') || 
                   headersList.get('x-geo-country') ||
                   headersList.get('cloudfront-viewer-country')
    
    if (country === 'ID') {
      return 'id'
    }

    // Check Accept-Language header as fallback
    const acceptLanguage = headersList.get('accept-language')
    if (acceptLanguage?.includes('id')) {
      return 'id'
    }

    // Default to Indonesian storefront
    return 'id'
  } catch (error) {
    console.error('Error detecting language:', error)
    return 'id'
  }
}
