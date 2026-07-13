import { redirect } from 'next/navigation'

type Args = {
  params: Promise<{
    segments: string[]
  }>
}

const Page = async ({ params }: Args) => {
  const { segments = [] } = await params
  const nextPath = `/mlebu${segments.length ? `/${segments.join('/')}` : ''}`
  redirect(nextPath)
}

export default Page
