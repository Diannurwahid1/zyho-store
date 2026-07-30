import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface VoucherDiscount {
  couponId: number
  couponCode: string
  discountType: 'percentage' | 'fixed'
  amount: number
  appliesTo: 'all' | 'specific'
}

interface ActiveVouchersResponse {
  global: VoucherDiscount | null // Voucher yang berlaku untuk semua produk
  perProduct: Record<string, VoucherDiscount> // Voucher spesifik per produk
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const now = new Date()

    // Fetch active coupons
    const { docs: coupons } = await payload.find({
      collection: 'coupons',
      where: {
        and: [
          { status: { equals: 'active' } },
          {
            or: [
              { assignedUser: { exists: false } },
              { assignedUser: { equals: null } },
            ],
          },
          {
            or: [
              { startsAt: { less_than_equal: now } },
              { startsAt: { exists: false } },
            ],
          },
          {
            or: [
              { expiresAt: { greater_than_equal: now } },
              { expiresAt: { exists: false } },
            ],
          },
        ],
      },
      depth: 1,
      limit: 100,
    })

    const result: ActiveVouchersResponse = {
      global: null,
      perProduct: {},
    }

    // Process coupons
    for (const coupon of coupons) {
      const voucherInfo: VoucherDiscount = {
        couponId: coupon.id,
        couponCode: coupon.code,
        discountType: coupon.discountType,
        amount: coupon.amount,
        appliesTo: coupon.appliesTo,
      }

      if (coupon.appliesTo === 'all') {
        // Global voucher - berlaku untuk semua produk
        // Jika ada multiple global vouchers, ambil yang diskonnya paling besar
        if (!result.global || getDiscountValue(voucherInfo) > getDiscountValue(result.global)) {
          result.global = voucherInfo
        }
      } else if (coupon.appliesTo === 'specific' && coupon.products && Array.isArray(coupon.products)) {
        // Specific products voucher
        for (const product of coupon.products) {
          const productId = typeof product === 'object' && product !== null ? String(product.id) : String(product)

          // Jika product sudah punya voucher, bandingkan mana yang lebih besar diskonnya
          if (!result.perProduct[productId] || 
              getDiscountValue(voucherInfo) > getDiscountValue(result.perProduct[productId])) {
            result.perProduct[productId] = voucherInfo
          }
        }
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Error fetching active vouchers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active vouchers' },
      { status: 500 }
    )
  }
}

// Helper function to compare discount values
// For percentage: return percentage value
// For fixed: return a high number to prioritize fixed discounts
function getDiscountValue(voucher: VoucherDiscount): number {
  if (voucher.discountType === 'percentage') {
    return voucher.amount
  }
  // For fixed discounts, we can't directly compare with percentage
  // So we give it a high priority value
  return 1000 + voucher.amount
}
