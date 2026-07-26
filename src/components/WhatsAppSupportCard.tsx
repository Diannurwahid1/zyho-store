import Link from 'next/link'

import { cn } from '@/utilities/cn'

const WHATSAPP_ADMIN_URL = 'https://wa.me/62895110050207'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3.25a8.75 8.75 0 0 0-7.58 13.12L3.25 20.75l4.5-1.13A8.75 8.75 0 1 0 12 3.25Z"
      fill="currentColor"
      opacity="0.18"
    />
    <path
      d="M12 4.5a7.5 7.5 0 0 0-6.51 11.22l.2.34-.72 2.9 2.98-.75.32.19A7.5 7.5 0 1 0 12 4.5Zm4.17 10.2c-.18.5-.98.93-1.38.99-.35.06-.8.09-1.3-.06-.3-.09-.69-.22-1.18-.43-2.08-.9-3.44-3.01-3.55-3.15-.1-.14-.85-1.12-.85-2.14 0-1.02.54-1.52.73-1.73.19-.2.41-.26.55-.26.14 0 .28 0 .4.01.13.01.29-.05.45.34.17.4.58 1.39.63 1.49.05.1.08.23.02.37-.06.14-.09.23-.18.35-.09.11-.19.26-.27.35-.09.1-.19.2-.08.4.1.2.47.78 1.01 1.27.69.61 1.27.8 1.45.9.18.09.29.08.4-.05.11-.13.46-.54.58-.73.12-.19.25-.16.41-.1.17.05 1.06.5 1.25.59.18.09.3.13.35.2.05.07.05.39-.13.88Z"
      fill="currentColor"
    />
  </svg>
)

type Props = {
  className?: string
  compact?: boolean
  description?: string
  href?: string
  title?: string
}

export function WhatsAppSupportCard({
  className,
  compact = false,
  description = 'Butuh bantuan cepat soal order, login, atau produk digital? Admin siap bantu via WhatsApp.',
  href = WHATSAPP_ADMIN_URL,
  title = 'Hubungi Admin Fast Response',
}: Props) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06))] text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-2xl',
        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(37,211,102,0.2),transparent_42%)] before:content-[""]',
        'after:absolute after:-right-12 after:top-[-20%] after:h-40 after:w-40 after:rounded-full after:bg-[radial-gradient(circle,rgba(255,255,255,0.16),transparent_68%)] after:content-[""]',
        compact ? 'p-4' : 'p-5 md:p-6',
        className,
      )}
    >
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-[#25D366]/15 text-[#25D366] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <WhatsAppIcon className="h-6 w-6" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex rounded-full border border-white/10 bg-black/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/70">
              Support Priority
            </div>
            <h3 className={cn('font-semibold tracking-tight', compact ? 'text-lg' : 'text-xl md:text-2xl')}>
              {title}
            </h3>
            <p className={cn('max-w-2xl text-sm leading-6 text-foreground/72', compact ? 'md:max-w-md' : '')}>
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 font-mono text-xs tracking-[0.18em] text-foreground/70">
            wa.me/62895110050207
          </div>
          <Link
            className={cn(
              'inline-flex items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black transition-transform duration-200 hover:scale-[1.02]',
              'shadow-[0_14px_30px_rgba(37,211,102,0.28)]'
            )}
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            Chat via WhatsApp
          </Link>
        </div>
      </div>
    </div>
  )
}

export { WHATSAPP_ADMIN_URL }

