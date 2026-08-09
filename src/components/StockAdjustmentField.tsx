'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    AlertTriangle,
    Box,
    FileText,
    KeyRound,
    Package,
    Plus,
    RefreshCw,
    Search,
} from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Product {
  bundleConfig?: {
    enabled?: boolean | null
    items?: unknown[] | null
  } | null
  digitalFulfillmentMode?: 'standard' | 'per_unit_stock' | null
  id: string
  inventory?: number
  title: string
  variants?: Array<{
    id: string
    inventory?: number
    name: string
  }>
}

interface AdjustmentModal {
  currentStock: number
  digitalFulfillmentMode?: 'standard' | 'per_unit_stock' | null
  isOpen: boolean
  productId: string
  productName: string
  variantId?: string
  variantName?: string
}

type DigitalUnitDraft = {
  accountEmail: string
  accountPassword: string
  accountUsername: string
  content: string
  deliveryType: 'credentials' | 'file' | 'text'
  fileId: string
  label: string
  loginUrl: string
  referenceCode: string
}

const createEmptyUnit = (): DigitalUnitDraft => ({
  accountEmail: '',
  accountPassword: '',
  accountUsername: '',
  content: '',
  deliveryType: 'credentials',
  fileId: '',
  label: '',
  loginUrl: '',
  referenceCode: '',
})

const isBundleProductRow = (product: Product) =>
  Boolean(product.bundleConfig?.enabled && product.bundleConfig.items?.length)

const panelStyle: React.CSSProperties = {
  background:
    'linear-gradient(180deg, color-mix(in srgb, var(--theme-elevation-100) 92%, #111827 8%) 0%, var(--theme-elevation-50) 100%)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '18px',
  boxShadow: '0 18px 48px rgba(0, 0, 0, 0.18)',
}

const badgeStyle = (tone: 'default' | 'success' | 'warning'): React.CSSProperties => ({
  alignItems: 'center',
  background:
    tone === 'success'
      ? 'color-mix(in srgb, var(--theme-success-500) 12%, transparent)'
      : tone === 'warning'
        ? 'color-mix(in srgb, #f59e0b 14%, transparent)'
        : 'var(--theme-elevation-150)',
  border:
    tone === 'success'
      ? '1px solid color-mix(in srgb, var(--theme-success-500) 35%, transparent)'
      : tone === 'warning'
        ? '1px solid color-mix(in srgb, #f59e0b 35%, transparent)'
        : '1px solid var(--theme-elevation-200)',
  borderRadius: '999px',
  color:
    tone === 'success'
      ? 'var(--theme-success-600)'
      : tone === 'warning'
        ? '#f59e0b'
        : 'var(--theme-text-dimmed)',
  display: 'inline-flex',
  fontSize: '0.72rem',
  fontWeight: 700,
  gap: '0.35rem',
  letterSpacing: '0.08em',
  padding: '0.35rem 0.7rem',
  textTransform: 'uppercase',
})

const inputBoxStyle: React.CSSProperties = {
  marginTop: '0.35rem',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid var(--theme-elevation-150)',
  background: 'var(--theme-elevation-0)',
  color: 'var(--theme-text)',
  fontSize: '0.875rem',
  marginTop: '0.35rem',
  outline: 'none',
}

