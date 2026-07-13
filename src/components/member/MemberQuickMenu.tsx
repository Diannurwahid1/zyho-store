'use client'

import type { User } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { MemberAvatar } from '@/components/member/MemberAvatar'
import { MemberSupportSheet } from '@/components/member/MemberSupportSheet'
import { LifeBuoy, LogOut, Menu, Settings } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Props = {
  user: Pick<User, 'avatar' | 'email' | 'googleAvatarURL' | 'name'>
}

export const MemberQuickMenu: React.FC<Props> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      <div className="relative" ref={rootRef}>
        <button
          aria-expanded={menuOpen}
          aria-label="Open member menu"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white transition hover:border-white/18 hover:bg-white/[0.08] md:h-10 md:w-10 md:rounded-xl"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[280px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,19,24,0.98),rgba(12,13,16,0.98))] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl data-[state=open]:animate-in md:w-[320px] md:rounded-[1.75rem]">
            <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
            <div className="pointer-events-none absolute right-4 top-0 h-16 w-16 rounded-full bg-[#c98b62]/12 blur-2xl" />
            <div className="mb-2 px-2 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/34">Quick access</p>
            </div>

            <div className="relative flex items-center gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.045] px-3.5 py-3.5 md:px-4">
              <MemberAvatar user={user} name={user.name || user.email} sizeClassName="h-11 w-11 md:h-12 md:w-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white md:text-[15px]">{user.name || 'Member'}</p>
                <p className="truncate text-xs text-white/42">{user.email}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/28">Akun aktif</p>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-1.5">
              <Link
                href="/account/settings"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-3 rounded-[1.1rem] border border-transparent bg-white/[0.02] px-3.5 py-3 text-sm text-white/82 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.05] text-white/74 transition group-hover:border-white/14 group-hover:bg-white/[0.08] group-hover:text-white">
                  <Settings className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Settings account</p>
                  <p className="text-xs text-white/36">Profil, Google bind, nomor HP</p>
                </div>
              </Link>

              <button
                className="group flex items-center gap-3 rounded-[1.1rem] border border-transparent bg-white/[0.02] px-3.5 py-3 text-left text-sm text-white/82 transition hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                onClick={() => {
                  setMenuOpen(false)
                  setSupportOpen(true)
                }}
                type="button"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.05] text-white/74 transition group-hover:border-white/14 group-hover:bg-white/[0.08] group-hover:text-white">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">Support</p>
                  <p className="text-xs text-white/36">Lihat tiket dan buat permintaan baru</p>
                </div>
              </button>

              <div className="mt-1 border-t border-white/6 px-1 pt-3">
                <Button
                  asChild
                  className="h-11 w-full justify-start rounded-[1rem] bg-white/[0.06] px-3 text-white hover:bg-white/[0.1]"
                  variant="ghost"
                >
                  <Link href="/logout" onClick={() => setMenuOpen(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <MemberSupportSheet onOpenChange={setSupportOpen} open={supportOpen} user={user} />
    </>
  )
}
