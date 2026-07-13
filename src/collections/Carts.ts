import { findActiveCheckoutSession } from '@/lib/checkoutSessionServer'
import { getAvailableStock } from '@/lib/stock'
import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'

/**
 * Cart collection override dengan validasi stok real-time.
 * Hook beforeChange memastikan item yang ditambahkan/diupdate di cart masih tersedia.
 * Juga mencegah modifikasi cart saat ada checkout session aktif.
 */
export const CartsCollection: CollectionOverride = ({ defaultCollection }) => {
  return {
    ...defaultCollection,
    hooks: {
      ...defaultCollection.hooks,
      beforeChange: [
        ...(defaultCollection.hooks?.beforeChange || []),
        async ({ data, req, operation, originalDoc }) => {
          // Cek apakah user punya active checkout session
          if (req.user?.id) {
            const activeCheckout = await findActiveCheckoutSession(req.payload, req.user.id)
            if (activeCheckout) {
              throw new Error(
                'Tidak dapat mengubah keranjang saat sedang dalam proses checkout. Selesaikan atau batalkan checkout terlebih dahulu.'
              )
            }
          }
          
          const items = data?.items || []
          
          req.payload.logger.info({
            operation,
            itemCount: items.length,
            cartId: data?.id,
          }, '[Cart Hook] beforeChange triggered')
          
          // Validasi setiap item di cart
          for (const item of items) {
            const productId = typeof item.product === 'object' ? item.product?.id : item.product
            const variantId = typeof item.variant === 'object' ? item.variant?.id : item.variant
            const quantity = item.quantity || 0

            if (!productId || quantity <= 0) continue

            // Cari quantity lama dari originalDoc
            let oldQuantity = 0
            if (operation === 'update' && originalDoc?.items) {
              const oldItem = originalDoc.items.find((i: any) => {
                const oldProdId = typeof i.product === 'object' ? i.product?.id : i.product
                const oldVarId = typeof i.variant === 'object' ? i.variant?.id : i.variant
                return oldProdId === productId && oldVarId === variantId
              })
              if (oldItem) {
                oldQuantity = oldItem.quantity || 0
              }
            }

            // Jika user MENGURANGI atau SAMA quantity-nya, izinkan saja
            // Ini penting agar user bisa hapus/kurangi item dari cart saat stok habis
            if (operation === 'update' && quantity <= oldQuantity) {
              continue
            }

            // Cek stok tersedia (accounting for pending reservations)
            const availableStock = await getAvailableStock(
              req.payload,
              productId,
              variantId || null,
            )

            req.payload.logger.info({
              productId,
              variantId,
              quantity,
              availableStock,
            }, '[Cart Hook] Stock validation check')

            if (availableStock < quantity) {
              // Get product name for error message
              let productName = 'Product'
              try {
                const product = await req.payload.findByID({
                  collection: 'products',
                  id: productId,
                  depth: 0,
                  overrideAccess: true,
                })
                productName = (product as any)?.title || productName
              } catch (err) {
                // Ignore error, use default name
              }

              throw new Error(
                `Stok tidak cukup untuk "${productName}". Tersedia: ${availableStock}, diminta: ${quantity}`,
              )
            }
          }

          return data
        },
      ],
    },
  }
}