export const StockAdjustmentField: React.FC = () => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [digitalUnits, setDigitalUnits] = useState<DigitalUnitDraft[]>([])
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  const [modal, setModal] = useState<AdjustmentModal>({
    isOpen: false,
    productId: '',
    productName: '',
    currentStock: 0,
  })

  const [adjustmentForm, setAdjustmentForm] = useState({
    costPerUnit: '',
    notes: '',
    quantity: '',
    type: 'adjust' as 'in' | 'adjust',
  })

  useEffect(() => {
    void fetchProducts()
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const hiddenElements = new Map<HTMLElement, string>()
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>('button, a, input[type="submit"]'),
    )

    for (const element of candidates) {
      if (root.contains(element)) continue

      const buttonText =
        element instanceof HTMLInputElement
          ? (element.value || '').trim().toLowerCase()
          : (element.textContent || '').trim().toLowerCase()

      if (buttonText !== 'save') continue

      hiddenElements.set(element, element.style.display)
      element.style.display = 'none'
    }

    return () => {
      for (const [element, previousDisplay] of hiddenElements.entries()) {
        element.style.display = previousDisplay
      }
    }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?limit=1000&_ts=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store',
          Pragma: 'no-cache',
        },
      })
      const data = await response.json()

      if (data.docs) {
        setProducts(data.docs)
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID'))
      }
    } catch (err) {
      toast.error('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openAdjustmentModal = (
    product: Product,
    currentStock: number,
    variantId?: string,
    variantName?: string,
  ) => {
    setModal({
      currentStock,
      digitalFulfillmentMode: product.digitalFulfillmentMode,
      isOpen: true,
      productId: product.id,
      productName: product.title || 'Untitled Product',
      variantId,
      variantName,
    })
    setAdjustmentForm({
      costPerUnit: '',
      notes: '',
      quantity: '',
      type: 'adjust',
    })
    setDigitalUnits([])
  }

  const closeModal = () => {
    setModal({
      isOpen: false,
      productId: '',
      productName: '',
      currentStock: 0,
    })
    setDigitalUnits([])
  }

  const parsedQuantity = Number.parseInt(adjustmentForm.quantity || '0', 10)
  const positiveQuantity =
    Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 0
  const isReduceFlow = Number.isFinite(parsedQuantity) && parsedQuantity < 0
  const isPerUnitMode = modal.digitalFulfillmentMode === 'per_unit_stock'
  const requiresDigitalUnits = isPerUnitMode && positiveQuantity > 0

  useEffect(() => {
    if (!requiresDigitalUnits) {
      if (digitalUnits.length > 0) setDigitalUnits([])
      return
    }

    setDigitalUnits((prev) => {
      if (prev.length === positiveQuantity) return prev
      if (prev.length < positiveQuantity) {
        return [...prev, ...Array.from({ length: positiveQuantity - prev.length }, createEmptyUnit)]
      }
      return prev.slice(0, positiveQuantity)
    })
  }, [digitalUnits.length, positiveQuantity, requiresDigitalUnits])

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [products, searchQuery],
  )

  const perUnitProducts = useMemo(
    () => products.filter((product) => product.digitalFulfillmentMode === 'per_unit_stock').length,
    [products],
  )

  const updateUnit = (
    index: number,
    key: keyof DigitalUnitDraft,
    value: DigitalUnitDraft[keyof DigitalUnitDraft],
  ) => {
    setDigitalUnits((prev) =>
      prev.map((unit, unitIndex) => (unitIndex === index ? { ...unit, [key]: value } : unit)),
    )
  }

  const handleAdjustment = async () => {
    const quantity = Number.parseInt(adjustmentForm.quantity, 10)
    if (Number.isNaN(quantity) || quantity === 0) {
      toast.error('Quantity harus berupa angka dan tidak boleh 0')
      return
    }

    if (requiresDigitalUnits && digitalUnits.length !== quantity) {
      toast.error('Jumlah slot stok digital harus sama dengan quantity')
      return
    }

    setAdjusting(true)

    try {
      const response = await fetch('/api/stock/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costPerUnit: adjustmentForm.costPerUnit
            ? Number(adjustmentForm.costPerUnit)
            : undefined,
          digitalUnits: requiresDigitalUnits
            ? digitalUnits.map((unit) => ({
                accountEmail: unit.accountEmail || undefined,
                accountPassword: unit.accountPassword || undefined,
                accountUsername: unit.accountUsername || undefined,
                content: unit.content || undefined,
                deliveryType: unit.deliveryType,
                fileId: unit.fileId || undefined,
                label: unit.label || undefined,
                loginUrl: unit.loginUrl || undefined,
                referenceCode: unit.referenceCode || undefined,
              }))
            : undefined,
          notes: adjustmentForm.notes || undefined,
          productId: modal.productId,
          quantity,
          type: adjustmentForm.type,
          variantId: modal.variantId || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to adjust stock')
        return
      }

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id !== modal.productId) return product

          if (modal.variantId && Array.isArray(product.variants)) {
            return {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === modal.variantId
                  ? { ...variant, inventory: data.newInventory }
                  : variant,
              ),
            }
          }

          return {
            ...product,
            inventory: data.newInventory,
          }
        }),
      )
      setLastSyncedAt(new Date().toLocaleTimeString('id-ID'))

      toast.success(
        `${modal.productName}${modal.variantName ? ` - ${modal.variantName}` : ''}: ${modal.currentStock} -> ${data.newInventory}`,
      )

      await fetchProducts()
      closeModal()
    } catch (err) {
      toast.error('Failed to adjust stock')
      console.error(err)
    } finally {
      setAdjusting(false)
    }
  }

  if (loading) {
    return (
      <div className="field-type" style={{ padding: '2rem', textAlign: 'center' }}>
        <RefreshCw className="h-8 w-8 animate-spin" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--theme-text-dimmed)' }}>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="field-type" ref={rootRef}>
      <div style={{ ...panelStyle, marginBottom: '1.25rem', padding: '1.25rem' }}>
        <div
          style={{
            background: 'color-mix(in srgb, #f59e0b 10%, transparent)',
            border: '1px solid color-mix(in srgb, #f59e0b 28%, transparent)',
            borderRadius: '16px',
            marginBottom: '1rem',
            padding: '0.9rem 1rem',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: '0.6rem',
              marginBottom: '0.3rem',
            }}
          >
            <AlertTriangle className="h-4 w-4" />
            <strong>Perubahan stok hanya jalan saat klik tombol simpan di modal.</strong>
          </div>
          <p
            style={{
              color: 'var(--theme-text-dimmed)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Klik tombol <strong>Kelola Stok</strong>, isi quantity dan data unit bila perlu, lalu
            simpan dari modal. Tombol `Save` bawaan Payload sengaja disembunyikan di halaman ini
            agar tidak membingungkan.
          </p>
        </div>

        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.9rem',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Digital Stock Control Center</div>
            <p
              style={{
                color: 'var(--theme-text-dimmed)',
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}
            >
              Kelola stok angka dan stok unit digital dari satu tempat yang lebih jelas.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            <div
              style={{ ...badgeStyle('default'), textTransform: 'none', letterSpacing: 'normal' }}
            >
              Total {products.length} produk
            </div>
            <div
              style={{ ...badgeStyle('success'), textTransform: 'none', letterSpacing: 'normal' }}
            >
              {perUnitProducts} produk per-unit
            </div>
            <div
              style={{ ...badgeStyle('warning'), textTransform: 'none', letterSpacing: 'normal' }}
            >
              {products.length - perUnitProducts} produk standard
            </div>
            {lastSyncedAt && (
              <div
                style={{ ...badgeStyle('default'), textTransform: 'none', letterSpacing: 'normal' }}
              >
                Sync {lastSyncedAt}
              </div>
            )}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <Search
            className="h-5 w-5"
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--theme-text-dimmed)',
            }}
          />
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <p
          style={{ fontSize: '0.875rem', color: 'var(--theme-text-dimmed)', marginTop: '0.65rem' }}
        >
          Menampilkan {filteredProducts.length} produk. Badge hijau berarti slot unit digital bisa
          diisi saat restock.
        </p>
      </div>

      <div style={{ ...panelStyle, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--theme-elevation-100)' }}>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Product
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  width: '120px',
                }}
              >
                Current Stock
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  width: '220px',
                }}
              >
                Fulfillment
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  width: '180px',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>
                  <Package className="h-12 w-12" style={{ margin: '0 auto', opacity: 0.3 }} />
                  <p style={{ marginTop: '0.5rem', color: 'var(--theme-text-dimmed)' }}>
                    Tidak ada produk
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  <tr style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 500 }}>{product.title || 'Untitled Product'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-dimmed)' }}>
                        ID: {product.id}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          background:
                            (product.inventory || 0) <= 0
                              ? 'var(--theme-error-50)'
                              : (product.inventory || 0) < 10
                                ? 'var(--theme-warning-50)'
                                : 'var(--theme-success-50)',
                          color:
                            (product.inventory || 0) <= 0
                              ? 'var(--theme-error-500)'
                              : (product.inventory || 0) < 10
                                ? 'var(--theme-warning-600)'
                                : 'var(--theme-success-600)',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        {product.inventory || 0}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <span
                        style={
                          isBundleProductRow(product)
                            ? badgeStyle('default')
                            : product.digitalFulfillmentMode === 'per_unit_stock'
                            ? badgeStyle('success')
                            : badgeStyle('warning')
                        }
                      >
                        {isBundleProductRow(product)
                          ? 'Bundle mengikuti produk'
                          : product.digitalFulfillmentMode === 'per_unit_stock'
                          ? 'Per-unit stock'
                          : 'Standard'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      {isBundleProductRow(product) ? (
                        <span style={{ color: 'var(--theme-text-dimmed)', fontSize: '0.8rem' }}>
                          Kelola stok produk isi bundle
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openAdjustmentModal(product, product.inventory || 0)}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Kelola Stok
                        </Button>
                      )}
                    </td>
                  </tr>

                  {Array.isArray(product.variants) &&
                    product.variants.map((variant) => (
                      <tr
                        key={`${product.id}-${variant.id}`}
                        style={{
                          borderBottom: '1px solid var(--theme-elevation-100)',
                          background: 'var(--theme-elevation-25)',
                        }}
                      >
                        <td style={{ padding: '0.75rem', paddingLeft: '2rem' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                            ↳ {variant.name || 'Untitled Variant'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-dimmed)' }}>
                            Variant ID: {variant.id}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              background:
                                (variant.inventory || 0) <= 0
                                  ? 'var(--theme-error-50)'
                                  : (variant.inventory || 0) < 10
                                    ? 'var(--theme-warning-50)'
                                    : 'var(--theme-success-50)',
                              color:
                                (variant.inventory || 0) <= 0
                                  ? 'var(--theme-error-500)'
                                  : (variant.inventory || 0) < 10
                                    ? 'var(--theme-warning-600)'
                                    : 'var(--theme-success-600)',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                            }}
                          >
                            {variant.inventory || 0}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <span
                            style={
                              product.digitalFulfillmentMode === 'per_unit_stock'
                                ? badgeStyle('success')
                                : badgeStyle('warning')
                            }
                          >
                            {product.digitalFulfillmentMode === 'per_unit_stock'
                              ? 'Per-unit stock'
                              : 'Standard'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              openAdjustmentModal(
                                product,
                                variant.inventory || 0,
                                variant.id,
                                variant.name || 'Untitled Variant',
                              )
                            }
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Kelola Stok
                          </Button>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--theme-elevation-0) 93%, #0b1220 7%) 0%, var(--theme-elevation-50) 100%)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: '24px',
              boxShadow: '0 28px 80px rgba(0, 0, 0, 0.34)',
              maxWidth: '1120px',
              overflow: 'auto',
              padding: '0',
              width: '94%',
              maxHeight: '90vh',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                borderBottom: '1px solid var(--theme-elevation-150)',
                padding: '1.5rem 1.5rem 1.2rem',
              }}
            >
              <div
                style={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    Kelola Stok Produk
                  </h3>
                  <p
                    style={{
                      color: 'var(--theme-text-dimmed)',
                      fontSize: '0.92rem',
                      marginTop: '0.35rem',
                    }}
                  >
                    Isi perubahan stok di sini. Data baru hanya tersimpan saat tombol simpan modal
                    diklik.
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  <span style={isPerUnitMode ? badgeStyle('success') : badgeStyle('warning')}>
                    {isPerUnitMode ? 'Per-unit stock' : 'Standard mode'}
                  </span>
                  <span
                    style={{
                      ...badgeStyle('default'),
                      textTransform: 'none',
                      letterSpacing: 'normal',
                    }}
                  >
                    Stok sekarang {modal.currentStock}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--theme-elevation-100)',
                  border: '1px solid var(--theme-elevation-150)',
                  borderRadius: '18px',
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(220px, 0.9fr)',
                  marginTop: '1.25rem',
                  padding: '1rem 1.1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    {modal.productName}
                  </div>
                  {modal.variantName && (
                    <div style={{ color: 'var(--theme-text-dimmed)', fontSize: '0.88rem' }}>
                      Variant: {modal.variantName}
                    </div>
                  )}
                </div>

                <div style={{ alignContent: 'start', display: 'grid', gap: '0.6rem' }}>
                  <div
                    style={{
                      color: 'var(--theme-text-dimmed)',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Status Mode
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {isPerUnitMode
                      ? 'Restock akan meminta data unit digital per stok.'
                      : 'Produk ini masih pakai stok angka biasa.'}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: '1.25rem',
                gridTemplateColumns: 'minmax(320px, 0.95fr) minmax(0, 1.45fr)',
                padding: '1.5rem',
              }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ ...panelStyle, padding: '1rem' }}>
                    <div
                      style={{
                        color: 'var(--theme-text-dimmed)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Step 1
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>
                      Atur perubahan stok
                    </div>
                    <p
                      style={{
                        color: 'var(--theme-text-dimmed)',
                        fontSize: '0.86rem',
                        lineHeight: 1.6,
                        marginTop: '0.35rem',
                      }}
                    >
                      Quantity positif untuk menambah stok. Quantity negatif untuk mengurangi stok
                      yang masih available.
                    </p>

                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <Label htmlFor="modal-quantity">Quantity *</Label>
                        <Input
                          id="modal-quantity"
                          type="number"
                          value={adjustmentForm.quantity}
                          onChange={(e) =>
                            setAdjustmentForm({ ...adjustmentForm, quantity: e.target.value })
                          }
                          placeholder="Contoh: 5 atau -2"
                          required
                          autoFocus
                          style={{ ...inputBoxStyle, fontSize: '1rem', height: '48px' }}
                        />
                        <p
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--theme-text-dimmed)',
                            marginTop: '0.4rem',
                          }}
                        >
                          {positiveQuantity > 0
                            ? `Anda akan menambah ${positiveQuantity} stok.`
                            : isReduceFlow
                              ? `Anda akan mengurangi ${Math.abs(parsedQuantity)} stok available.`
                              : 'Isi quantity positif jika ingin memunculkan slot unit digital.'}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="modal-type">Type</Label>
                        <select
                          id="modal-type"
                          value={adjustmentForm.type}
                          onChange={(e) =>
                            setAdjustmentForm({
                              ...adjustmentForm,
                              type: e.target.value as 'in' | 'adjust',
                            })
                          }
                          style={selectStyle}
                        >
                          <option value="in">Restock (in)</option>
                          <option value="adjust">Adjustment (adjust)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="modal-cost">Modal / Harga Beli per Unit (Rp)</Label>
                        <Input
                          id="modal-cost"
                          type="number"
                          min="0"
                          value={adjustmentForm.costPerUnit}
                          onChange={(e) =>
                            setAdjustmentForm({ ...adjustmentForm, costPerUnit: e.target.value })
                          }
                          placeholder="Contoh: 50000"
                          style={inputBoxStyle}
                        />
                        <p
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--theme-text-dimmed)',
                            marginTop: '0.4rem',
                          }}
                        >
                          {adjustmentForm.costPerUnit && positiveQuantity > 0
                            ? `Total pengeluaran: Rp ${(Number(adjustmentForm.costPerUnit) * positiveQuantity).toLocaleString('id-ID')}`
                            : 'Opsional. Isi untuk mencatat pengeluaran modal saat restock.'}
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="modal-notes">Notes (optional)</Label>
                        <Textarea
                          id="modal-notes"
                          value={adjustmentForm.notes}
                          onChange={(e) =>
                            setAdjustmentForm({ ...adjustmentForm, notes: e.target.value })
                          }
                          placeholder="Contoh: batch supplier Juli, akun ready login, atau pengurangan karena slot invalid"
                          rows={4}
                          style={inputBoxStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ ...panelStyle, padding: '1rem' }}>
                  <div
                    style={{
                      alignItems: 'flex-start',
                      display: 'flex',
                      gap: '0.9rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        alignItems: 'center',
                        background: 'color-mix(in srgb, var(--theme-success-500) 12%, transparent)',
                        border:
                          '1px solid color-mix(in srgb, var(--theme-success-500) 28%, transparent)',
                        borderRadius: '14px',
                        display: 'flex',
                        height: '44px',
                        justifyContent: 'center',
                        minWidth: '44px',
                      }}
                    >
                      <Box className="h-5 w-5" />
                    </div>

                    <div>
                      <div
                        style={{
                          color: 'var(--theme-text-dimmed)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Step 2
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>
                        Unit digital per stok
                      </div>
                      <p
                        style={{
                          color: 'var(--theme-text-dimmed)',
                          fontSize: '0.86rem',
                          lineHeight: 1.6,
                          marginTop: '0.35rem',
                        }}
                      >
                        Sistem akan menjelaskan kenapa slot muncul atau belum muncul. Jadi tidak ada
                        lagi state kosong yang membingungkan.
                      </p>
                    </div>
                  </div>

                  {!isPerUnitMode && (
                    <div
                      style={{
                        background: 'color-mix(in srgb, #f59e0b 10%, transparent)',
                        border: '1px solid color-mix(in srgb, #f59e0b 30%, transparent)',
                        borderRadius: '18px',
                        padding: '1rem',
                      }}
                    >
                      <div
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          gap: '0.65rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <strong>
                          Slot unit belum tampil karena produk ini masih mode standard.
                        </strong>
                      </div>
                      <p
                        style={{
                          color: 'var(--theme-text-dimmed)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        Jika Anda ingin isi email, password, file, atau catatan per stok, ubah dulu
                        produk ini ke mode <strong>Per-unit digital stock</strong>.
                      </p>
                      <a
                        href={`/mlebu/collections/products/${modal.productId}`}
                        style={{
                          color: '#f59e0b',
                          display: 'inline-block',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          marginTop: '0.75rem',
                          textDecoration: 'none',
                        }}
                      >
                        Buka halaman produk untuk aktifkan mode ini
                      </a>
                    </div>
                  )}

                  {isPerUnitMode && positiveQuantity === 0 && !isReduceFlow && (
                    <div
                      style={{
                        background: 'var(--theme-elevation-100)',
                        border: '1px dashed var(--theme-elevation-200)',
                        borderRadius: '18px',
                        padding: '1.15rem',
                      }}
                    >
                      <strong>Isi quantity positif dulu.</strong>
                      <p
                        style={{
                          color: 'var(--theme-text-dimmed)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          margin: '0.45rem 0 0',
                        }}
                      >
                        Contoh: jika quantity `3`, sistem akan membuka 3 slot unit digital untuk
                        diisi.
                      </p>
                    </div>
                  )}

                  {isPerUnitMode && isReduceFlow && (
                    <div
                      style={{
                        background: 'var(--theme-elevation-100)',
                        border: '1px dashed var(--theme-elevation-200)',
                        borderRadius: '18px',
                        padding: '1.15rem',
                      }}
                    >
                      <strong>Mode pengurangan stok tidak memerlukan input unit.</strong>
                      <p
                        style={{
                          color: 'var(--theme-text-dimmed)',
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          margin: '0.45rem 0 0',
                        }}
                      >
                        Sistem hanya akan mengarsipkan unit yang masih available, jadi data unit
                        yang sudah terjual tetap aman.
                      </p>
                    </div>
                  )}

                  {requiresDigitalUnits && (
                    <>
                      <div
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.6rem',
                          marginBottom: '0.9rem',
                        }}
                      >
                        <span
                          style={{
                            ...badgeStyle('success'),
                            textTransform: 'none',
                            letterSpacing: 'normal',
                          }}
                        >
                          {digitalUnits.length} slot siap diisi
                        </span>
                        <span
                          style={{
                            ...badgeStyle('default'),
                            textTransform: 'none',
                            letterSpacing: 'normal',
                          }}
                        >
                          1 slot = 1 stok
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gap: '1rem',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        }}
                      >
                        {digitalUnits.map((unit, index) => (
                          <div
                            key={`digital-unit-${index}`}
                            style={{
                              background:
                                'linear-gradient(180deg, var(--theme-elevation-0) 0%, var(--theme-elevation-50) 100%)',
                              border: '1px solid var(--theme-elevation-150)',
                              borderRadius: '20px',
                              padding: '1rem',
                            }}
                          >
                            <div
                              style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.9rem',
                              }}
                            >
                              <div>
                                <div style={{ fontSize: '0.96rem', fontWeight: 700 }}>
                                  Slot {index + 1}
                                </div>
                                <div
                                  style={{
                                    color: 'var(--theme-text-dimmed)',
                                    fontSize: '0.78rem',
                                    marginTop: '0.15rem',
                                  }}
                                >
                                  Satu data digital untuk satu stok
                                </div>
                              </div>
                              <span style={{ ...badgeStyle('default'), fontSize: '0.68rem' }}>
                                #{index + 1}
                              </span>
                            </div>

                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                              <div>
                                <Label htmlFor={`unit-label-${index}`}>Label</Label>
                                <Input
                                  id={`unit-label-${index}`}
                                  value={unit.label}
                                  onChange={(e) => updateUnit(index, 'label', e.target.value)}
                                  placeholder="Akun 1 / PDF Batch A / Slot 3"
                                  style={inputBoxStyle}
                                />
                              </div>

                              <div>
                                <Label htmlFor={`unit-delivery-type-${index}`}>Jenis data</Label>
                                <select
                                  id={`unit-delivery-type-${index}`}
                                  value={unit.deliveryType}
                                  onChange={(e) =>
                                    updateUnit(
                                      index,
                                      'deliveryType',
                                      e.target.value as DigitalUnitDraft['deliveryType'],
                                    )
                                  }
                                  style={selectStyle}
                                >
                                  <option value="credentials">Credentials</option>
                                  <option value="file">File</option>
                                  <option value="text">Text / Note</option>
                                </select>
                              </div>

                              {unit.deliveryType === 'credentials' && (
                                <>
                                  <div
                                    style={{
                                      alignItems: 'center',
                                      color: 'var(--theme-text-dimmed)',
                                      display: 'flex',
                                      fontSize: '0.78rem',
                                      gap: '0.45rem',
                                      marginTop: '-0.1rem',
                                    }}
                                  >
                                    <KeyRound className="h-4 w-4" />
                                    Email, username, password, dan URL login
                                  </div>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gap: '0.75rem',
                                      gridTemplateColumns: '1fr 1fr',
                                    }}
                                  >
                                    <div>
                                      <Label htmlFor={`unit-email-${index}`}>Email</Label>
                                      <Input
                                        id={`unit-email-${index}`}
                                        value={unit.accountEmail}
                                        onChange={(e) =>
                                          updateUnit(index, 'accountEmail', e.target.value)
                                        }
                                        placeholder="email@domain.com"
                                        style={inputBoxStyle}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`unit-username-${index}`}>Username</Label>
                                      <Input
                                        id={`unit-username-${index}`}
                                        value={unit.accountUsername}
                                        onChange={(e) =>
                                          updateUnit(index, 'accountUsername', e.target.value)
                                        }
                                        placeholder="username"
                                        style={inputBoxStyle}
                                      />
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: 'grid',
                                      gap: '0.75rem',
                                      gridTemplateColumns: '1fr 1fr',
                                    }}
                                  >
                                    <div>
                                      <Label htmlFor={`unit-password-${index}`}>Password</Label>
                                      <Input
                                        id={`unit-password-${index}`}
                                        value={unit.accountPassword}
                                        onChange={(e) =>
                                          updateUnit(index, 'accountPassword', e.target.value)
                                        }
                                        placeholder="password / access key"
                                        style={inputBoxStyle}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`unit-login-url-${index}`}>Login URL</Label>
                                      <Input
                                        id={`unit-login-url-${index}`}
                                        value={unit.loginUrl}
                                        onChange={(e) =>
                                          updateUnit(index, 'loginUrl', e.target.value)
                                        }
                                        placeholder="https://..."
                                        style={inputBoxStyle}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}

                              {unit.deliveryType === 'file' && (
                                <>
                                  <div
                                    style={{
                                      alignItems: 'center',
                                      color: 'var(--theme-text-dimmed)',
                                      display: 'flex',
                                      fontSize: '0.78rem',
                                      gap: '0.45rem',
                                      marginTop: '-0.1rem',
                                    }}
                                  >
                                    <FileText className="h-4 w-4" />
                                    Masukkan file spesifik per stok dari collection Media
                                  </div>
                                  <div>
                                    <Label htmlFor={`unit-file-id-${index}`}>Media File ID</Label>
                                    <Input
                                      id={`unit-file-id-${index}`}
                                      value={unit.fileId}
                                      onChange={(e) => updateUnit(index, 'fileId', e.target.value)}
                                      placeholder="Masukkan ID file dari collection Media"
                                      style={inputBoxStyle}
                                    />
                                  </div>
                                </>
                              )}

                              {unit.deliveryType === 'text' && (
                                <div
                                  style={{
                                    alignItems: 'center',
                                    color: 'var(--theme-text-dimmed)',
                                    display: 'flex',
                                    fontSize: '0.78rem',
                                    gap: '0.45rem',
                                    marginTop: '-0.1rem',
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                  Kirim catatan akses atau instruksi sebagai teks
                                </div>
                              )}

                              <div>
                                <Label htmlFor={`unit-reference-${index}`}>Reference Code</Label>
                                <Input
                                  id={`unit-reference-${index}`}
                                  value={unit.referenceCode}
                                  onChange={(e) =>
                                    updateUnit(index, 'referenceCode', e.target.value)
                                  }
                                  placeholder="Kode internal / catatan singkat"
                                  style={inputBoxStyle}
                                />
                              </div>

                              <div>
                                <Label htmlFor={`unit-content-${index}`}>
                                  {unit.deliveryType === 'text'
                                    ? 'Delivery Note'
                                    : 'Catatan tambahan'}
                                </Label>
                                <Textarea
                                  id={`unit-content-${index}`}
                                  value={unit.content}
                                  onChange={(e) => updateUnit(index, 'content', e.target.value)}
                                  placeholder="Instruksi aktivasi, backup code, lisensi, dll"
                                  rows={4}
                                  style={inputBoxStyle}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

            <div
              style={{
                borderTop: '1px solid var(--theme-elevation-150)',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem 1.5rem',
              }}
            >
              <Button type="button" variant="outline" onClick={closeModal} style={{ flex: 1 }}>
                Tutup
              </Button>
              <Button
                type="button"
                disabled={adjusting}
                onClick={() => void handleAdjustment()}
                style={{ flex: 1 }}
              >
                {adjusting ? 'Menyimpan...' : 'Simpan Perubahan Stok'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div style={{ ...panelStyle, marginTop: '1.5rem', padding: '1rem 1.1rem' }}>
        <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
          <strong>Tips:</strong> Jika Anda tidak melihat slot unit digital, biasanya ada 2 penyebab:
          produk masih mode <strong>Standard</strong>, atau quantity belum diisi positif. Keduanya
          sekarang dijelaskan langsung di modal.
        </p>
      </div>
    </div>
  )
}
