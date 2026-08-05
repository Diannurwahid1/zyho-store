'use client'

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { gaLogin } from '@/utilities/googleAnalytics'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

type Props = {
  googleEnabled?: boolean
}

export const LoginForm: React.FC<Props> = ({ googleEnabled = false }) => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        gaLogin('email_password')
        if (redirect?.current) router.push(redirect.current)
        else router.push('/account')
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'There was an error with the credentials provided. Please try again.',
        )
      }
    },
    [login, router],
  )

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <Message className="classes.message" error={error} />
      <div className="flex flex-col gap-6">
        {googleEnabled ? (
          <div className="rounded-[1.5rem] border bg-card/60 p-5">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Masuk lebih cepat dengan Google</h2>
              <p className="text-sm text-muted-foreground">
                Jalur utama customer ada di sini. Sekali klik langsung login atau membuat akun member baru.
              </p>
            </div>
            <GoogleSignInButton
              className="mt-4 w-full"
              label="Lanjut dengan Google"
              redirect={redirect.current}
            />
          </div>
        ) : null}

        <details className="rounded-[1.25rem] border border-dashed p-4">
          <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
            Gunakan email dan password sebagai alternatif
          </summary>
          <div className="mt-5 flex flex-col gap-8">
            <FormItem>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required.' })}
              />
              {errors.email && <FormError message={errors.email.message} />}
            </FormItem>

            <FormItem>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Please provide a password.' })}
              />
              {errors.password && <FormError message={errors.password.message} />}
            </FormItem>

            <div className="text-primary/70 prose prose-a:hover:text-primary dark:prose-invert">
              <p>
                Forgot your password?{' '}
                <Link href={`/forgot-password${allParams}`}>Click here to reset it</Link>
              </p>
            </div>

            <div className="flex gap-4 justify-between">
              <Button asChild variant="outline" size="lg">
                <Link href={`/create-account${allParams}`} className="grow max-w-[50%]">
                  Create an account
                </Link>
              </Button>
              <Button className="grow" disabled={isLoading} size="lg" type="submit" variant="default">
                {isLoading ? 'Processing' : 'Continue'}
              </Button>
            </div>
          </div>
        </details>
      </div>
    </form>
  )
}
