'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDocumentInfo, useField } from '@payloadcms/ui'
import { Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

type ProductOption = {
  id: number
  title: string
}

type BundleItem = {
  discountPercent: number
  productId: number
  quantity: number
}

type BundleValue = {
  enabled?: boolean | null
  items?: BundleItem[] | null
} | null

export const BundleConfigField: React.FC = () => {
  const { id } = useDocumentInfo()
  const { setValue, value } = useField<BundleValue>({ path: 'bundleConfig' })
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [enabled, setEnabled] = useState(Boolean(value?.enabled && value?.items?.length))
  const [items, setItems] = useState<BundleItem[]>(
    Array.isArray(value?.items) ? value.items : [],
  )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=200&depth=0', {
          credentials: 'include',
        })
        const data = await response.json()
        const docs = Array.isArray(data?.docs) ? data.docs : []

        setProducts(
          docs
            .map((doc: any) => ({
              id: Number(doc.id),
              title: String(doc.title || `Product #${doc.id}`),
            }))
            .filter((doc: ProductOption) => Number.isFinite(doc.id) && doc.id > 0),
        )
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  useEffect(() => {
    setEnabled(Boolean(value?.enabled && value?.items?.length))
    setItems(Array.isArray(value?.items) ? value.items : [])
  }, [value])

  useEffect(() => {
    if (!enabled || items.length === 0) {
      setValue(null)
      return
    }

    setValue({
      enabled: true,
      items: items
        .filter((item) => Number.isFinite(item.productId) && item.productId > 0)
        .map((item) => ({
          discountPercent: Math.max(0, Math.min(100, Number(item.discountPercent || 0))),
          productId: Number(item.productId),
          quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
        })),
    })
  }, [enabled, items, setValue])

  const selectableProducts = useMemo(() => {
    const currentId = Number(id)
    return products.filter((product) => !Number.isFinite(currentId) || product.id !== currentId)
  }, [id, products])

  const addRow = () => {
    const firstProduct = selectableProducts[0]
    setEnabled(true)
    setItems((prev) => [
      ...prev,
      {
        discountPercent: 0,
        productId: firstProduct?.id || 0,
        quantity: 1,
      },
    ])
  }

  const updateRow = (index: number, patch: Partial<BundleItem>) => {
    setItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    )
  }

  const removeRow = (index: number) => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '14px',
        padding: '1rem',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <div style={{ marginBottom: '0.85rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Bundle Produk</strong>
        <p style={{ color: 'var(--theme-text-dimmed)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Pilih produk yang digabung, set quantity tiap produk, lalu atur diskon per produk di
          dalam bundle. Harga bundle akan dihitung otomatis dari item-item ini.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: enabled ? '1rem' : 0,
        }}
      >
        <Checkbox
          checked={enabled}
          id="bundle-config-enabled"
          onCheckedChange={(checked) => setEnabled(Boolean(checked))}
        />
        <Label htmlFor="bundle-config-enabled">Aktifkan bundle untuk produk ini</Label>
      </div>

      {enabled ? (
        <div style={{ display: 'grid', gap: '0.9rem' }}>
          {items.map((item, index) => (
            <div
              key={`${index}-${item.productId}`}
              style={{
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: '12px',
                padding: '0.9rem',
                display: 'grid',
                gap: '0.75rem',
                background: 'var(--theme-bg)',
              }}
            >
              <div style={{ display: 'grid', gap: '0.45rem' }}>
                <Label htmlFor={`bundle-product-${index}`}>Produk bundle</Label>
                <select
                  id={`bundle-product-${index}`}
                  value={item.productId || ''}
                  onChange={(e) => updateRow(index, { productId: Number(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    borderRadius: 10,
                    border: '1px solid var(--theme-elevation-150)',
                    background: 'var(--theme-input-bg)',
                    color: 'var(--theme-text)',
                    minHeight: 42,
                    padding: '0 0.8rem',
                  }}
                >
                  <option value="">Pilih produk</option>
                  {selectableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr auto' }}>
                <div>
                  <Label htmlFor={`bundle-qty-${index}`}>Qty di bundle</Label>
                  <Input
                    id={`bundle-qty-${index}`}
                    min={1}
                    onChange={(e) => updateRow(index, { quantity: Number(e.target.value) || 1 })}
                    style={{ marginTop: '0.35rem' }}
                    type="number"
                    value={item.quantity}
                  />
                </div>

                <div>
                  <Label htmlFor={`bundle-discount-${index}`}>Diskon produk (%)</Label>
                  <Input
                    id={`bundle-discount-${index}`}
                    max={100}
                    min={0}
                    onChange={(e) =>
                      updateRow(index, { discountPercent: Number(e.target.value) || 0 })
                    }
                    style={{ marginTop: '0.35rem' }}
                    type="number"
                    value={item.discountPercent}
                  />
                </div>

                <div style={{ alignSelf: 'end' }}>
                  <Button type="button" variant="destructive" onClick={() => removeRow(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button type="button" onClick={addRow} disabled={loading || selectableProducts.length === 0}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk Bundle
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setItems([])
                setEnabled(false)
              }}
            >
              Reset Bundle
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
