'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Media, SupportMessage, SupportTicket, User } from '@/payload-types'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, Paperclip, Send, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useRef, useState } from 'react'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  open: { label: 'Open', variant: 'default', icon: <AlertCircle className="h-3 w-3" /> },
  waiting_customer: { label: 'Waiting for you', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: 'In Progress', variant: 'default', icon: <Loader2 className="h-3 w-3" /> },
  resolved: { label: 'Resolved', variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
  closed: { label: 'Closed', variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
}

const categoryLabels: Record<string, string> = {
  payment_issue: 'Payment Issue',
  download_problem: 'Download Problem',
  license_key_problem: 'License Key',
  product_access_problem: 'Product Access',
  refund_request: 'Refund Request',
  technical_support: 'Technical Support',
  general_question: 'General Question',
}

type TicketDetail = {
  ticket: SupportTicket
  messages: SupportMessage[]
}

type AttachmentPreview = {
  file: File
  previewUrl: string
  mediaId?: number
  uploading: boolean
  error?: string
}

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [reply, setReply] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${id}`)
      if (!res.ok) throw new Error('Failed to load ticket')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data?.messages])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported image type.`)
        continue
      }
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" exceeds the 2 MB limit.`)
        continue
      }

      const previewUrl = URL.createObjectURL(file)
      const entry: AttachmentPreview = { file, previewUrl, uploading: true }
      setAttachments((prev) => [...prev, entry])

      // Upload immediately
      const form = new FormData()
      form.append('file', file)
      try {
        const res = await fetch('/api/support/upload', { method: 'POST', body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        setAttachments((prev) =>
          prev.map((a) => (a.previewUrl === previewUrl ? { ...a, uploading: false, mediaId: data.id } : a)),
        )
      } catch (err: unknown) {
        setAttachments((prev) =>
          prev.map((a) =>
            a.previewUrl === previewUrl
              ? { ...a, uploading: false, error: err instanceof Error ? err.message : 'Upload failed' }
              : a,
          ),
        )
      }
    }
  }

  const removeAttachment = (previewUrl: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.previewUrl === previewUrl)
      if (removed) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((a) => a.previewUrl !== previewUrl)
    })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const hasText = reply.trim().length > 0
    const hasAttachments = attachments.some((a) => a.mediaId)
    if ((!hasText && !hasAttachments) || sending) return

    const stillUploading = attachments.some((a) => a.uploading)
    if (stillUploading) {
      setError('Please wait for all uploads to finish.')
      return
    }

    setSending(true)
    setError(null)
    try {
      const attachmentIds = attachments.filter((a) => a.mediaId).map((a) => a.mediaId!)
      const res = await fetch(`/api/support/tickets/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply.trim() || '(attachment)', attachmentIds }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setReply('')
      attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl))
      setAttachments([])
      await fetchData()
    } catch {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const isClosed = data?.ticket.status === 'closed' || data?.ticket.status === 'resolved'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading ticket…
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive text-sm">
        {error}
      </div>
    )
  }

  if (!data) return null

  const { ticket, messages } = data
  const status = statusConfig[ticket.status] ?? statusConfig.open

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0 mt-1">
          <Link href="/account/support">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold truncate">{ticket.subject}</h1>
            <Badge variant={status.variant} className="flex items-center gap-1 text-xs shrink-0">
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span className="font-mono">{ticket.ticketNumber}</span>
            <span>·</span>
            <span>{categoryLabels[ticket.category] ?? ticket.category}</span>
            <span>·</span>
            <span>
              Opened{' '}
              {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="rounded-2xl border bg-card overflow-hidden flex flex-col">
        <div className="flex flex-col gap-4 p-5 min-h-64 max-h-[60vh] overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No messages yet.</p>
          )}
          {messages.map((msg) => {
            const isCustomer = msg.senderRole === 'customer'
            const senderName =
              typeof msg.sender === 'object'
                ? ((msg.sender as User).name ?? (msg.sender as User).email ?? 'You')
                : 'You'
            const msgAttachments = (msg.attachments ?? []) as { file: number | Media; id?: string | null }[]
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isCustomer ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    isCustomer
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.message !== '(attachment)' && <p>{msg.message}</p>}
                  {msgAttachments.length > 0 && (
                    <div className={`flex flex-wrap gap-2 ${msg.message !== '(attachment)' ? 'mt-2' : ''}`}>
                      {msgAttachments.map((att, i) => {
                        const mediaObj = typeof att.file === 'object' ? (att.file as Media) : null
                        if (!mediaObj?.url) return null
                        return (
                          <a
                            key={i}
                            href={mediaObj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg overflow-hidden border border-white/20 hover:opacity-90 transition-opacity"
                          >
                            <Image
                              src={mediaObj.url}
                              alt={mediaObj.alt ?? 'attachment'}
                              width={200}
                              height={150}
                              className="object-cover max-h-40 w-auto"
                            />
                          </a>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                  <span>{isCustomer ? 'You' : `Support · ${senderName}`}</span>
                  <span>·</span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply box */}
        {isClosed ? (
          <div className="border-t px-5 py-4 text-sm text-muted-foreground text-center bg-muted/30">
            This ticket is {ticket.status}. You can open a new ticket if you need further help.
          </div>
        ) : (
          <form onSubmit={handleSend} className="border-t flex flex-col">
            {/* Attachment previews */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pt-3">
                {attachments.map((att) => (
                  <div key={att.previewUrl} className="relative group">
                    <Image
                      src={att.previewUrl}
                      alt="attachment preview"
                      width={72}
                      height={72}
                      className={`h-18 w-18 rounded-lg object-cover border ${att.error ? 'border-destructive opacity-60' : 'border-border'}`}
                    />
                    {att.uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      </div>
                    )}
                    {att.error && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-destructive/60">
                        <span className="text-[9px] text-white text-center px-1 leading-tight">{att.error}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.previewUrl)}
                      className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="px-4 pt-2 text-xs text-destructive">{error}</p>
            )}

            {/* Input row */}
            <div className="flex gap-2 items-end p-3">
              {/* Attach button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10 text-muted-foreground hover:text-primary"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image (max 2 MB)"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e as unknown as React.FormEvent)
                  }
                }}
                placeholder="Type your reply… (Enter to send, Shift+Enter for new line)"
                className="flex-1 min-h-[40px] max-h-40 rounded-xl border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={1}
              />

              <Button
                type="submit"
                size="icon"
                disabled={sending || (attachments.some((a) => a.uploading)) || (!reply.trim() && !attachments.some((a) => a.mediaId))}
                className="shrink-0 h-10 w-10"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <p className="px-4 pb-2 text-[10px] text-muted-foreground/60">
              Attach images up to 2 MB · JPEG, PNG, GIF, WEBP
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
