'use client'

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { MemberAvatar } from '@/components/member/MemberAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { CheckCircle2, Link2, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormData = {
  email: string
  name: User['name']
  password: string
  passwordConfirm: string
  phone: string
}

type Props = {
  googleEnabled: boolean
}

export const AccountForm: React.FC<Props> = ({ googleEnabled }) => {
  const { setUser, user } = useAuth()
  const [changePassword, setChangePassword] = useState(false)
  const [deleteReason, setDeleteReason] = useState(user?.deleteAccountReason || '')
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const {
    formState: { errors, isLoading, isSubmitting, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const router = useRouter()

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!user) return

      const body = changePassword
        ? {
            password: data.password,
          }
        : {
            email: data.email,
            name: data.name,
            phone: data.phone,
          }

      const response = await fetch(`/api/users/${user.id}`, {
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      if (response.ok) {
        const json = await response.json()
        setUser(json.doc)
        toast.success(changePassword ? 'Password berhasil diperbarui.' : 'Profil berhasil diperbarui.')
        setChangePassword(false)
        reset({
          email: json.doc.email,
          name: json.doc.name,
          password: '',
          passwordConfirm: '',
          phone: json.doc.phone || '',
        })
      } else {
        toast.error('Ada masalah saat memperbarui akun.')
      }
    },
    [changePassword, reset, setUser, user],
  )

  const handleDeleteRequest = useCallback(async () => {
    if (!user) return

    setDeleteSubmitting(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        body: JSON.stringify({
          deleteAccountReason: deleteReason,
          deleteAccountRequestedAt: new Date().toISOString(),
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error()
      }

      const json = await response.json()
      setUser(json.doc)
      toast.success('Pengajuan penghapusan akun sudah dikirim.')
    } catch {
      toast.error('Gagal mengirim pengajuan penghapusan akun.')
    } finally {
      setDeleteSubmitting(false)
    }
  }, [deleteReason, setUser, user])

  useEffect(() => {
    if (user === null) {
      router.push(
        `/login?error=${encodeURIComponent(
          'You must be logged in to view this page.',
        )}&redirect=${encodeURIComponent('/account/settings')}`,
      )
    }

    if (user) {
      setDeleteReason(user.deleteAccountReason || '')
      reset({
        email: user.email,
        name: user.name,
        password: '',
        passwordConfirm: '',
        phone: user.phone || '',
      })
    }
  }, [user, router, reset, changePassword])

  if (!user) {
    return null
  }

  const deleteRequestDate = user.deleteAccountRequestedAt
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(user.deleteAccountRequestedAt),
      )
    : null

  return (
    <div className="grid gap-6">
      <section className="rounded-[1.75rem] border bg-card/60 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <MemberAvatar
              name={user.name || user.email}
              sizeClassName="h-16 w-16"
              user={{
                avatar: user.avatar,
                googleAvatarURL: user.googleAvatarURL,
                name: user.name,
              }}
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{user.name || 'Member profile'}</h2>
              <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Tier {user.memberTier || 'bronze'}
              </p>
            </div>
          </div>

          <div className="md:ml-auto">
            {user.googleId ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Google connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                <Link2 className="h-4 w-4" />
                Google belum terhubung
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border bg-card/60 p-5 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Account details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update identitas akun utama yang dipakai untuk member dan checkout.
          </p>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
          {!changePassword ? (
            <Fragment>
              <div className="grid gap-5 md:grid-cols-2">
                <FormItem>
                  <Label htmlFor="name" className="mb-2">
                    Nama
                  </Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Please provide a name.' })}
                    type="text"
                  />
                  {errors.name && <FormError message={errors.name.message} />}
                </FormItem>

                <FormItem>
                  <Label htmlFor="email" className="mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    {...register('email', { required: 'Please provide an email.' })}
                    type="email"
                  />
                  {errors.email && <FormError message={errors.email.message} />}
                </FormItem>
              </div>

              <FormItem>
                <Label htmlFor="phone" className="mb-2">
                  Nomor HP
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                />
              </FormItem>

              <div className="flex flex-wrap items-center gap-3">
                <Button disabled={isLoading || isSubmitting || !isDirty} type="submit">
                  {isLoading || isSubmitting ? 'Processing' : 'Update account'}
                </Button>
                <Button
                  className="px-0"
                  onClick={() => setChangePassword(true)}
                  type="button"
                  variant="link"
                >
                  Ganti password
                </Button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="grid gap-5 md:grid-cols-2">
                <FormItem>
                  <Label htmlFor="password" className="mb-2">
                    Password baru
                  </Label>
                  <Input
                    id="password"
                    {...register('password', { required: 'Please provide a new password.' })}
                    type="password"
                  />
                  {errors.password && <FormError message={errors.password.message} />}
                </FormItem>

                <FormItem>
                  <Label htmlFor="passwordConfirm" className="mb-2">
                    Konfirmasi password
                  </Label>
                  <Input
                    id="passwordConfirm"
                    {...register('passwordConfirm', {
                      required: 'Please confirm your new password.',
                      validate: (value) => value === password.current || 'The passwords do not match',
                    })}
                    type="password"
                  />
                  {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
                </FormItem>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button disabled={isLoading || isSubmitting} type="submit">
                  {isLoading || isSubmitting ? 'Processing' : 'Change password'}
                </Button>
                <Button onClick={() => setChangePassword(false)} type="button" variant="ghost">
                  Batal
                </Button>
              </div>
            </Fragment>
          )}
        </form>
      </section>

      <section className="rounded-[1.75rem] border bg-card/60 p-5 md:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Google bind</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hubungkan akun Google untuk login cepat. Jika email Google sama, akun member ini akan tetap dipakai.
          </p>
        </div>

        {user.googleId ? (
          <div className="rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Akun Google sudah terhubung.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Login Google berikutnya akan langsung masuk ke akun member ini.
            </p>
          </div>
        ) : googleEnabled ? (
          <div className="flex flex-col gap-4 rounded-[1.25rem] border border-dashed p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">Hubungkan Google sekarang</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Gunakan email Google yang sama dengan akun ini agar proses bind tetap aman.
              </p>
            </div>
            <GoogleSignInButton className="w-full md:w-auto" redirect="/account/settings" />
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-dashed p-4 text-sm text-muted-foreground">
            Google Sign-In belum diaktifkan di environment ini.
          </div>
        )}
      </section>

      <section className="rounded-[1.75rem] border border-red-500/18 bg-red-500/[0.05] p-5 md:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/12 text-red-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Pengajuan penghapusan akun</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kirim pengajuan terlebih dulu. Tim akan review sebelum akun benar-benar dihapus.
            </p>
          </div>
        </div>

        {deleteRequestDate ? (
          <div className="mb-4 rounded-[1.2rem] border border-red-500/15 bg-red-500/[0.06] px-4 py-3 text-sm">
            Pengajuan terakhir terkirim pada <span className="font-medium">{deleteRequestDate}</span>.
          </div>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="deleteReason">Alasan penghapusan akun</Label>
          <textarea
            id="deleteReason"
            className="min-h-28 rounded-2xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
            onChange={(event) => setDeleteReason(event.target.value)}
            placeholder="Tuliskan alasan agar tim support bisa menindaklanjuti."
            value={deleteReason}
          />
        </div>

        <div className="mt-4">
          <Button disabled={deleteSubmitting} onClick={handleDeleteRequest} variant="destructive">
            {deleteSubmitting ? 'Mengirim...' : 'Ajukan penghapusan akun'}
          </Button>
        </div>
      </section>
    </div>
  )
}
