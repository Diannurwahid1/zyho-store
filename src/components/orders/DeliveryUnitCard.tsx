'use client'

import type { Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

type DeliveryUnit = {
  unitCode?: string | null
  deliveryType?: string | null
  label?: string | null
  accountEmail?: string | null
  accountUsername?: string | null
  accountPassword?: string | null
  loginUrl?: string | null
  referenceCode?: string | null
  content?: string | null
  file?: Media | null
}

const buildCopyPayload = (unit: DeliveryUnit) => {
  const rows: string[] = []

  if (unit.deliveryType) rows.push(`Type: ${unit.deliveryType}`)
  if (unit.unitCode) rows.push(`Unit Code: ${unit.unitCode}`)
  if (unit.label) rows.push(`Label: ${unit.label}`)
  if (unit.accountEmail) rows.push(`Email: ${unit.accountEmail}`)
  if (unit.accountUsername) rows.push(`Username: ${unit.accountUsername}`)
  if (unit.accountPassword) rows.push(`Password: ${unit.accountPassword}`)
  if (unit.loginUrl) rows.push(`Login URL: ${unit.loginUrl}`)
  if (unit.referenceCode) rows.push(`Reference: ${unit.referenceCode}`)
  if (unit.content) rows.push(`Content: ${unit.content}`)
  if (unit.file?.filename) rows.push(`File Name: ${unit.file.filename}`)
  if (unit.file?.url) rows.push(`File URL: ${unit.file.url}`)

  return rows.join('\n')
}

const InfoRow = ({ label, value, isLink = false }: { label: string; value: string; isLink?: boolean }) => {
  return (
    <div className="grid gap-1 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-3">
      <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm font-medium text-blue-700 underline underline-offset-4 hover:text-blue-600"
        >
          {value}
        </a>
      ) : (
        <span className="break-words text-sm font-medium leading-6 text-foreground">{value}</span>
      )}
    </div>
  )
}

export function DeliveryUnitCard({ unit }: { unit: DeliveryUnit }) {
  const [copied, setCopied] = useState(false)
  const file = unit.file && typeof unit.file === 'object' ? (unit.file as Media) : null
  const copyPayload = useMemo(() => buildCopyPayload({ ...unit, file }), [file, unit])

  const handleCopy = async () => {
    if (!copyPayload) {
      toast.error('Tidak ada data untuk disalin.')
      return
    }

    try {
      await navigator.clipboard.writeText(copyPayload)
      setCopied(true)
      toast.success('Data delivery berhasil disalin.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error(error)
      toast.error('Gagal menyalin data delivery.')
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 sm:p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
            {unit.deliveryType || 'credentials'}
          </span>
          {unit.unitCode ? (
            <span className="break-all font-mono text-[11px] text-muted-foreground">{unit.unitCode}</span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => void handleCopy()}
        >
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 bg-background/80 p-3">
        {unit.label ? <InfoRow label="Label" value={unit.label} /> : null}
        {unit.accountEmail ? <InfoRow label="Email" value={unit.accountEmail} /> : null}
        {unit.accountUsername ? <InfoRow label="Username" value={unit.accountUsername} /> : null}
        {unit.accountPassword ? <InfoRow label="Password" value={unit.accountPassword} /> : null}
        {unit.loginUrl ? <InfoRow label="Login URL" value={unit.loginUrl} isLink /> : null}
        {unit.referenceCode ? <InfoRow label="Reference" value={unit.referenceCode} /> : null}
        {unit.content ? <InfoRow label="Content" value={unit.content} /> : null}
        {file?.url ? <InfoRow label="File URL" value={file.url} isLink /> : null}
        {file?.filename ? <InfoRow label="File Name" value={file.filename} /> : null}

        {file?.url ? (
          <div className="pt-1">
            <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
              <Link href={file.url} target="_blank" rel="noreferrer">
                Download File
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
