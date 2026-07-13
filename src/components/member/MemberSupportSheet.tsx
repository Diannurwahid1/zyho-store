'use client'

import type { SupportMessage, SupportTicket, User } from '@/payload-types'

import { MemberAvatar } from '@/components/member/MemberAvatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Loader2, MessageSquarePlus, MessagesSquare, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
  user: Pick<User, 'avatar' | 'email' | 'googleAvatarURL' | 'name'>
}

const categories = [
  { value: 'payment_issue', label: 'Payment Issue' },
  { value: 'download_problem', label: 'Download Problem' },
  { value: 'license_key_problem', label: 'License Key Problem' },
  { value: 'product_access_problem', label: 'Product Access Problem' },
  { value: 'refund_request', label: 'Refund Request' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'general_question', label: 'General Question' },
]

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const statusLabels: Record<string, string> = {
  closed: 'Closed',
  in_progress: 'In Progress',
  open: 'Open',
  resolved: 'Resolved',
  waiting_customer: 'Waiting',
}

const statusTone: Record<string, string> = {
  closed: 'border-white/10 bg-white/6 text-white/60',
  in_progress: 'border-blue-400/20 bg-blue-400/10 text-blue-100',
  open: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  resolved: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  waiting_customer: 'border-violet-400/20 bg-violet-400/10 text-violet-100',
}

type TicketDetail = {
  messages: SupportMessage[]
  ticket: SupportTicket
}

