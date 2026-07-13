import { redirect } from 'next/navigation'

type Args = {
  params?: Promise<{
    segments?: string[]
  }>
}

const NotFound = async ({ params }: Args) => {
  const resolvedParams = (await params) || {}
  const segments = resolvedParams.segments || []
  const nextPath = `/mlebu${segments.length ? `/${segments.join('/')}` : ''}`
  redirect(nextPath)
}

export default NotFound
