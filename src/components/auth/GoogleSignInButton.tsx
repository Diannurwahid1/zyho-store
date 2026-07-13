'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  className?: string
  label?: string
  redirect?: null | string
}

export const GoogleSignInButton: React.FC<Props> = ({ className, label = 'Masuk dengan Google', redirect }) => {
  const href = redirect
    ? `/api/auth/google/start?redirect=${encodeURIComponent(redirect)}`
    : '/api/auth/google/start'

  return (
    <Button asChild className={className} size="lg" variant="outline">
      <Link className="inline-flex items-center justify-center gap-2" href={href}>
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            d="M21.805 10.023h-9.68v3.955h5.547c-.239 1.272-.956 2.349-2.032 3.066v2.544h3.293c1.928-1.776 3.042-4.393 3.042-7.517 0-.68-.061-1.332-.17-1.948Z"
            fill="#4285F4"
          />
          <path
            d="M12.125 22c2.758 0 5.07-.914 6.76-2.472l-3.293-2.544c-.914.612-2.081.974-3.467.974-2.667 0-4.926-1.8-5.734-4.221H2.988v2.626A10.206 10.206 0 0 0 12.125 22Z"
            fill="#34A853"
          />
          <path
            d="M6.39 13.737A6.126 6.126 0 0 1 6.07 11.87c0-.648.111-1.278.32-1.866V7.378H2.988A10.206 10.206 0 0 0 1.945 11.87c0 1.632.392 3.177 1.043 4.492l3.401-2.625Z"
            fill="#FBBC05"
          />
          <path
            d="M12.125 5.782c1.5 0 2.847.516 3.909 1.53l2.931-2.93C17.19 2.73 14.878 1.74 12.125 1.74a10.206 10.206 0 0 0-9.137 5.638l3.401 2.626c.808-2.422 3.067-4.222 5.736-4.222Z"
            fill="#EA4335"
          />
        </svg>
        <span>{label}</span>
      </Link>
    </Button>
  )
}
