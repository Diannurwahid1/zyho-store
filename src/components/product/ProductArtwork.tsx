import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import clsx from 'clsx'
import Image from 'next/image'

type ArtworkImage = {
  alt?: string
  url: string
}

type Props = {
  alt: string
  className?: string
  images: ArtworkImage[]
  isBundle?: boolean
  mediaFallback?: MediaType | null
  priority?: boolean
}

const RemoteImage = ({
  alt,
  className,
  priority,
  src,
}: {
  alt: string
  className?: string
  priority?: boolean
  src: string
}) => (
  <Image
    alt={alt}
    className={clsx('object-cover', className)}
    fill
    priority={priority}
    sizes="(max-width: 768px) 100vw, 50vw"
    src={src}
  />
)

export const ProductArtwork: React.FC<Props> = ({
  alt,
  className,
  images,
  isBundle = false,
  mediaFallback,
  priority,
}) => {
  if (!isBundle || images.length <= 1) {
    const firstImage = images[0]

    return (
      <div
        className={clsx(
          'relative h-full w-full overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800',
          className,
        )}
      >
        {firstImage ? (
          <RemoteImage alt={firstImage.alt || alt} priority={priority} src={firstImage.url} />
        ) : mediaFallback ? (
          <Media
            className="relative h-full w-full"
            imgClassName="h-full w-full object-cover"
            priority={priority}
            resource={mediaFallback}
          />
        ) : null}
      </div>
    )
  }

  const [firstImage, secondImage, thirdImage] = images

  return (
    <div
      className={clsx(
        'relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_40%),linear-gradient(160deg,#050816,#101828,#191919)]',
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%,rgba(250,204,21,0.06))]" />

      <div className="absolute left-[7%] top-[10%] h-[72%] w-[58%] rotate-[-9deg] overflow-hidden rounded-[1.1rem] border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <RemoteImage alt={firstImage.alt || alt} priority={priority} src={firstImage.url} />
      </div>

      <div className="absolute bottom-[11%] right-[8%] h-[62%] w-[54%] rotate-[8deg] overflow-hidden rounded-[1rem] border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
        <RemoteImage alt={secondImage.alt || alt} src={secondImage.url} />
      </div>

      {thirdImage ? (
        <div className="absolute right-[18%] top-[9%] h-[24%] w-[24%] overflow-hidden rounded-[0.85rem] border border-white/15 shadow-[0_18px_40px_rgba(0,0,0,0.38)]">
          <RemoteImage alt={thirdImage.alt || alt} src={thirdImage.url} />
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 rounded-full border border-amber-300/25 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-200 backdrop-blur-sm md:bottom-4 md:left-4 md:text-xs">
        Bundle
      </div>
    </div>
  )
}
