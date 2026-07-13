'use client'

import { Button } from '@/components/ui/button'
import type { SupportTicket } from '@/payload-types'
import { ChevronRight, ExternalLink, Loader2, MessageCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const statusColors: Record<string, string> = {
  open: 'bg-blue-500',
  waiting_customer: 'bg-yellow-500',
  in_progress: 'bg-purple-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-400',
}

const statusLabels: Record<string, string> = {
  open: 'Open',
  waiting_customer: 'Waiting',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export function SupportBubble() {
  const [open, setOpen] = useState(false)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Check auth & load tickets when opened
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch('/api/support/tickets')
      .then((r) => {
        if (r.status === 401) {
          setLoggedIn(false)
          return null
        }
        setLoggedIn(true)
        return r.json()
      })
      .then((data) => {
        if (data) setTickets(data.docs?.slice(0, 5) ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const activeCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6" ref={panelRef}>
      {/* Panel */}
      {open && (
        <div className="w-80 rounded-2xl border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-primary px-5 py-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">Support</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 hover:bg-primary-foreground/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-1">
              We typically reply within a few hours
            </p>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-3">
            {loading && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading…</span>
              </div>
            )}

            {!loading && loggedIn === false && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Sign in to view or create support tickets
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}

            {!loading && loggedIn && (
              <>
                {/* New ticket CTA */}
                <Link
                  href="/account/support/new"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 hover:border-primary/40 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">New Support Ticket</p>
                    <p className="text-xs text-muted-foreground">Describe your issue</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                {/* Recent tickets */}
                {tickets.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
                      Recent Tickets
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {tickets.map((ticket) => (
                        <Link
                          key={ticket.id}
                          href={`/account/support/${ticket.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/60 transition-colors group"
                        >
                          <span
                            className={`h-2 w-2 rounded-full shrink-0 ${statusColors[ticket.status] ?? 'bg-gray-400'}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground">{statusLabels[ticket.status]}</p>
                          </div>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {tickets.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No tickets yet. Open one above!
                  </p>
                )}

                {/* View all */}
                <Link
                  href="/account/support"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View all tickets
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Support"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        {!open && activeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {activeCount > 9 ? '9+' : activeCount}
          </span>
        )}
      </button>
    </div>
  )
}
