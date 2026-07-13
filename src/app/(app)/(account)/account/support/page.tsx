'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SupportTicket } from '@/payload-types'
import { AlertCircle, CheckCircle2, Clock, Loader2, MessageCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
> = {
  open: { label: 'Open', variant: 'default', icon: <AlertCircle className="h-3 w-3" /> },
  waiting_customer: { label: 'Waiting', variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
  in_progress: { label: 'In Progress', variant: 'default', icon: <Loader2 className="h-3 w-3" /> },
  resolved: { label: 'Resolved', variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
  closed: { label: 'Closed', variant: 'outline', icon: <CheckCircle2 className="h-3 w-3" /> },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'text-muted-foreground' },
  medium: { label: 'Medium', className: 'text-blue-500' },
  high: { label: 'High', className: 'text-orange-500' },
  urgent: { label: 'Urgent', className: 'text-red-500 font-semibold' },
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

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/support/tickets')
      .then((r) => r.json())
      .then((data) => {
        setTickets(data.docs ?? [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load tickets')
        setLoading(false)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your support requests</p>
        </div>
        <Button asChild>
          <Link href="/account/support/new">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Link>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading tickets…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-destructive text-sm">
          {error}
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <MessageCircle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground">No support tickets yet.</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Need help? Open a new ticket and our team will respond shortly.
          </p>
          <Button asChild className="mt-4">
            <Link href="/account/support/new">
              <Plus className="h-4 w-4 mr-2" />
              Open First Ticket
            </Link>
          </Button>
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status] ?? statusConfig.open
            const priority = priorityConfig[ticket.priority] ?? priorityConfig.medium
            return (
              <Link
                key={ticket.id}
                href={`/account/support/${ticket.id}`}
                className="group rounded-2xl border bg-card p-5 hover:border-primary/40 hover:bg-card/80 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{ticket.subject}</span>
                      <Badge variant={status.variant} className="flex items-center gap-1 text-xs shrink-0">
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                      <span className="font-mono">{ticket.ticketNumber}</span>
                      <span>·</span>
                      <span>{categoryLabels[ticket.category] ?? ticket.category}</span>
                      <span>·</span>
                      <span className={priority.className}>Priority: {priority.label}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
