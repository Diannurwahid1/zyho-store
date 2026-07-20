import Image from 'next/image'
import Link from 'next/link'

const paymentMethods = [
  {
    alt: 'BCA Virtual Account',
    badge: 'VA',
    height: 16,
    label: 'BCA',
    src: '/media/Bank_Central_Asia.svg.webp',
    width: 64,
  },
  {
    alt: 'BNI Virtual Account',
    badge: 'VA',
    height: 18,
    label: 'BNI',
    src: '/media/bni-logo.png',
    width: 46,
  },
  {
    alt: 'BRI Virtual Account',
    badge: 'VA',
    height: 18,
    label: 'BRI',
    src: '/media/payments/bri.png',
    width: 46,
  },
  {
    alt: 'Mandiri Virtual Account',
    badge: 'VA',
    height: 16,
    label: 'Mandiri',
    src: '/media/payments/mandiri.svg',
    width: 76,
  },
  {
    alt: 'QRIS',
    badge: 'Scan',
    height: 16,
    label: 'QRIS',
    src: '/media/payments/qris.png',
    width: 72,
  },
  {
    alt: 'USDT TRC20',
    badge: 'Crypto',
    label: 'USDT',
    width: 72,
  },
] as const

export function FooterPaymentMethods() {
  const seoLinks = [
    { href: '/shop', label: 'Belanja Produk Digital' },
    { href: '/products', label: 'Katalog Produk' },
    { href: '/account', label: 'Akun & Pesanan' },
    { href: '/cart', label: 'Keranjang Belanja' },
  ] as const

  return (
    <section className="max-w-md">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-black dark:text-white">Metode Pembayaran</h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Pembayaran aman via Virtual Account, QRIS, dan USDT untuk checkout yang cepat.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {paymentMethods.map((item) => (
          <div
            key={item.label}
            className="flex min-h-[52px] flex-col justify-between rounded-xl border border-neutral-200 bg-white px-2 py-1.5 shadow-[0_6px_18px_rgba(15,23,42,0.035)] dark:border-neutral-800 dark:bg-neutral-950"
          >
            <div className="flex min-h-6 items-center">
              {'src' in item ? (
                <Image
                  alt={item.alt}
                  className="h-auto w-auto object-contain"
                  height={item.height}
                  src={item.src}
                  width={item.width}
                />
              ) : (
                <div className="inline-flex items-center rounded-md bg-[#26A17B]/12 px-2 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#26A17B] dark:bg-[#26A17B]/16">
                  {item.label}
                </div>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                {item.label}
              </span>
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                {item.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900/70">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-200">
          Pembayaran Aman
        </p>
        <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Transaksi diproses dengan metode pembayaran resmi agar pesanan dan akses digital lebih
          aman.
        </p>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-black dark:text-white">Link Terkait</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {seoLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition-colors hover:border-neutral-400 hover:text-black dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