export const MemberSupportSheet: React.FC<Props> = ({ onOpenChange, open, user }) => {
  const [mode, setMode] = useState<'list' | 'new'>('list')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [error, setError] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailData, setDetailData] = useState<TicketDetail | null>(null)
  const [detailReply, setDetailReply] = useState('')
  const [detailSending, setDetailSending] = useState(false)
  const [form, setForm] = useState({
    category: 'general_question',
    message: '',
    priority: 'medium',
    subject: '',
  })
  const detailBottomRef = useRef<HTMLDivElement | null>(null)

  const activeCount = useMemo(
    () => tickets.filter((ticket) => !['closed', 'resolved'].includes(ticket.status)).length,
    [tickets],
  )

  useEffect(() => {
    if (!open) return

    setLoading(true)
    setError(null)

    fetch('/api/support/tickets')
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => null)
          throw new Error(data?.error || 'Gagal memuat tiket support.')
        }

        return response.json()
      })
      .then((data) => setTickets(data.docs ?? []))
      .catch((fetchError: Error) => setError(fetchError.message))
      .finally(() => setLoading(false))
  }, [open])

  useEffect(() => {
    detailBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [detailData?.messages])

  const openTicketDetail = async (ticketId: number) => {
    setDetailOpen(true)
    setDetailLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`)

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal memuat detail tiket.')
      }

      const data = (await response.json()) as TicketDetail
      setDetailData(data)
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : 'Gagal memuat detail tiket.')
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSendReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!detailData || !detailReply.trim()) return

    setDetailSending(true)
    setError(null)

    try {
      const response = await fetch(`/api/support/tickets/${detailData.ticket.id}`, {
        body: JSON.stringify({
          message: detailReply.trim(),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal mengirim balasan.')
      }

      const refreshed = await fetch(`/api/support/tickets/${detailData.ticket.id}`)
      const refreshedData = (await refreshed.json()) as TicketDetail
      setDetailData(refreshedData)
      setDetailReply('')
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : 'Gagal mengirim balasan.')
    } finally {
      setDetailSending(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.subject.trim() || !form.message.trim()) {
      setError('Subject dan pesan wajib diisi.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/support/tickets', {
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Gagal membuat tiket.')
      }

      const ticket = (await response.json()) as SupportTicket
      setTickets((current) => [ticket, ...current])
      setForm({
        category: 'general_question',
        message: '',
        priority: 'medium',
        subject: '',
      })
      setMode('list')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal membuat tiket.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        side="bottom"
        className="max-h-[88vh] overflow-hidden rounded-t-[2rem] border-white/10 bg-[#0f1013] px-0 text-white"
      >
        <SheetHeader className="border-b border-white/8 px-5 pb-4 pt-5">
          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/15" />
          <div className="flex items-center gap-3">
            <MemberAvatar user={user} name={user.name || user.email} sizeClassName="h-11 w-11" />
            <div className="min-w-0">
              <SheetTitle className="text-left text-base text-white">Support Center</SheetTitle>
              <SheetDescription className="truncate text-left text-white/58">
                {user.name || user.email}
              </SheetDescription>
            </div>
            <div className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/72">
              {activeCount} aktif
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                mode === 'list' ? 'bg-white text-black' : 'bg-white/6 text-white/70'
              }`}
              onClick={() => setMode('list')}
              type="button"
            >
              <MessagesSquare className="h-4 w-4" />
              List tiket
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                mode === 'new' ? 'bg-white text-black' : 'bg-white/6 text-white/70'
              }`}
              onClick={() => setMode('new')}
              type="button"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Buat tiket
            </button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto px-5 pb-6">
          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {mode === 'list' ? (
            <div className="space-y-3 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-sm text-white/58">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat tiket...
                </div>
              ) : tickets.length ? (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    className="block w-full rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4 text-left transition hover:border-white/16 hover:bg-white/[0.06]"
                    onClick={() => openTicketDetail(ticket.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{ticket.subject}</p>
                        <p className="mt-1 text-xs text-white/42">{ticket.ticketNumber}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/68">
                        {statusLabels[ticket.status] || ticket.status}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center">
                  <p className="text-sm text-white/76">Belum ada tiket support.</p>
                  <p className="mt-1 text-xs text-white/42">Buat tiket baru dari tab sebelah.</p>
                </div>
              )}
            </div>
          ) : (
            <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
              <div className="grid gap-1.5">
                <label className="text-sm text-white/72" htmlFor="support-subject">
                  Subject
                </label>
                <input
                  id="support-subject"
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/24"
                  placeholder="Masalah apa yang sedang terjadi?"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <label className="text-sm text-white/72" htmlFor="support-category">
                    Kategori
                  </label>
                  <select
                    id="support-category"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/24"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <label className="text-sm text-white/72" htmlFor="support-priority">
                    Prioritas
                  </label>
                  <select
                    id="support-priority"
                    value={form.priority}
                    onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/24"
                  >
                    {priorities.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm text-white/72" htmlFor="support-message">
                  Pesan
                </label>
                <textarea
                  id="support-message"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/24"
                  placeholder="Jelaskan detail masalahnya di sini."
                  required
                />
              </div>

              <Button className="w-full rounded-2xl" disabled={submitting} type="submit">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim tiket...
                  </>
                ) : (
                  'Kirim tiket baru'
                )}
              </Button>
            </form>
          )}
        </div>
      </SheetContent>

      <Sheet onOpenChange={setDetailOpen} open={detailOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[92vh] overflow-hidden rounded-t-[2rem] border-white/10 bg-[#0c0d10] px-0 text-white"
        >
          <SheetHeader className="border-b border-white/8 px-5 pb-4 pt-5">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/15" />
            <div className="flex items-start gap-3">
              <button
                className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/74"
                onClick={() => setDetailOpen(false)}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <SheetTitle className="truncate text-left text-base text-white">
                  {detailData?.ticket.subject || 'Detail tiket'}
                </SheetTitle>
                <SheetDescription className="text-left text-white/48">
                  {detailData?.ticket.ticketNumber || 'Memuat percakapan support'}
                </SheetDescription>
              </div>
              {detailData ? (
                <span
                  className={`ml-auto rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${statusTone[detailData.ticket.status] || statusTone.open}`}
                >
                  {statusLabels[detailData.ticket.status] || detailData.ticket.status}
                </span>
              ) : null}
            </div>
          </SheetHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-white/58">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memuat detail tiket...
            </div>
          ) : detailData ? (
            <div className="flex h-full max-h-[calc(92vh-110px)] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {detailData.messages.map((message) => {
                  const isCustomer = message.senderRole === 'customer'
                  const senderName =
                    typeof message.sender === 'object'
                      ? (message.sender.name || message.sender.email || (isCustomer ? 'You' : 'Support'))
                      : isCustomer
                        ? 'You'
                        : 'Support'

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-1 ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isCustomer
                            ? 'rounded-br-sm bg-white text-slate-950'
                            : 'rounded-bl-sm bg-white/[0.06] text-white'
                        }`}
                      >
                        {message.message}
                      </div>
                      <div className="flex items-center gap-2 px-1 text-[11px] text-white/38">
                        <span>{isCustomer ? 'You' : senderName}</span>
                        <span>
                          {new Date(message.createdAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div ref={detailBottomRef} />
              </div>

              {!['closed', 'resolved'].includes(detailData.ticket.status) ? (
                <form className="border-t border-white/8 px-5 pb-5 pt-4" onSubmit={handleSendReply}>
                  <div className="flex items-end gap-2">
                    <textarea
                      className="min-h-[44px] flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/24"
                      onChange={(event) => setDetailReply(event.target.value)}
                      placeholder="Balas tiket ini..."
                      value={detailReply}
                    />
                    <Button className="h-11 w-11 rounded-2xl p-0" disabled={detailSending || !detailReply.trim()} type="submit">
                      {detailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="border-t border-white/8 px-5 py-4 text-center text-sm text-white/44">
                  Tiket ini sudah {statusLabels[detailData.ticket.status]?.toLowerCase() || detailData.ticket.status}.
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-sm text-white/58">
              Detail tiket tidak tersedia.
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Sheet>
  )
}
